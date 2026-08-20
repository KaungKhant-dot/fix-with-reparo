import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, RotateCcw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { categoryShopLabels, type CategorySlug } from "@/lib/shops";
import { useCreateRepairRequest, useShops } from "@/lib/repair-data";
import { useAuth } from "@/lib/use-auth";
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
    prompt: "သားရေအိတ် ဇစ် ပျက်နေလို့ပါ",
    category: "bag",
    reply:
      "ဇစ်ခေါင်း (Slider) ကျွတ်တာ သို့မဟုတ် ဇစ်သွားဟနေတာ ဖြစ်နိုင်ပါတယ်။ ဇစ်ခေါင်းလဲရုံနဲ့ တင် အဆင်ပြေပြီး အိတ်ပြင်ဆိုင်အများစုမှာ တစ်ရက်တည်းနဲ့ အပြီးပြင်ပေးနိုင်ပါတယ်။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး အိတ်ပြင်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
  {
    id: "clothes",
    prompt: "အင်္ကျီ ချုပ်ရိုး ပြေထွက်သွားလို့ပါ",
    category: "clothes",
    reply:
      "ချုပ်ရိုးပြေတာက ပြန်ချုပ်ရုံပဲမို့ ရိုးရှင်းပါတယ်။ အပ်ချုပ်ဆိုင်တွေမှာ မိနစ်ပိုင်းအတွင်း အမြန်ချုပ်ပေးနိုင်ပါတယ်။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး အထည်ချုပ်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
  {
    id: "watches",
    prompt: "နာရီ ရုတ်တရက် ရပ်သွားလို့ပါ",
    category: "watches",
    reply:
      "ဓာတ်ခဲကုန်သွားတာ သို့မဟုတ် စက်အတွင်း ပစ္စည်းတစ်ခုခု နေရာလွဲသွားတာ ဖြစ်နိုင်ပါတယ်။ ဓာတ်ခဲလဲတာက မိနစ်ပိုင်းပဲ ကြာပါတယ်။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး နာရီပြင်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
  {
    id: "shoes",
    prompt: "ဖိနပ်ခွာ ကွာပြီး ဟနေလို့ပါ",
    category: "shoes",
    reply:
      "ဖိနပ်ကော်ပြယ်သွားတာ ဖြစ်နိုင်ပါတယ်။ ဖိနပ်ကော်သီးသန့်နဲ့ ပြန်ကပ်ခြင်း (သို့မဟုတ်) ဖိနပ်ဖဝါး (Sole) အသစ်လဲခြင်းဖြင့် ကောင်းကောင်း ပြန်သုံးနိုင်ပါတယ်။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး ဖိနပ်ပြင်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
  {
    id: "keys",
    prompt: "သော့တူ ကူးချင်လို့ပါ၊ သော့အိမ်ကလဲ ဖွင့်ရတာ ကျပ်နေတယ်",
    category: "keys",
    reply:
      "သော့တူကူးတာက မိနစ်ပိုင်းပဲ ကြာပါတယ်။ သော့အိမ်ကျပ်တာကတော့ ဂျီးဆေးချွတ်ရုံ (သို့) အတွင်းပင် အသစ်လဲရုံနဲ့ အဆင်ပြေပါတယ်။ မူရင်းသော့ ရှိရင် တစ်ခါတည်း ယူလာခဲ့ပါခင်ဗျာ။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး သော့ပြင်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
  {
    id: "glasses",
    prompt: "မျက်မှန်ဘောင် ကောက်သွားပြီး ပတ္တာ ချောင်နေလို့ပါ",
    category: "glasses",
    reply:
      "မျက်မှန်ဘောင်ကို ပြန်ညှိပေးလို့ရသလို ပတ္တာချောင်တာကိုလည်း ဝက်အူအသစ်လဲပြီး မိနစ်ပိုင်းအတွင်း အမြန်ပြင်ဆင်နိုင်ပါတယ်။",
    followUp: "သင့်တည်နေရာကို မျှဝေပေးပါ၊ အနီးဆုံး မျက်မှန်ပြင်ဆိုင်တွေကို ရှာပေးပါ့မယ်။",
  },
];

function AiScreen() {
  const { fullName } = useAuth();
  const greeting = `Hi ${fullName || "မိတ်ဆွေ"} 👋 ဘာပစ္စည်းများ ပြုပြင်ချင်ပါသလဲ — အိတ်၊ အဝတ်အထည်၊ နာရီ၊ ဖိနပ်၊ သော့ ဒါမှမဟုတ် မျက်မှန်လားခင်ဗျာ။`;
  const [selected, setSelected] = useState<Diagnosis | null>(null);
  const [locationShared, setLocationShared] = useState(false);
  const createRequest = useCreateRepairRequest();
  const { shops, isLoading: shopsLoading } = useShops({
    category: selected?.category ?? "all",
    sort: "nearest",
  });
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", text: greeting }]);

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
      { role: "user", text: "တည်နေရာ: Mandalay" },
      {
        role: "ai",
        text: `သင်နဲ့ အနီးဆုံး အကောင်းဆုံး ${categoryShopLabels[selected.category]} တွေကို ရှာတွေ့ပါပြီခင်ဗျာ။`,
      },
    ]);

    createRequest.mutate(
      {
        categorySlug: selected.category,
        itemDescription: selected.prompt,
        issueType: selected.id,
      },
      {
        onSuccess: () => toast.success("Saved your repair request."),
        onError: () => toast.error("Couldn't save your request right now."),
      },
    );
  };

  const reset = () => {
    setSelected(null);
    setLocationShared(false);
    setMessages([{ role: "ai", text: greeting }]);
  };

  const recommended = shops.filter((s) => s.isOpen).slice(0, 3);

  return (
    <div className="app-shell relative pb-32">
      <header className="ai-panel rounded-b-3xl px-6 pb-7 pt-8 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent">
            <Sparkles className="size-5 text-accent-foreground" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Reparo AI</h1>
            <p className="text-xs opacity-80">နေ့စဉ်သုံးပစ္စည်း ပြုပြင်မှုများအတွက် အသုံးဝင်သော AI အကြံပေး</p>
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
            <h2 className="text-base font-bold">အကြံပြုထားသော ဆိုင်များ</h2>
            <div className="mt-4 space-y-4">
              {shopsLoading ? (
                <ShopListSkeleton />
              ) : recommended.length > 0 ? (
                recommended.map((shop) => <ShopCard key={shop.id} shop={shop} />)
              ) : (
                <p className="text-sm text-muted-foreground">
                  ဤအမျိုးအစားတွင် လက်ရှိ ဖွင့်ထားသောဆိုင် မရှိသေးပါ — နောက်မှ ပြန်ကြည့်ပါ။
                </p>
              )}
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
              တည်နေရာမျှဝေပြီး အနီးဆုံးဆိုင်များ ရှာမည်
            </button>
          ) : (
            <>
              <p className="text-center text-xs text-muted-foreground">
                ဆိုင်တစ်ခုကို နှိပ်၍ အသေးစိတ်ကြည့်နိုင်ပါတယ်။
              </p>
              <button onClick={reset} className="btn-pill btn-primary">
                <RotateCcw className="size-4" />
                နောက်တစ်ခု မေးမည်
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNav active="ai" />
    </div>
  );
}
