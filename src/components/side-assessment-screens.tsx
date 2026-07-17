"use client";

import {
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  RotateCcw,
  UsersRound
} from "lucide-react";
import { cx, genderLabel, type Gender } from "@/lib/app-core";
import {
  engagementQuestions,
  engagementScale,
  leadershipStyleQuestions,
  type SideAnswerMap,
  type SideAssessmentResult,
  type SideQuestId
} from "@/lib/side-assessments";
import { RestartQuestButton } from "@/components/restart-quest-button";

export function SideAssessmentScreen({
  questId,
  playerName,
  gender,
  answers,
  currentIndex,
  onAnswer,
  onPrevious,
  onNext,
  onBackToHub,
  onRestart
}: {
  questId: SideQuestId;
  playerName: string;
  gender: Gender | null;
  answers: SideAnswerMap;
  currentIndex: number;
  onAnswer: (questionId: number, value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const isEngagement = questId === "engagement";
  const question = isEngagement
    ? engagementQuestions[currentIndex]
    : leadershipStyleQuestions[currentIndex];
  const total = isEngagement ? engagementQuestions.length : leadershipStyleQuestions.length;
  const answered = Object.keys(answers).length;
  const selected = answers[question.id];
  const accent = isEngagement ? "#39a7a5" : "#b84f73";
  const title = isEngagement ? "ความผูกพันต่อองค์กร" : "แบบทดสอบสไตล์ผู้นำ";
  const short = isEngagement ? "ENGAGEMENT" : "LEADERSHIP STYLE";

  return (
    <section className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="panel animate-rise rounded-[8px] p-5 lg:sticky lg:top-5 lg:h-fit">
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex h-10 items-center gap-2 text-sm font-black text-[#38516f] transition hover:text-[#2f6fb6]"
        >
          <ChevronLeft size={17} />
          กระดานเควสต์
        </button>

        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[8px] text-white" style={{ backgroundColor: accent }}>
            {isEngagement ? <HeartHandshake size={24} /> : <UsersRound size={24} />}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#71809a]">{short}</p>
            <p className="font-black text-[#24324b]">{title}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#cdddf0] pt-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">ผู้ทำแบบประเมิน</p>
          <p className="mt-1 text-xl font-black text-[#24324b]">{playerName}</p>
          <p className="text-sm font-bold text-[#61799b]">{genderLabel(gender)}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-[#24324b]">{Math.round((answered / total) * 100)}%</p>
            <p className="text-sm font-bold text-[#667393]">{answered}/{total}</p>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/75">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(answered / total) * 100}%`, backgroundColor: accent }} />
          </div>
          <RestartQuestButton onRestart={onRestart} disabled={answered === 0} />
        </div>
      </aside>

      <section className="panel animate-rise rounded-[8px] p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-[#cdddf0] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{short}</p>
            <h1 className="mt-1 text-3xl font-black text-[#24324b]">{title}</h1>
          </div>
          <span className="rounded-[8px] border border-[#cdddf0] bg-white/65 px-3 py-1.5 text-sm font-black text-[#61799b]">
            ข้อ {currentIndex + 1} จาก {total}
          </span>
        </div>

        <div className="mt-8 animate-fade" key={`${questId}-${question.id}`}>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#71809a]">Item {question.id}</p>
          <h2 className="mt-3 max-w-4xl text-2xl font-black leading-relaxed text-[#24324b] sm:text-3xl">
            {question.prompt}
          </h2>

          {isEngagement ? (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {engagementScale.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAnswer(question.id, option.value)}
                  className={cx(
                    "min-h-24 rounded-[8px] border px-3 py-3 text-center transition hover:-translate-y-0.5",
                    selected === option.value
                      ? "border-[#2d8d8b] bg-[#39a7a5] text-white shadow-[0_16px_35px_rgba(57,167,165,0.24)]"
                      : "border-[#c5d6ea] bg-white/70 text-[#38516f] hover:bg-white"
                  )}
                >
                  <span className="block text-2xl font-black">{option.value}</span>
                  <span className="mt-1 block text-xs font-bold leading-5 opacity-85">{option.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-3">
              {leadershipStyleQuestions[currentIndex].options.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => onAnswer(question.id, option.value)}
                      className={cx(
                        "grid min-h-16 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[8px] border px-4 py-3 text-left transition hover:-translate-y-0.5",
                        selected === option.value
                          ? "border-[#9d3f60] bg-[#b84f73] text-white shadow-[0_16px_35px_rgba(184,79,115,0.22)]"
                          : "border-[#dfbeca] bg-white/70 text-[#38516f] hover:bg-white"
                      )}
                    >
                      <span className={cx("grid h-10 w-10 place-items-center rounded-full border text-lg font-black", selected === option.value ? "border-white/50 bg-white/15" : "border-[#dfbeca] bg-[#fff2f6] text-[#b84f73]")}>
                        {option.code}
                      </span>
                      <span className="font-bold leading-6">{option.label}</span>
                    </button>
                  ))}
            </div>
          )}
        </div>

        <footer className="mt-8 flex flex-col gap-3 border-t border-[#cdddf0] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={cx(
              "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border px-5 text-sm font-black",
              currentIndex === 0
                ? "cursor-not-allowed border-[#d7e3f1] bg-white/35 text-[#98a6bb]"
                : "border-[#b8cce4] bg-white/75 text-[#38516f]"
            )}
          >
            <ChevronLeft size={18} />
            ย้อนกลับ
          </button>
          <p className="text-center text-sm font-bold text-[#667393]">คำตอบจะบันทึกไว้จนกว่าจะปิดแท็บ</p>
          <button
            type="button"
            onClick={onNext}
            disabled={selected === undefined}
            className={cx(
              "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-black text-white",
              selected === undefined ? "cursor-not-allowed bg-[#95abc6]" : "hover:-translate-y-0.5"
            )}
            style={selected === undefined ? undefined : { backgroundColor: accent }}
          >
            {currentIndex === total - 1 ? "ดูผลลัพธ์" : "ต่อไป"}
            <ChevronRight size={18} />
          </button>
        </footer>
      </section>
    </section>
  );
}

