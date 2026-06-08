"use client";

import { Bot, LoaderCircle, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useAuth from "@/app/login/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mensagem = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: number;
};

const STORAGE_KEY = "fitplanner_chat_";

function loadMessages(usuario: string): Mensagem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY + usuario);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMessages(usuario: string, msgs: Mensagem[]) {
  try {
    localStorage.setItem(STORAGE_KEY + usuario, JSON.stringify(msgs));
  } catch {}
}

export default function AssistentePage() {
  const { user, isLoading, perguntarAgente } = useAuth();
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setMessages(loadMessages(user.nome));
    }
  }, [user]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pergunta = input.trim();
    if (!pergunta || sending || !user) return;
    const userMsg: Mensagem = {
      id: crypto.randomUUID(),
      role: "user",
      text: pergunta,
      timestamp: Date.now(),
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(user.nome, updated);
    setInput("");
    setSending(true);
    try {
      const resposta = await perguntarAgente(pergunta);
      const aiMsg: Mensagem = {
        id: crypto.randomUUID(),
        role: "ai",
        text: resposta,
        timestamp: Date.now(),
      };
      const withAi = [...updated, aiMsg];
      setMessages(withAi);
      saveMessages(user.nome, withAi);
    } catch {
      const errorMsg: Mensagem = {
        id: crypto.randomUUID(),
        role: "ai",
        text: "Desculpe, n\u00e3o consegui processar sua pergunta. Tente novamente.",
        timestamp: Date.now(),
      };
      const withError = [...updated, errorMsg];
      setMessages(withError);
      saveMessages(user.nome, withError);
    } finally {
      setSending(false);
    }
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion);
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 0);
  }

  function handleClear() {
    if (!user) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY + user.nome);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-10 animate-spin text-[#4a5a4a]" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#f8faf8] md:h-screen">
      <div className="flex items-center justify-between border-b border-[#e8f0e8] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
            <Bot className="size-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f1a0f]">Assistente IA</h1>
            <p className="text-sm text-[#6a7a6a]">
              Seu personal trainer virtual
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
            Limpar
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-green-50">
              <Bot className="size-8 text-green-600" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#0f1a0f]">
                Ol&#225;, {user?.nome}!
              </h2>
              <p className="mt-1 text-sm text-[#6a7a6a]">
                Pergunte sobre treinos, exercícios, nutrição ou metas fitness.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {[
                "Qual treino devo fazer hoje?",
                "Como ganhar massa muscular?",
                "Dicas para emagrecer",
                "Como melhorar minha evolu\u00e7\u00e3o?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-full border border-[#e8f0e8] bg-white px-3.5 py-1.5 text-sm text-[#4a5a4a] transition-colors hover:bg-[#f0f9f0] hover:text-green-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-[#0f1a0f]" : "bg-green-600"}`}
                >
                  {msg.role === "user" ? (
                    <User className="size-4 text-white" />
                  ) : (
                    <Bot className="size-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "rounded-br-sm bg-[#0f1a0f] text-white" : "rounded-bl-sm bg-white text-[#0f1a0f] shadow-sm"}`}
                >
                  {msg.role === "ai" ? (
                    <div className="chat-markdown">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </Markdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600">
                  <Bot className="size-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 animate-bounce rounded-full bg-green-600 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-green-600 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-green-600 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-[#e8f0e8] bg-white px-4 py-4 md:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre treinos, nutrição, metas..."
              className="h-11 rounded-xl border-[#e8f0e8] bg-[#f8faf8] text-sm focus:border-green-600 focus:ring-green-600/20"
              disabled={sending}
              maxLength={500}
            />
          </div>
          <Button
            type="submit"
            disabled={sending || !input.trim()}
            className="h-11 w-11 rounded-xl bg-green-600 px-0 hover:bg-green-700"
          >
            {sending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
