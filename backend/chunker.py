import re
from typing import List, Dict, Any

class RecursiveChunker:
    """
    Intelligent recursive text chunker preserving sentence integrity,
    semantic boundaries, and detailed metadata for citation tracking.
    """
    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", ". ", "? ", "! ", "; ", " ", ""]

    def chunk_document_pages(self, doc_id: str, doc_name: str, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        chunks = []
        global_idx = 0
        for page_data in pages:
            page_num = page_data.get("page", 1)
            section = page_data.get("section", "")
            raw_text = page_data.get("content", "").strip()
            
            if not raw_text:
                continue

            page_chunks = self._split_text(raw_text)
            for idx, chunk_text in enumerate(page_chunks):
                if not chunk_text.strip():
                    continue
                words = len(chunk_text.split())
                chunks.append({
                    "chunk_id": f"{doc_id}_c{global_idx}",
                    "doc_id": doc_id,
                    "doc_name": doc_name,
                    "page": page_num,
                    "section": section,
                    "chunk_index": global_idx,
                    "text": chunk_text.strip(),
                    "word_count": words,
                    "char_count": len(chunk_text)
                })
                global_idx += 1
        return chunks

    def _split_text(self, text: str) -> List[str]:
        return self._recursive_split(text, self.separators)

    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        final_chunks = []
        separator = separators[-1]
        new_separators = []
        for i, sep in enumerate(separators):
            if sep == "":
                separator = ""
                break
            if sep in text:
                separator = sep
                new_separators = separators[i + 1:]
                break

        splits = text.split(separator) if separator != "" else list(text)
        good_splits = []
        
        for s in splits:
            if len(s) < self.chunk_size:
                good_splits.append(s)
            else:
                if good_splits:
                    merged = self._merge_splits(good_splits, separator)
                    final_chunks.extend(merged)
                    good_splits = []
                if not new_separators:
                    final_chunks.append(s[:self.chunk_size])
                else:
                    other_chunks = self._recursive_split(s, new_separators)
                    final_chunks.extend(other_chunks)
        
        if good_splits:
            merged = self._merge_splits(good_splits, separator)
            final_chunks.extend(merged)
            
        return final_chunks

    def _merge_splits(self, splits: List[str], separator: str) -> List[str]:
        merged = []
        current_chunk = []
        current_length = 0

        for split in splits:
            split_len = len(split)
            sep_len = len(separator) if current_chunk else 0
            if current_length + split_len + sep_len > self.chunk_size:
                if current_chunk:
                    doc = separator.join(current_chunk)
                    merged.append(doc)
                    # Handle overlap
                    while current_chunk and current_length > self.chunk_overlap:
                        popped = current_chunk.pop(0)
                        current_length -= (len(popped) + (len(separator) if current_chunk else 0))
                current_chunk.append(split)
                current_length += split_len
            else:
                current_chunk.append(split)
                current_length += split_len + sep_len

        if current_chunk:
            doc = separator.join(current_chunk)
            merged.append(doc)
        return merged
