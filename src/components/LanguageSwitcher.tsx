"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/cookie";
import { Globe } from "lucide-react";
import { useState } from "react";

const locales = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = (code: string) => {
    setCookie("NEXT_LOCALE", code, 365);
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
      >
        <Globe className="h-3.5 w-3.5" />
        {locale}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[140px] rounded-lg border border-white/10 bg-[#001C44] p-1.5 shadow-lg">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`block w-full text-left rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 ${
                  locale === l.code ? "text-white font-semibold" : "text-white/70"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
