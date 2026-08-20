import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Send, Sparkles } from "lucide-react";
import { shops } from "@/lib/shops";
import { ShopCard } from "@/components/ShopCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Reparo AI Assistant | Reparo" },
      {
        name: "description",
        content:
          "Describe your repair problem and Reparo AI recommends nearby specialists in seconds.",
      },
      { property: "og:title", content: "Reparo AI Assistant | Reparo" },
      {
        property: "og:description",
        content: "Describe the problem — Reparo AI finds the right nearby repair shop.",
      },
    ],
  }),
  component: AiScreen,
});

type Message = { role: "user" | "ai"; text: string };

/** Deterministic scripted demo flow — no AI API. */
const script: { user: string; ai: string }[] = [
  {
    user: "My motorcycle broke down and won't start.",
    ai: "I can help you find a motorcycle repair service. Can you tell me what happened?",
  },
  {
    user: "The engine suddenly stopped.",
    ai: "Please share your location so I can find nearby repair shops.",
  },
];

const recommended = shops.filter((s) => s.category === "motorcycle" && s.available).slice(0, 3);

function AiScreen() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi Stella 👋 Describe your problem and I'll find the right specialist." },
  ]);
  const [locationShared, setLocationShared] = useState(false);

  const next = script[step];

  const sendNext = () => {
    if (!next) return;
    setMessages((m) => [...m, { role: "user", text: next.user }, { role: "ai", text: next.ai }]);
    setStep((s) => s + 1);
  };

  const shareLocation = () => {
    setLocationShared(true);
    setMessages((m) => [
      ...m,
      { role: "user", text: "Shared location: Riverside District" },
      {
        role: "ai",
        text: "Thanks! Here are 3 motorcycle repair shops available near you right now.",
      },
    ]);
  };

  return (
    <div className="app-shell relative pb-32">
      <header className="ai-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent">
            <Sparkles className="size-5 text-accent-foreground" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Reparo AI</h1>
            <p className="text-xs opacity-80">Describe the problem — we find the specialist.</p>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "ai"
                  ? "card-soft"
                  : "ml-auto bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {locationShared && (
          <section className="mt-8">
            <h2 className="text-base font-bold">Recommended Shops</h2>
            <div className="mt-4 space-y-4">
              {recommended.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          {next ? (
            <button onClick={sendNext} className="btn-pill btn-primary">
              <Send className="size-4" />
              {next.user}
            </button>
          ) : !locationShared ? (
            <button onClick={shareLocation} className="btn-pill btn-primary">
              <MapPin className="size-4" />
              Share my location
            </button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Tap a shop to view full details.
            </p>
          )}
        </div>
      </main>

      <BottomNav active="ai" />
    </div>
  );
}
