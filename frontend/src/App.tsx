import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { generateCode, checkOllamaConnection } from './lib/ollama';
import {
  Loader2,
  Copy,
  Check,
  Sparkles,
  Activity,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_JAVA_CODE = `package com.example.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginTest {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        driver.get("https://example.com/login");
        
        driver.findElement(By.id("user")).sendKeys("admin");
        driver.findElement(By.name("pass")).sendKeys("secret");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        
        System.out.println("Login success!");
        driver.quit();
    }
}
`;

export default function App() {
  const [sourceCode, setSourceCode] = useState(DEFAULT_JAVA_CODE);
  const [targetCode, setTargetCode] = useState('// Your converted code will glow here...');
  const [isConverting, setIsConverting] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const check = async () => setOllamaStatus(await checkOllamaConnection());
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = async () => {
    if (!sourceCode.trim()) return;
    setIsConverting(true);
    try {
      const prompt = `Convert this Java Selenium snippet into modern Playwright TypeScript. 
Follow best practices, use locator() and async/await. 
Only output the code, no markdown.
Snippet:
\${sourceCode}`;
      const result = await generateCode(prompt);
      setTargetCode(result.replace(/^```typescript\\n|```$/g, ''));
    } catch (err) {
      setTargetCode("// [SYSTEM ERROR]: Local LLM offline. Ensure Ollama 'gemma3:4b' is running.");
    } finally {
      setIsConverting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(targetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground font-sans overflow-hidden">

      {/* Minimalist Header */}
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-[#0d0d0d] z-50">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-[#8b5cf6]">Selenium</span>
            <span className="text-gray-400 mx-2">→</span>
            <span className="text-[#3b82f6]">Playwright</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-medium">Powered by Local LLM (Ollama)</p>
        </div>

        <button
          onClick={handleConvert}
          disabled={isConverting || !ollamaStatus}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-lg",
            isConverting
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white active:scale-95"
          )}
        >
          {isConverting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{isConverting ? "Converting..." : "Convert Code"}</span>
        </button>
      </header>

      {/* Main Split View */}
      <main className="flex-1 grid grid-cols-2 gap-px bg-white/5 overflow-hidden">

        {/* Left Side: Selenium (Input) */}
        <div className="flex flex-col bg-[#1e1e1e] relative">
          <div className="h-10 flex items-center px-4 bg-[#252526] border-b border-white/5">
            <span className="text-xs font-medium text-gray-400">Java (Selenium)</span>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="java"
              value={sourceCode}
              onChange={(val) => setSourceCode(val || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', monospace",
                wordWrap: 'on',
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* Right Side: Playwright (Output) */}
        <div className="flex flex-col bg-[#1e1e1e] border-l border-white/10 relative">
          <div className="h-10 flex items-center justify-between px-4 bg-[#252526] border-b border-white/5">
            <span className="text-xs font-medium text-gray-400">TypeScript (Playwright)</span>
            <button
              onClick={copyCode}
              className={cn(
                "p-1.5 rounded transition-colors",
                copied ? "text-green-500 bg-green-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              title="Copy code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={targetCode}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true,
                padding: { top: 16 },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', monospace",
                wordWrap: 'on',
                automaticLayout: true
              }}
            />
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="h-8 shrink-0 flex items-center px-6 border-t border-white/10 bg-[#0d0d0d] text-[10px] text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className={cn("h-3 w-3", ollamaStatus ? "text-green-500" : "text-red-500")} />
            <span className="uppercase tracking-wider">Ollama: {ollamaStatus ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <span className="uppercase tracking-wider">Mode: AI Converter 0.1</span>
        </div>
      </footer>
    </div>
  );
}
