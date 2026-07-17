"use client";

import { Check, ChevronLeft, ChevronRight, Crown, RotateCcw } from "lucide-react";
import { cx, genderLabel, type Gender } from "@/lib/app-core";
import {
  leadershipPotentialCodes,
  leadershipPotentialProfiles,
  leadershipPotentialQuestions,
  type LeadershipPotentialAnswers,
  type LeadershipPotentialCode,
  type LeadershipPotentialResult
} from "@/lib/leadership-potential";
import { RestartQuestButton } from "@/components/restart-quest-button";

function getLeadershipPotentialProfile(code: LeadershipPotentialCode) {
  return leadershipPotentialProfiles.find((profile) => profile.code === code)!;
}

export function LeadershipPotentialScreen({
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
  playerName: string;
  gender: Gender | null;
  answers: LeadershipPotentialAnswers;
  currentIndex: number;
  onAnswer: (questionId: number, code: LeadershipPotentialCode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const accent = "#795b85";
  const question = leadershipPotentialQuestions[currentIndex];
  const selected = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const total = leadershipPotentialQuestions.length;
  const progress = Math.round((answeredCount / total) * 100);

  return (
    <section className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="panel h-fit rounded-[8px] p-5 lg:sticky lg:top-5">
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 text-sm font-black text-[#536b8c] transition hover:text-[#24324b]"
        >
          <ChevronLeft size={17} />
          กระดานเควสต์
        </button>
        <div className="mt-6 flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-[8px] text-white"
            style={{ backgroundColor: accent }}
          >
            <Crown size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">
              Color Quest
            </p>
            <p className="text-lg font-black text-[#24324b]">{playerName}</p>
            <p className="text-xs font-bold text-[#61799b]">{genderLabel(gender)}</p>
          </div>
        </div>

        <div className="mt-7 border-t border-[#cdddf0] pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">
                Progress
              </p>
              <p className="mt-1 text-3xl font-black text-[#24324b]">{progress}%</p>
            </div>
            <p className="text-sm font-black text-[#61799b]">
              {answeredCount}/{total}
            </p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e3edf8]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-[#667393]">
            เลือกคำตอบที่ใกล้กับตัวคุณที่สุด ระบบจะนับ A, B, C และ D เพื่อหาสีที่เด่น
          </p>
          <RestartQuestButton onRestart={onRestart} disabled={answeredCount === 0} />
        </div>
      </aside>

      <section className="panel animate-rise rounded-[8px] p-5 sm:p-7">
        <header className="border-b border-[#cdddf0] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-[6px] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white"
                style={{ backgroundColor: accent }}
              >
                ภาวะผู้นำ 4 สี
              </span>
              <span className="rounded-[6px] border border-[#cdddf0] bg-white/65 px-3 py-1.5 text-xs font-black text-[#61799b]">
                ข้อ {currentIndex + 1} จาก {total}
              </span>
            </div>
            <span className="text-sm font-black text-[#61799b]">{progress}%</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-[#24324b] sm:text-4xl">
            แบบทดสอบภาวะผู้นำ
          </h1>
        </header>

        <div className="py-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#71809a]">
            Item {question.id}
          </p>
          <h2 className="mt-3 text-2xl font-black leading-9 text-[#24324b] sm:text-3xl">
            {question.prompt}
          </h2>

          <div className="mt-6 grid gap-3" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option) => {
              const optionProfile = getLeadershipPotentialProfile(option.code);
              const isSelected = selected === option.code;

              return (
                <button
                  key={option.code}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onAnswer(question.id, option.code)}
                  className={cx(
                    "flex min-h-20 items-center gap-4 rounded-[8px] border-2 p-4 text-left transition sm:px-5",
                    isSelected
                      ? "text-white shadow-lg"
                      : "border-[#c9d9ec] bg-white/65 text-[#334967] hover:-translate-y-0.5 hover:bg-white"
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: optionProfile.color,
                          backgroundColor: optionProfile.color
                        }
                      : undefined
                  }
                >
                  <span
                    className={cx(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 text-lg font-black",
                      isSelected ? "border-white/55 bg-white/15" : "bg-white"
                    )}
                    style={
                      isSelected
                        ? undefined
                        : {
                            borderColor: optionProfile.color,
                            color: optionProfile.color
                          }
                    }
                  >
                    {option.code}
                  </span>
                  <span className="text-base font-bold leading-7 sm:text-lg">{option.label}</span>
                  {isSelected ? <Check className="ml-auto shrink-0" size={21} /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <footer className="grid gap-3 border-t border-[#cdddf0] pt-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
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
          <p className="text-center text-sm font-bold text-[#667393]">
            คำตอบจะบันทึกไว้จนกว่าจะปิดแท็บ
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={selected === undefined}
            className={cx(
              "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-black text-white",
              selected === undefined
                ? "cursor-not-allowed bg-[#95abc6]"
                : "hover:-translate-y-0.5"
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

export function LeadershipPotentialResultScreen({
  playerName,
  result,
  onBackToAnswers,
  onBackToHub,
  onRestart
}: {
  playerName: string;
  result: LeadershipPotentialResult;
  onBackToAnswers: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const accent = result.hasTie ? "#795b85" : result.leaders[0].color;
  const headline = result.hasTie
    ? "ภาวะผู้นำแบบผสม"
    : `${result.leaders[0].colorName}: ${result.leaders[0].title}`;

  return (
    <section className="mx-auto max-w-5xl animate-rise">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]"
        >
          <ChevronLeft size={17} />
          กระดานเควสต์
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBackToAnswers}
            className="h-11 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]"
          >
            ดูคำตอบ
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-11 items-center gap-2 rounded-[8px] px-4 text-sm font-black text-white"
            style={{ backgroundColor: accent }}
          >
            <RotateCcw size={16} />
            ทำใหม่
          </button>
        </div>
      </div>

      <article className="panel rounded-[8px] p-5 sm:p-8">
        <header className="flex flex-col gap-5 border-b border-[#cdddf0] pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: accent }}>
              Leadership Potential Result
            </p>
            <p className="mt-2 text-sm font-bold text-[#667393]">{playerName}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-[#24324b] sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-[#586984]">
              {result.hasTie
                ? `คุณมีแนวโน้มเด่นร่วมกัน ${result.leaders.map((profile) => `${profile.colorName} (${profile.code})`).join(" และ ")} จึงแสดงผลทั้งสองด้านโดยไม่บังคับเลือกเพียงสีเดียว`
                : result.leaders[0].summary}
            </p>
          </div>
          <div
            className="grid h-24 w-24 shrink-0 place-items-center rounded-[8px] text-white shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <Crown size={42} />
          </div>
        </header>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#71809a]">
                Answer Count
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#24324b]">จำนวนคำตอบแต่ละสี</h2>
            </div>
            <p className="text-sm font-bold text-[#667393]">รวม 10 ข้อ</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipPotentialCodes.map((code) => {
              const profile = getLeadershipPotentialProfile(code);
              const count = result.counts[code];
              const isLeader = result.leaders.some((leader) => leader.code === code);

              return (
                <div
                  key={code}
                  className="rounded-[8px] border bg-white/65 p-4"
                  style={{ borderColor: isLeader ? profile.color : "#cdddf0" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white"
                      style={{ backgroundColor: profile.color }}
                    >
                      {code}
                    </span>
                    <span className="text-2xl font-black text-[#24324b]">{count}/10</span>
                  </div>
                  <p className="mt-3 text-sm font-black text-[#334967]">{profile.colorName}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e3edf8]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${count * 10}%`, backgroundColor: profile.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 border-t border-[#cdddf0] pt-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#71809a]">
            Your Leadership Profile
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {result.leaders.map((profile) => (
              <article
                key={profile.code}
                className="rounded-[8px] border border-[#cdddf0] bg-white/65 p-5"
                style={{ borderTop: `5px solid ${profile.color}` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-[8px] text-lg font-black text-white"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.code}
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">
                      {profile.colorName}
                    </p>
                    <h3 className="text-xl font-black text-[#24324b]">{profile.title}</h3>
                  </div>
                </div>
                <p className="mt-4 font-bold leading-7 text-[#415572]">{profile.description}</p>
                <div className="mt-5 border-t border-[#d7e3f1] pt-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b84f73]">
                    สิ่งที่ควรระวังและพัฒนา
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667393]">{profile.watchOut}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 border-t border-[#cdddf0] pt-4 text-xs leading-5 text-[#71809a]">
          วิธีคำนวณ: นับจำนวนคำตอบ A, B, C และ D จากทั้ง 10 ข้อ ตัวอักษรที่ถูกเลือกมากที่สุดคือผลลัพธ์หลัก หากมีจำนวนสูงสุดเท่ากันจะแสดงเป็นผลแบบผสม อ้างอิงจากแบบทดสอบภาวะผู้นำและเฉลยที่ผู้สอนจัดให้ ผลนี้ใช้เพื่อการเรียนรู้และสะท้อนตนเอง ไม่ใช่การวินิจฉัยบุคลิกภาพ
        </p>
      </article>
    </section>
  );
}
