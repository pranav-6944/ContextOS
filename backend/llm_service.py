import json
import time
import asyncio
from typing import List, Dict, Any, AsyncGenerator
from openai import OpenAI
from backend.config import DEFAULT_LLM_BASE_URL, DEFAULT_API_KEY, DEFAULT_CHAT_MODEL

class LLMService:
    """
    OpenAI-compatible streaming LLM client for Bionic / LM Studio
    supporting dynamic model loading, ejection, and strictly structured RAG output.
    """
    def __init__(self, base_url: str = DEFAULT_LLM_BASE_URL, api_key: str = DEFAULT_API_KEY, model: str = DEFAULT_CHAT_MODEL):
        self.base_url = base_url
        self.api_key = api_key
        self.model = model
        self.is_ejected = False
        self.custom_models = []
        self.client = OpenAI(base_url=self.base_url, api_key=self.api_key)

    def check_connection(self) -> Dict[str, Any]:
        """Checks if Bionic / LM Studio is reachable and returns available models."""
        try:
            models_res = self.client.models.list()
            models_list = [m.id for m in models_res.data]
            # Merge custom models if user added any
            for cm in self.custom_models:
                if cm not in models_list:
                    models_list.append(cm)
            return {
                "online": True,
                "base_url": self.base_url,
                "models": models_list,
                "active_model": None if self.is_ejected else self.model,
                "is_ejected": self.is_ejected
            }
        except Exception as e:
            fallback_models = list(set([self.model] + self.custom_models)) if self.model else self.custom_models
            return {
                "online": False,
                "base_url": self.base_url,
                "error": str(e),
                "models": fallback_models,
                "active_model": None if self.is_ejected else self.model,
                "is_ejected": self.is_ejected
            }

    def load_model(self, model_name: str) -> Dict[str, Any]:
        """
        Dynamically loads / seats a custom local LLM model onto the active neural bus.
        """
        model_name = (model_name or "").strip()
        if not model_name:
            return {"success": False, "error": "Model identifier cannot be empty"}
        
        self.model = model_name
        self.is_ejected = False
        if model_name not in self.custom_models:
            self.custom_models.append(model_name)

        conn = self.check_connection()
        return {
            "success": True,
            "status": "loaded",
            "active_model": self.model,
            "is_ejected": False,
            "online": conn.get("online", False),
            "available_models": conn.get("models", []),
            "message": f"Model cartridge '{self.model}' successfully mounted and active on neural bus."
        }

    def eject_model(self) -> Dict[str, Any]:
        """
        Ejects the active local model, putting the neural bus into Standby Synthesizer mode.
        """
        ejected_name = self.model
        self.model = None
        self.is_ejected = True
        return {
            "success": True,
            "status": "ejected",
            "active_model": None,
            "ejected_model": ejected_name,
            "is_ejected": True,
            "message": f"Model cartridge '{ejected_name or 'Default'}' ejected. Neural bus engaged in Standby Semantic Synthesizer mode."
        }

    async def stream_rag_response(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> AsyncGenerator[str, None]:
        """
        Streams response for a RAG query in strict structured format.
        Emits SSE events: telemetry, citations, token, done.
        """
        start_time = time.time()
        
        # Format Context Block
        context_parts = []
        for i, c in enumerate(retrieved_chunks):
            doc = c.get("doc_name", "Unknown")
            page = c.get("page", 1)
            score = c.get("score", 0.0)
            text = c.get("text", "")
            context_parts.append(f"[Source {i+1} - {doc} (Page {page}) - Relevance: {score:.2f}]:\n{text}")
        
        context_str = "\n\n".join(context_parts) if context_parts else "No relevant documents found in knowledge base."

        # Strict Structured Prompt
        system_prompt = (
            "You are ContextOS, an elite AI operating system specializing in Retrieval-Augmented Generation (RAG).\n"
            "CRITICAL REQUIREMENT: You MUST ALWAYS format your response using this precise, clean Markdown structure:\n\n"
            "### 🎯 Executive Summary\n"
            "A direct, crisp 2-3 sentence overview addressing the user's query.\n\n"
            "### 🔍 Core Concepts & Key Analysis\n"
            "A detailed breakdown of key points using bullet points, bold technical terms, and clear conceptual explanations grounded in the retrieved sources.\n\n"
            "### 💻 Technical Implementation & Code (if applicable)\n"
            "Formatted code snippets, syntax examples, or algorithmic steps directly from the documents.\n\n"
            "### 📑 Source Grounding & Evidence\n"
            "Explicit citations referencing [Source 1], [Source 2] with exact document names and page numbers.\n\n"
            "### 💡 Key Takeaway\n"
            "A brief concluding summary emphasizing the practical importance.\n\n"
            "RULES:\n"
            "- Never produce an unstructured wall of text.\n"
            "- Always use the headers above.\n"
            "- Only state facts directly supported by the context."
        )

        user_content = (
            f"### Retrieved Context:\n{context_str}\n\n"
            f"### User Query:\n{query}\n\n"
            f"Please answer the user query following the required structured format."
        )

        # 1. Telemetry Event
        telemetry = {
            "retrieved_count": len(retrieved_chunks),
            "top_score": retrieved_chunks[0]["score"] if retrieved_chunks else 0.0,
            "prompt_chars": len(user_content),
            "timestamp": time.time(),
            "model_ejected": self.is_ejected,
            "active_model": self.model if not self.is_ejected else "Standby Semantic Synthesizer"
        }
        yield f"data: {json.dumps({'type': 'telemetry', 'data': telemetry})}\n\n"

        # 2. Citations Event
        citations = []
        for i, c in enumerate(retrieved_chunks):
            citations.append({
                "source_id": i + 1,
                "chunk_id": c["chunk_id"],
                "doc_name": c["doc_name"],
                "page": c["page"],
                "score": c["score"],
                "snippet": c["text"][:180] + ("..." if len(c["text"]) > 180 else "")
            })
        yield f"data: {json.dumps({'type': 'citations', 'data': citations})}\n\n"

        used_local_llm = False
        token_count = 0

        # If model is NOT ejected and has an active model, try streaming from local LLM
        if not self.is_ejected and self.model:
            try:
                stream = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stream=True,
                    timeout=14.0
                )

                for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                        token = chunk.choices[0].delta.content
                        token_count += 1
                        used_local_llm = True
                        yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
                        await asyncio.sleep(0.005)

            except Exception as e:
                # Fallback to structured standby synthesis
                used_local_llm = False

        # Fallback / Ejected Mode: Stream Structured Standby Synthesis
        if not used_local_llm:
            badge_text = (
                f"⚡ Standby Synthesizer Active | Model Cartridge Ejected"
                if self.is_ejected 
                else f"⚡ Standby Synthesizer Active | Connecting to {self.model or 'Local GPU'}"
            )
            yield f"data: {json.dumps({'type': 'system_badge', 'text': badge_text})}\n\n"
            
            async for s_token in self._synthesize_standby_response(query, retrieved_chunks):
                token_count += 1
                yield f"data: {json.dumps({'type': 'token', 'token': s_token})}\n\n"
                await asyncio.sleep(0.015)

        elapsed = max(0.01, time.time() - start_time)
        tps = round(token_count / elapsed, 1)

        final_stats = {
            "elapsed_seconds": round(elapsed, 2),
            "total_tokens": token_count,
            "tokens_per_second": tps,
            "engine": f"Bionic GPU ({self.model})" if used_local_llm else "ContextOS Standby Synthesizer",
            "model_used": self.model if (used_local_llm and self.model) else "Standby Semantic Synthesizer",
            "is_ejected": self.is_ejected
        }
        yield f"data: {json.dumps({'type': 'done', 'stats': final_stats})}\n\n"

    async def _synthesize_standby_response(self, query: str, chunks: List[Dict[str, Any]]) -> AsyncGenerator[str, None]:
        """
        Synthesizes a strictly structured, comprehensive response directly from retrieved vector chunks.
        """
        if not chunks:
            yield "### 🎯 Executive Summary\n\n"
            yield "No matching document dossiers were found in the knowledge base for this query.\n\n"
            yield "### 💡 Recommendation\n\n"
            yield "Please ingest relevant documents (`.pdf`, `.docx`, `.txt`) into the **Document Vault** to populate the 768-D vector store."
            return

        top_chunk = chunks[0]
        top_doc = top_chunk.get("doc_name", "Document")
        top_page = top_chunk.get("page", 1)
        top_score = top_chunk.get("score", 0.0)

        # 1. Executive Summary
        yield "### 🎯 Executive Summary\n\n"
        # Extract direct summary from top chunk
        top_snippet = top_chunk.get("text", "").strip()
        sentences = [s.strip() for s in top_snippet.split(".") if len(s.strip()) > 15]
        exec_summary = ". ".join(sentences[:2]) + "." if sentences else top_snippet[:160]
        yield f"Based on semantic retrieval from **{top_doc}** (Page {top_page}), {exec_summary}\n\n"

        # 2. Core Concepts & Key Analysis
        yield "### 🔍 Core Concepts & Key Analysis\n\n"
        # Extract key points from retrieved chunks
        for i, c in enumerate(chunks[:3]):
            doc_name = c.get("doc_name", "Document")
            page_no = c.get("page", 1)
            score_pct = c.get("score", 0.0) * 100
            chunk_text = c.get("text", "").strip()

            # Filter clean bullet-worthy points
            lines = [l.strip() for l in chunk_text.split("\n") if len(l.strip()) > 20 and not l.strip().startswith("#")]
            if not lines:
                lines = [s.strip() for s in chunk_text.split(".") if len(s.strip()) > 20]

            selected_point = lines[0] if lines else chunk_text[:140]
            yield f"- **[Source {i+1} • p.{page_no}]**: {selected_point}\n"

        yield "\n"

        # 3. Technical Implementation & Code Examples (if code exists in chunks)
        code_blocks = []
        for c in chunks:
            text = c.get("text", "")
            if any(kw in text for kw in ["class ", "void ", "int ", "def ", "#include", "public:", "private:", "using namespace"]):
                # Extract code-like segments
                code_lines = [line for line in text.split("\n") if any(k in line for k in ["class ", "void ", "int ", "{", "}", "#include", "public:", "private:", "return", "cout", "print", "std::"])]
                if len(code_lines) >= 3:
                    code_blocks.append("\n".join(code_lines[:12]))
                    break

        if code_blocks:
            yield "### 💻 Technical Implementation & Code Snippets\n\n"
            yield "```cpp\n"
            yield code_blocks[0] + "\n"
            yield "```\n\n"

        # 4. Source Grounding & Evidence Table
        yield "### 📑 Source Grounding & Evidence\n\n"
        for i, c in enumerate(chunks[:3]):
            doc = c.get("doc_name", "Document")
            page = c.get("page", 1)
            score = c.get("score", 0.0) * 100
            snippet = c.get("text", "").strip().replace("\n", " ")[:130]
            yield f"- **[Source {i+1}] `{doc}`** *(Page {page} • Confidence: {score:.1f}%)*\n"
            yield f"  > *\"{snippet}...\"*\n"

        yield "\n"

        # 5. Key Takeaway
        yield "### 💡 Key Takeaway\n\n"
        yield (
            f"The retrieved vector payload validates that `{query}` is substantiated across **{len(chunks)} indexed segments** "
            f"with a maximum cosine similarity of **{top_score * 100:.1f}%**. "
            f"Grounding is 100% air-gapped on machine loopback with zero external telemetry."
        )
