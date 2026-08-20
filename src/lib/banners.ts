export type BannerStyle = "service" | "promo" | "revive";

export interface BannerSlide {
  id: string;
  style: BannerStyle;
  title: string;
  subtitle: string;
  badge?: string;
  cta: {
    label: string;
    to: string;
  };
}

export const banners: BannerSlide[] = [
  {
    id: "service-attraction",
    style: "service",
    title: "ပြင်ချင်တာတွေ မရှိဘူးလား? ရှိပါတယ်!",
    subtitle:
      "သင့်ရဲ့ အဝတ်အထည်၊ ဖိနပ်၊ နာရီ၊ အိတ် တွေကို နောက်တစ်ကြိမ် ပြန်လည်အသုံးပြုနိုင်အောင် ပြုပြင်ပေးမယ့် ဝန်ဆောင်မှုများ",
    cta: { label: "စမ်းသုံးကြည့်မယ်", to: "/search" },
  },
  {
    id: "special-promo",
    style: "promo",
    title: "ပထမဆုံး အကြိမ် အပ်ထည်များအတွက် 20% OFF!",
    subtitle:
      "ဖိနပ် နှင့် အိတ် ပြုပြင်ခြင်း ဝန်ဆောင်မှုအားလုံးအတွက် အထူးလျှော့စျေး",
    badge: "Limited Time Offer",
    cta: { label: "ကူပွန်ယူမည်", to: "/search" },
  },
  {
    id: "revive-instead-of-waste",
    style: "revive",
    title: "စွန့်ပစ်တော့မှာလား",
    subtitle:
      "မစွန့်ပစ်ခင် ပြန်လည်ပြုပြင်အသုံးပြုနိုင်ဖို့ Reparo မှာ ကျွမ်းကျင်ဆိုင်များကို ရှာဖွေလိုက်ပါ",
    cta: { label: "အသေးစိတ်ကြည့်ရန်", to: "/search" },
  },
];
