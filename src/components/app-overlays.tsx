"use client";

import { CheckCircle2, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { APP_VERSION, releaseNotes } from "@/lib/app-core";

export function AppOverlays({
  showUpdate,
  onOpenUpdate,
  onCloseUpdate
}: {
  showUpdate: boolean;
  onOpenUpdate: () => void;
  onCloseUpdate: () => void;
}) {
  useEffect(() => {
    if (!showUpdate) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseUpdate();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCloseUpdate, showUpdate]);

  return (
    <>
      <button
        type="button"
        onClick={onOpenUpdate}
        className="fixed bottom-3 right-3 z-40 inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#c5d6ea] bg-white/90 px-3 text-xs font-black text-[#38516f] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
        title="ดูรายละเอียดการอัปเดต"
        aria-label={`ดูรายละเอียดการอัปเดต เวอร์ชัน ${APP_VERSION}`}
      >
        <Sparkles size={14} />
        v{APP_VERSION}
      </button>

      {showUpdate ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17243b]/55 px-4 py-6 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-dialog-title"
            className="panel animate-rise max-h-[calc(100svh-48px)] w-full max-w-xl overflow-y-auto rounded-[8px] p-5 shadow-[0_28px_80px_rgba(22,35,57,0.32)] sm:p-7"
          >
            <header className="flex items-start justify-between gap-5 border-b border-[#cdddf0] pb-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#2f6fb6]">
                  <Sparkles size={15} />
                  Version {APP_VERSION}
                </p>
                <h2
                  id="update-dialog-title"
                  className="mt-2 text-3xl font-black text-[#24324b] sm:text-4xl"
                >
                  มีอะไรใหม่
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667393]">
                  อัปเดตประสบการณ์ทำแบบประเมินและผลลัพธ์อาชีพ
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseUpdate}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c5d6ea] bg-white/80 text-[#38516f] transition hover:bg-white"
                aria-label="ปิดหน้าต่างอัปเดต"
                title="ปิด"
              >
                <X size={20} />
              </button>
            </header>

            <div className="divide-y divide-[#d9e5f3]">
              {releaseNotes.map((note) => (
                <div key={note} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 py-4">
                  <CheckCircle2 className="mt-0.5 text-[#2f8f8d]" size={20} />
                  <p className="text-sm font-bold leading-7 text-[#38516f] sm:text-base">{note}</p>
                </div>
              ))}
            </div>

            <footer className="mt-2 flex flex-col gap-3 border-t border-[#cdddf0] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-bold text-[#71809a]">Future Self Quest v{APP_VERSION}</p>
              <button
                type="button"
                onClick={onCloseUpdate}
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#2f6fb6] px-6 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#275f9e]"
              >
                เริ่มใช้งาน
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
