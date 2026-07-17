"use client";

import { LockKeyhole, Play, Sparkles, UserRound } from "lucide-react";
import { cx, genderLabel, genderOptions, type Gender } from "@/lib/app-core";
import { questions } from "@/lib/assessment";
import { belbinSections } from "@/lib/belbin-assessment";
import { leadershipPotentialQuestions } from "@/lib/leadership-potential";
import {
  engagementQuestions,
  leadershipStyleQuestions
} from "@/lib/side-assessments";

export function StartScreen({
  playerName,
  setPlayerName,
  gender,
  setGender,
  onStart
}: {
  playerName: string;
  setPlayerName: (value: string) => void;
  gender: Gender | null;
  setGender: (value: Gender) => void;
  onStart: () => void;
}) {
  const canStart = Boolean(playerName.trim() && gender);
  const assessmentPreview = [
    { short: "MAIN", title: "Future Self Quest", detail: `${questions.length} ข้อ` },
    { short: "ENGAGE", title: "ความผูกพันต่อองค์กร", detail: `${engagementQuestions.length} ข้อ` },
    { short: "LEAD", title: "สไตล์ผู้นำ", detail: `${leadershipStyleQuestions.length} ข้อ` },
    { short: "COLOR", title: "ภาวะผู้นำ 4 สี", detail: `${leadershipPotentialQuestions.length} ข้อ` },
    { short: "BELBIN", title: "บทบาทในทีม", detail: `${belbinSections.length} ส่วน` }
  ];

  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_430px]">
      <div className="animate-rise">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-[#2d5f9c] shadow-sm">
          <Sparkles size={16} />
          Future Self Quest
        </p>
        <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-[#223656] sm:text-7xl">
          ลงทะเบียนนักผจญภัย
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#51627f]">
          ตั้งชื่อและเลือกเพศครั้งเดียว จากนั้นเลือกทำแบบประเมินแต่ละชุดแยกกันได้
        </p>

        <div className="mt-8 max-w-xl space-y-5 rounded-[8px] border border-white/70 bg-white/70 p-4 shadow-insetPanel backdrop-blur sm:p-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38516f]">
              <UserRound size={16} />
              ชื่อตัวละคร
            </label>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              className="h-14 w-full rounded-[8px] border border-[#b8cce4] bg-white/85 px-4 text-lg font-bold text-[#24324b] shadow-inner outline-none transition focus:border-[#2f6fb6] focus:ring-4 focus:ring-[#8ab7ed]/20"
              maxLength={28}
              placeholder="ใส่ชื่อผู้เล่น"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-[#38516f]">เพศ</legend>
            <div className="grid grid-cols-2 gap-3">
              {genderOptions.map((option) => {
                const selected = gender === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setGender(option.value)}
                    className={cx(
                      "flex h-16 items-center justify-between rounded-[8px] border px-4 text-left transition hover:-translate-y-0.5",
                      selected
                        ? option.value === "female"
                          ? "border-[#b84f73] bg-[#b84f73] text-white shadow-[0_16px_32px_rgba(184,79,115,0.24)]"
                          : "border-[#2f6fb6] bg-[#2f6fb6] text-white shadow-glow"
                        : option.value === "female"
                          ? "border-[#e3b5c5] bg-[#fff7fa] text-[#784057] hover:bg-[#fff0f5]"
                          : "border-[#c5d6ea] bg-white/75 text-[#38516f] hover:bg-white"
                    )}
                  >
                    <span>
                      <span className="block text-base font-black">{option.label}</span>
                      <span className="block text-xs font-bold opacity-70">{option.labelEn}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        "grid h-10 w-10 place-items-center rounded-full border text-3xl font-black leading-none",
                        selected
                          ? "border-white/45 bg-white/15 text-white"
                          : option.value === "female"
                            ? "border-[#e3b5c5] bg-[#ffeaf1] text-[#b84f73]"
                            : "border-[#b8cce4] bg-[#edf5ff] text-[#2f6fb6]"
                      )}
                    >
                      {option.symbol}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-7 grid max-w-5xl gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {assessmentPreview.map((assessment) => (
            <div
              key={assessment.short}
              className="rounded-[8px] border border-white/70 bg-white/62 p-4 shadow-sm backdrop-blur"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
                {assessment.short}
              </p>
              <p className="mt-2 text-base font-black text-[#24324b]">{assessment.title}</p>
              <p className="mt-1 text-sm text-[#657692]">{assessment.detail}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          disabled={!canStart}
          className={cx(
            "mt-8 inline-flex h-14 items-center gap-3 rounded-[8px] px-7 text-lg font-black text-white transition",
            canStart
              ? "bg-[#2f6fb6] shadow-glow hover:-translate-y-0.5 hover:bg-[#275f9e]"
              : "cursor-not-allowed bg-[#95abc6]"
          )}
        >
          <Play size={20} fill="currentColor" />
          ไปเลือกแบบประเมิน
        </button>
      </div>

      <div className="panel animate-rise rounded-[8px] p-6 [animation-delay:120ms]">
        <div className="relative mx-auto flex aspect-[4/5] max-h-[560px] items-center justify-center overflow-hidden rounded-[8px] border border-white/80 bg-[#dcebf7]">
          <img
            src="/quest-hall.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-white/38" />
          <div className="pulse-rune absolute bottom-20 h-28 w-56 rounded-[50%] border-4 border-[#8ab7ed]/45" />
          <div className="relative z-10 flex max-w-xs flex-col items-center px-6 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-white/80 bg-[#2f6fb6] text-white shadow-glow">
              <LockKeyhole size={34} />
            </span>
            <p className="mt-6 text-xs font-black text-[#61799b]">อาชีพของคุณ</p>
            <p className="mt-1 text-6xl font-black text-[#24324b]">???</p>
            <p className="mt-4 text-sm font-bold leading-6 text-[#586984]">
              อาชีพจะปลดล็อกเมื่อทำ Main Quest ครบ
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
              Adventurer
            </p>
            <p className="text-2xl font-black text-[#24324b]">
              {playerName.trim() || "ยังไม่ได้ตั้งชื่อ"}
            </p>
            <p className="mt-1 text-sm font-bold text-[#2d5f9c]">
              {gender ? genderLabel(gender) : "ยังไม่ได้เลือกเพศ"}
            </p>
          </div>
          <div className="rounded-[8px] border border-[#d5e3f4] bg-white/70 px-4 py-3 text-right">
            <p className="text-xs font-bold text-[#6a7890]">Assessments</p>
            <p className="text-2xl font-black text-[#2d5f9c]">{assessmentPreview.length}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
