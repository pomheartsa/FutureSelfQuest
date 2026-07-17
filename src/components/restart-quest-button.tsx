"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "@/lib/app-core";

export function RestartQuestButton({
  onRestart,
  disabled = false
}: {
  onRestart: () => void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!confirming) {
          setConfirming(true);
          return;
        }
        setConfirming(false);
        onRestart();
      }}
      className={cx(
        "mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border px-3 text-sm font-black transition",
        disabled
          ? "cursor-not-allowed border-[#d7e3f1] bg-white/35 text-[#98a6bb]"
          : confirming
            ? "border-[#d19090] bg-[#fdeeee] text-[#b04a4a] hover:bg-[#fce3e3]"
            : "border-[#b8cce4] bg-white/70 text-[#38516f] hover:bg-white"
      )}
    >
      <RotateCcw size={16} />
      {!disabled && confirming ? "แตะอีกครั้งเพื่อล้างคำตอบทั้งหมด" : "เริ่มใหม่"}
    </button>
  );
}
