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
    title: "ပြင်ချင်တာတွေ မရှိဘူးလား?\u00a0",
    subtitle:
      "ပစ္စည်းတစ်ခု ပျက်သွားတိုင်း အသစ်ဝယ်ခြင်းက စွန့်ပစ်ပစ္စည်းတွေကို ပိုမိုများပြားစေပါတယ်။\nပြင်ဆင်ပြီး ပြန်လည်အသုံးပြုခြင်းက ငွေကုန်သက်သာစေရုံသာမက သဘာဝအရင်းအမြစ်တွေကိုလည်း ထိန်းသိမ်းပေးနိုင်ပါတယ်။",
    cta: { label: "စမ်းသုံးကြည့်မယ်", to: "/search" },
  },
  {
    id: "special-promo",
    style: "promo",
    title: "အသစ်ဝယ်ဖို့ မလောပါနဲ့",
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
