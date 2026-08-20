export type BannerStyle = "service" | "promo" | "delivery";

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
    cta: { label: "စမ်းသုံးကြည့်မယ်", to: "/ai" },
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
    id: "express-delivery",
    style: "delivery",
    title: "အိမ်အရောက် လာယူ/ပို့ဆောင်ပေးသော Express Service",
    subtitle:
      "ဆိုင်ထိ လာစရာမလိုဘဲ အိမ်အရောက် အပ်နှံနိုင်ပါပြီ",
    cta: { label: "အသေးစိတ်ကြည့်ရန်", to: "/ai" },
  },
];
