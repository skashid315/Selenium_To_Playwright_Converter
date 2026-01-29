# Findings

## Discovery Answers
1.  **North Star**: Web-based Selenium Java to Playwright TypeScript converter.
2.  **Integrations**: **Ollama API** (Local LLM `gemma3:4b`) for conversion logic.
3.  **Source of Truth**: User Input (UI).
4.  **Delivery Payload**: Display in UI + "New Directory" structure.
5.  **Behavioral Rules**: "Convert everything" using GenAI.

## Research
- **Parsing**:
    - **Primary**: Local LLM (`gemma3:4b`) via Ollama API.
    - **Fallback/Hybrid**: Regex/AST for structure if LLM hallucinates, but prompt implies reliance on LLM.
- **Ollama API**:
    - Endpoint: `http://localhost:11434/api/generate` (or `/api/chat`)
    - Model: `gemma3:4b`
    - CORS: User must run Ollama with `OLLAMA_ORIGINS="*"` for a browser-based app to access it directly, OR we need a simple proxy. (Browser -> Localhost is usually fine for same-machine, but CORS headers on Ollama are strict by default).
- **UI**: Monaco Editor.

## Constraints
- **Protocol**: B.L.A.S.T.
- **Architecture**: A.N.T. (3-Layer in Logic).
- **Tech Stack**: React, Vite, TypeScript.
- **Runtime**: User must have Ollama running locally.
