export interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

export interface OllamaRequest {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
        temperature?: number;
    };
}

export const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

export const checkOllamaConnection = async (): Promise<boolean> => {
    try {
        const res = await fetch('http://localhost:11434/api/tags');
        return res.ok;
    } catch (e) {
        console.error("Ollama connection failed", e);
        return false;
    }
};

export const generateCode = async (prompt: string, model: string = 'gemma3:4b'): Promise<string> => {
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
                options: {
                    temperature: 0.1 // Deterministic
                }
            } as OllamaRequest),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json() as OllamaResponse;
        return data.response;
    } catch (error) {
        console.error("Code generation failed", error);
        throw error;
    }
};
