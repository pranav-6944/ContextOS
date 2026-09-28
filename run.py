import os
import sys
import uvicorn
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("=" * 65)
    print("  [*] ContextOS: Next-Gen 3D RAG Operating System")
    print("  [*] Connected to Bionic / LM Studio: http://localhost:1234/v1")
    print("  [*] Web Interface: http://localhost:8000")
    print("=" * 65)

    # Ensure working directory is project root
    os.chdir(Path(__file__).parent)

    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
