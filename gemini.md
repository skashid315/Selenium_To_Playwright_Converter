# Gemini - Project Constitution

## Data Schemas
**The Data-First Rule**: Coding only begins once the "Payload" shape is confirmed.

### Core Payload: `ConversionPayload`

```json
{
  "request": {
    "id": "uuid-v4",
    "sourceFiles": [
      {
        "name": "LoginPage.java",
        "content": "public class LoginPage { ... }"
      }
    ],
   "options": {
      "targetFramework": "playwright",
      "testRunner": "playwright-test",
      "assertions": "expect",
      "includePageObjectModel": true,
      "llmConfig": {
        "model": "gemma3:4b",
        "temperature": 0.2
      }
    }
  },
  "response": {
    "status": "success",
    "generatedFiles": [],
    "errors": [],
    "logs": ["Connected to Ollama", "Model: gemma3:4b"]
  }
}
```

## Behavioral Rules
1. **Reliability**: Prioritize reliability.
2. **Determinism**: Use low temperature (0.1-0.2) for Code Gen.
3. **No Guessing**: Do not guess business logic; rely on source.
4. **Data-First**: Define schema before tools.
5. **Completeness**: "Convert Everything".
6. **Local-First**: Depend on local Ollama instance.

## Architectural Invariants
1. **3-Layer Architecture**:
    - **Layer 1 (Architecture)**: Prompts & SOPs.
    - **Layer 2 (Navigation)**: React State / Controller.
    - **Layer 3 (Tools)**: Ollama Service Client.
2. **Golden Rule**: If logic changes, update the System Prompt/SOP before code.