export function SideAssessmentResultScreen({
  questId,
  playerName,
  result,
  onBackToAnswers,
  onBackToHub,
  onRestart
}: {
  questId: SideQuestId;
  playerName: string;
  result: SideAssessmentResult;
  onBackToAnswers: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const isEngagement = questId === "engagement";
  const accent = isEngagement ? "#39a7a5" : "#b84f73";
  const normalized = Math.round(
    ((result.score - result.minScore) / (result.maxScore - result.minScore)) * 100
  );
  const ranges = isEngagement
    ? ["22-49 ยังไม่มีความผูกพัน", "50-79 มีความผูกพันบ้าง", "80-110 มีความผูกพันมาก"]
    : ["8-12 Autocratic", "13-19 Democratic", "20-24 Laissez-Faire"];

  return (
    <section className="mx-auto max-w-4xl animate-rise">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBackToHub} className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]">
          <ChevronLeft size={17} />
          กระดานเควสต์
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onBackToAnswers} className="h-11 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]">
            ดูคำตอบ
          </button>
          <button type="button" onClick={onRestart} className="inline-flex h-11 items-center gap-2 rounded-[8px] px-4 text-sm font-black text-white" style={{ backgroundColor: accent }}>
            <RotateCcw size={16} />
            ทำใหม่
          </button>
        </div>
      </div>

      <article className="panel rounded-[8px] p-5 sm:p-8">
        <div className="flex flex-col gap-5 border-b border-[#cdddf0] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: accent }}>
              {isEngagement ? "ENGAGEMENT RESULT" : "LEADERSHIP STYLE RESULT"}
            </p>
            <p className="mt-2 text-sm font-bold text-[#667393]">{playerName}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-[#24324b] sm:text-5xl">{result.title}</h1>
            {result.titleEn ? <p className="mt-2 text-lg font-black" style={{ color: accent }}>{result.titleEn}</p> : null}
          </div>
          <div className="min-w-32 rounded-[8px] border border-[#d5e3f4] bg-white/70 px-5 py-4 text-center">
            <p className="text-xs font-black uppercase text-[#71809a]">Score</p>
            <p className="mt-1 text-4xl font-black text-[#2d5f9c]">{result.score}</p>
            <p className="text-xs font-bold text-[#667393]">จาก {result.maxScore}</p>
          </div>
        </div>

        <div className="mt-7">
          <div className="h-4 overflow-hidden rounded-full bg-[#e3edf8]">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${normalized}%`, backgroundColor: accent }} />
          </div>
          <div className="mt-3 grid gap-2 text-xs font-bold text-[#667393] sm:grid-cols-3">
            {ranges.map((range, index) => (
              <div key={range} className={cx("border-l-2 pl-2", index === 0 && "sm:text-left", index === 1 && "sm:text-center", index === 2 && "sm:text-right")} style={{ borderColor: accent }}>
                {range}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-lg font-bold leading-8 text-[#3f5270]">{result.description}</p>
        <div className="mt-6 grid gap-5 border-t border-[#cdddf0] pt-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#168e8a]">จุดเด่น</p>
            <p className="mt-2 leading-7 text-[#586984]">{result.strengths}</p>
          </div>
          <div className="md:border-l md:border-[#cdddf0] md:pl-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b84f73]">สิ่งที่ควรระวัง</p>
            <p className="mt-2 leading-7 text-[#586984]">{result.watchOut}</p>
          </div>
        </div>

        <p className="mt-7 border-t border-[#cdddf0] pt-4 text-xs leading-5 text-[#71809a]">
          {isEngagement
            ? "อ้างอิง: Engagement Survey, Dale Carnegie ตามเอกสารประกอบการสอน ผลนี้ใช้เพื่อการสะท้อนประสบการณ์ทำงาน"
            : "อ้างอิง: แบบทดสอบสไตล์ผู้นำตามเอกสารประกอบการสอน ผลนี้สะท้อนแนวโน้มและไม่ใช่ข้อสรุปตายตัว"}
        </p>
      </article>
    </section>
  );
}
