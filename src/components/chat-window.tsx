import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, User, Bot, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STORAGE_KEY = "kle-chat-messages-v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

const suggestions = [
  "Introduce yourself",
  "Tell me about KLE",
  "What can you help me with?",
  "About the college",
];

export function ChatWindow() {
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "kle-single-conversation",
    messages: initialMessages,
    transport: transport.current,
    onError: (err) => {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota errors */
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  // Focus textarea
  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus();
  }, [isLoading, messages.length]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    void sendMessage({ text: trimmed });
    setInput("");
  };

  const handleReset = () => {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    toast.success("Conversation cleared");
  };

  return (
    <div className="glass-panel relative flex h-[70vh] min-h-[520px] w-full flex-col overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)]">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              KLE Assistant
            </p>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  Thinking...
                </span>
              ) : (
                "Online · ready to chat"
              )}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            New chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
              Namaste — I'm the KLE Assistant
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask me anything about KLE, our college, or say hi and I'll
              introduce myself.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border/70 bg-surface px-4 py-2 text-xs font-medium text-foreground/80 transition-all hover:border-primary/60 hover:bg-accent hover:text-foreground hover:shadow-[var(--shadow-glow)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {status === "submitted" && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="border-t border-border/60 bg-surface/60 p-3 sm:p-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-background/60 p-2 shadow-lg focus-within:border-primary/70 focus-within:shadow-[var(--shadow-glow)] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask a question..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
            style={{ maxHeight: "160px" }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 shrink-0 rounded-xl bg-[var(--gradient-gold)] text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground/70">
          Press Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-[var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow">
          {text}
        </div>
      ) : (
        <div className="prose prose-sm prose-invert max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-elevated px-4 py-2.5 text-sm text-foreground shadow prose-p:my-1.5 prose-headings:mt-2 prose-headings:mb-1 prose-ul:my-1.5 prose-ol:my-1.5 prose-strong:text-foreground prose-code:text-primary">
          <ReactMarkdown>{text || "…"}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-surface-elevated px-4 py-3 shadow">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
      </div>
    </div>
  );
}
