import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, RotateCcw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { categoryLabels, type CategorySlug } from "@/lib/shops";
import { useCreateRepairRequest, useShops } from "@/lib/repair-data";
import { ShopListSkeleton } from "@/components/ShopListSkeleton";
import { ShopCard } from "@/components/ShopCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Reparo AI Assistant | Reparo" },
      {
        name: "description",
        content:
          "Describe your repair problem and Reparo AI recommends nearby bag, clothes, watch, shoe, key and glasses specialists.",
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

/** Deterministic scripted diagnoses — no AI API. */
type Diagnosis = {
  id: string;
  prompt: string;
  category: CategorySlug;
  reply: string;
  followUp: string;
};

const diagnoses: Diagnosis[] = [
  {
    id: "bag",
    prompt: "The zipper on my leather bag is broken.",
    category: "bag",
    reply:
      "Sounds like a jammed or split zipper slider. That's usually a slider swap — most bag specialists finish it same day.",
    followUp: "Share your location and I'll list bag repair shops near you.",
  },
  {
    id: "clothes",
    prompt: "My shirt is torn along the seam.",
    category: "clothes",
    reply:
      "A seam tear is a quick re-stitch. A tailor can also reinforce the surrounding seam so it doesn't reopen.",
    followUp: "Share your location and I'll find tailoring shops nearby.",
  },
  {
    id: "watches",
    prompt: "My watch suddenly stopped working.",
    category: "watches",
    reply:
      "For a quartz watch this is almost always a dead battery; if it's mechanical it likely needs movement servicing.",
    followUp: "Share your location and I'll show watch specialists close to you.",
  },
  {
    id: "shoes",
    prompt: "The sole of my shoe is cracked and peeling.",
    category: "shoes",
    reply:
      "A cracked sole needs re-gluing or a full sole replacement — a cobbler can also add a protective heel tip.",
    followUp: "Share your location and I'll list shoe repair shops nearby.",
  },
  {
    id: "keys",
    prompt: "I need a duplicate key and my lock is sticking.",
    category: "keys",
    reply:
      "Key cutting takes minutes; a sticking lock usually just needs cleaning or a rekey — bring the original key if you have it.",
    followUp: "Share your location and I'll find locksmiths near you.",
  },
  {
    id: "glasses",
    prompt: "My glasses frame is bent and the hinge is loose.",
    category: "glasses",
    reply:
      "That's a frame realignment plus a hinge screw or hinge weld — an eyewear technician can do it while you wait.",
    followUp: "Share your location and I'll show eyewear repair shops nearby.",
  },
];

function AiScreen() {
  const [selected, setSelected] = useState<Diagnosis | null>(null);
  const [locationShared, setLocationShared] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi Stella 👋 What needs repairing — a bag, clothes, a watch, shoes, keys or glasses?",
    },
  ]);

  const pick = (d: Diagnosis) => {
    setSelected(d);
    setLocationShared(false);
    setMessages((m) => [
      ...m,
      { role: "user", text: d.prompt },
      { role: "ai", text: d.reply },
      { role: "ai", text: d.followUp },
    ]);
  };

  const shareLocation = () => {
    if (!selected) return;
    setLocationShared(true);
    setMessages((m) => [
      ...m,
      { role: "user", text: "Shared location: Mandalay" },
      {
        role: "ai",
        text: `Here are the top ${categoryLabels[selected.category]} repair shops open near you right now.`,
      },
    ]);
  };

  const reset = () => {
    setSelected(null);
    setLocationShared(false);
    setMessages([
      {
        role: "ai",
        text: "Hi Stella 👋 What needs repairing — a bag, clothes, a watch, shoes, keys or glasses?",
      },
    ]);
  };

  const recommended = selected
    ? filterAndSortShops({ category: selected.category, sort: "nearest" })
        .filter((s) => s.isOpen)
        .slice(0, 3)
    : [];

  return (
    <div className="app-shell relative pb-32">
      <header className="ai-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent">
            <Sparkles className="size-5 text-accent-foreground" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Reparo AI</h1>
            <p className="text-xs opacity-80">Smart diagnosis for everyday repairs.</p>
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

        {locationShared && recommended.length > 0 && (
          <section className="mt-8">
            <h2 className="text-base font-bold">Recommended Shops</h2>
            <div className="mt-4 space-y-4">
              {recommended.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 space-y-3">
          {!selected ? (
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((d) => (
                <button
                  key={d.id}
                  onClick={() => pick(d)}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground"
                >
                  <Send className="size-3.5" />
                  {d.prompt}
                </button>
              ))}
            </div>
          ) : !locationShared ? (
            <button onClick={shareLocation} className="btn-pill btn-primary">
              <MapPin className="size-4" />
              Share my location
            </button>
          ) : (
            <>
              <p className="text-center text-xs text-muted-foreground">
                Tap a shop to view full details.
              </p>
              <button onClick={reset} className="btn-pill btn-primary">
                <RotateCcw className="size-4" />
                Ask about something else
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNav active="ai" />
    </div>
  );
}
