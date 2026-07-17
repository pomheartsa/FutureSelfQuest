"use client";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LockKeyhole,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { cx, genderLabel, type Gender } from "@/lib/app-core";
import {
  chapters,
  competencyScaleAnchors,
  eqScale,
  questions,
  type Question
} from "@/lib/assessment";
import type { AnswerMap, ProfileResult } from "@/lib/scoring";

export function QuestScreen({
  answers,
  currentQuestion,
  currentIndex,
  playerName,
  gender,
  profile,
  onAnswer,
  onNext,
  onPrevious,
  onRestart,
  onBackToHub
}: {
  answers: AnswerMap;
  currentQuestion: Question;
  currentIndex: number;
  playerName: string;
  gender: Gender | null;
  profile: ProfileResult;
  onAnswer: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onBackToHub: () => void;
}) {
  const chapter = chapters.find((item) => item.id === currentQuestion.chapterId) ?? chapters[0];
  const chapterQuestions = questions.filter((item) => item.chapterId === currentQuestion.chapterId);
  const chapterIndex = chapterQuestions.findIndex((item) => item.id === currentQuestion.id) + 1;
  const selected = answers[currentQuestion.id];
  const currentCategoryScore = profile.categoryScores.find(
    (score) => score.key === currentQuestion.category
  );

  return (
    <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="panel animate-rise rounded-[8px] p-5 lg:sticky lg:top-5 lg:h-[calc(100svh-40px)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#2f6fb6] text-white shadow-glow">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#667393]">นักผจญภัย · {genderLabel(gender)}</p>
            <p className="text-xl font-black text-[#24324b]">{playerName || "Player One"}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[8px] border border-white/80 bg-white/55">
          <div className="relative flex h-60 items-center justify-center bg-[#dcebf7]">
            <img
              src="/quest-hall.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-white/45" />
            <div className="pulse-rune absolute bottom-7 h-16 w-40 rounded-[50%] border-4 border-[#8ab7ed]/35" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/80 bg-[#2f6fb6] text-white shadow-glow">
                <LockKeyhole size={25} />
              </span>
              <p className="mt-3 text-xs font-black text-[#61799b]">อาชีพยังไม่เปิดเผย</p>
              <p className="text-4xl font-black text-[#24324b]">???</p>
              <p className="mt-1 text-xs font-bold text-[#586984]">ปลดล็อกเมื่อทำครบทุกข้อ</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
                Progress
              </p>
              <p className="text-3xl font-black text-[#24324b]">{profile.completion}%</p>
            </div>
            <p className="text-sm font-bold text-[#667393]">
              {profile.answeredCount}/{questions.length}
            </p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#39a7a5] via-[#4f8ee8] to-[#e0a93d] transition-all duration-500"
              style={{ width: `${profile.completion}%` }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {chapters.map((item) => {
            const total = questions.filter((question) => question.chapterId === item.id).length;
            const answered = questions.filter(
              (question) => question.chapterId === item.id && answers[question.id] !== undefined
            ).length;

            return (
              <div key={item.id}>
                <div className="mb-1 flex justify-between text-xs font-bold text-[#61799b]">
                  <span>{item.short}</span>
                  <span>{answered}/{total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(answered / total) * 100}%`, backgroundColor: item.accent }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <ClipboardList size={16} />
            กระดานเควสต์
          </button>
          <button
            onClick={onRestart}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <RotateCcw size={16} />
            เริ่มใหม่ทั้งหมด
          </button>
        </div>
      </aside>

      <section className="animate-rise rounded-[8px]">
        <div className="panel rounded-[8px] p-5 sm:p-7 lg:min-h-[calc(100svh-40px)]">
          <div className="flex flex-col gap-4 border-b border-[#cdddf0] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-[8px] px-3 py-1 text-sm font-black text-white"
                  style={{ backgroundColor: chapter.accent }}
                >
                  {chapter.short}
                </span>
                <span className="rounded-[8px] border border-[#cdddf0] bg-white/65 px-3 py-1 text-sm font-bold text-[#61799b]">
                  ข้อ {chapterIndex} จาก {chapterQuestions.length}
                </span>
                {currentCategoryScore ? (
                  <span className="rounded-[8px] border border-[#cdddf0] bg-white/65 px-3 py-1 text-sm font-bold text-[#61799b]">
                    {currentCategoryScore.labelTh}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#24324b] sm:text-4xl">
                {chapter.titleTh}
              </h2>
            </div>
            <div className="min-w-44">
              <div className="flex items-end justify-between gap-4 text-xs font-black text-[#61799b]">
                <span>ตอบแล้ว {profile.answeredCount} จาก {questions.length} ข้อ</span>
                <span>{profile.completion}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/75">
                <div
                  className="h-full rounded-full bg-[#2f6fb6] transition-all duration-500"
                  style={{ width: `${profile.completion}%` }}
                />
              </div>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selected={selected}
            onAnswer={onAnswer}
          />

          <div className="mt-7 flex flex-col gap-3 border-t border-[#cdddf0] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className={cx(
                "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border px-5 text-sm font-black transition",
                currentIndex === 0
                  ? "cursor-not-allowed border-[#d7e3f1] bg-white/35 text-[#98a6bb]"
                  : "border-[#b8cce4] bg-white/75 text-[#38516f] hover:bg-white"
              )}
            >
              <ChevronLeft size={18} />
              ย้อนกลับ
            </button>

            <div className="text-center text-sm font-bold text-[#667393]">
              ตำแหน่งทั้งหมด: ข้อ {currentIndex + 1} จาก {questions.length}
            </div>

            <button
              onClick={onNext}
              disabled={selected === undefined}
              className={cx(
                "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-black text-white shadow-glow transition",
                selected === undefined
                  ? "cursor-not-allowed bg-[#95abc6]"
                  : "bg-[#2f6fb6] hover:-translate-y-0.5 hover:bg-[#275f9e]"
              )}
            >
              {currentIndex === questions.length - 1 ? "ดูผลลัพธ์" : "ต่อไป"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

function QuestionCard({
  question,
  selected,
  onAnswer
}: {
  question: Question;
  selected?: number;
  onAnswer: (value: number) => void;
}) {
  return (
    <div className="mt-7 animate-fade">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#61799b]">
        Item {question.item}
      </p>
      {question.kind === "bigFive" ? (
        <BigFivePrompt question={question} selected={selected} onAnswer={onAnswer} />
      ) : (
        <LikertPrompt question={question} selected={selected} onAnswer={onAnswer} />
      )}
    </div>
  );
}

function LikertPrompt({
  question,
  selected,
  onAnswer
}: {
  question: Question;
  selected?: number;
  onAnswer: (value: number) => void;
}) {
  const options = eqScale;

  return (
    <>
      <h3 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-[#24324b]">
        {question.promptTh}
      </h3>
      <p className="mt-3 max-w-4xl text-base leading-7 text-[#667393]">{question.prompt}</p>

      {question.kind === "competency" ? (
        <CompetencyScale selected={selected} onAnswer={onAnswer} />
      ) : (
        <div className="answer-grid mt-8 grid gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className={cx(
                "min-h-16 rounded-[8px] border px-3 py-3 text-center transition",
                selected === option.value
                  ? "border-[#2f6fb6] bg-[#2f6fb6] text-white shadow-glow"
                  : "border-[#c5d6ea] bg-white/72 text-[#38516f] hover:-translate-y-0.5 hover:bg-white"
              )}
            >
              <span className="block text-2xl font-black">{option.value}</span>
              <span className="mt-1 block text-xs font-bold leading-5 opacity-85">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function CompetencyScale({
  selected,
  onAnswer
}: {
  selected?: number;
  onAnswer: (value: number) => void;
}) {
  const anchorValues = [1, 5, 10] as const;

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-[8px] border border-[#b8cce4] bg-white/80 shadow-sm" role="radiogroup" aria-label="ระดับคะแนน 1 ถึง 10">
        <div className="grid grid-cols-10">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value, index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected === value}
              aria-label={`ให้คะแนน ${value} จาก 10: ${competencyScaleAnchors[value as keyof typeof competencyScaleAnchors]}`}
              onClick={() => onAnswer(value)}
              className={cx(
                "relative flex h-16 min-w-0 items-center justify-center text-xl font-black transition sm:h-20 sm:text-2xl",
                index > 0 && "border-l border-[#c5d6ea]",
                selected === value
                  ? "z-10 bg-[#2f6fb6] text-white shadow-[inset_0_-4px_0_rgba(15,55,103,0.3)]"
                  : "bg-white/70 text-[#38516f] hover:bg-[#edf5ff]"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-xs font-bold leading-5 text-[#667393] sm:text-sm">
        {anchorValues.map((value) => (
          <div key={value} className={cx(value === 5 && "text-center", value === 10 && "text-right")}>
            <span className="mr-1 font-black text-[#2d5f9c]">{value}</span>
            {competencyScaleAnchors[value]}
          </div>
        ))}
      </div>
    </div>
  );
}

function BigFivePrompt({
  question,
  selected,
  onAnswer
}: {
  question: Question;
  selected?: number;
  onAnswer: (value: number) => void;
}) {
  return (
    <>
      <div className="mt-5 rounded-[8px] border border-[#cdddf0] bg-white/62 p-3 sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 sm:gap-4">
          <TraitSide
            title={question.left || ""}
            subtitle={question.leftTh || ""}
            score={5}
            align="left"
          />
          <div className="flex items-center justify-center">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#cdddf0] bg-white text-[10px] font-black text-[#61799b]">
              หรือ
            </span>
          </div>
          <TraitSide
            title={question.right || ""}
            subtitle={question.rightTh || ""}
            score={1}
            align="right"
          />
        </div>
        <p className="mt-3 border-t border-[#d8e4f1] pt-3 text-center text-xs font-bold leading-5 text-[#61799b] sm:text-sm">
          เลือกคะแนนที่ใกล้ตัวคุณมากกว่า ถ้าทั้งสองด้านใกล้เคียงกัน เลือก 3
        </p>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:mt-8 sm:gap-3">
        {[5, 4, 3, 2, 1].map((value) => (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={cx(
              "h-20 rounded-[8px] border px-1 text-center transition sm:h-24",
              selected === value
                ? "border-[#168e8a] bg-[#168e8a] text-white shadow-glow"
                : "border-[#c5d6ea] bg-white/72 text-[#38516f] hover:-translate-y-0.5 hover:bg-white"
            )}
          >
            <span className="block text-3xl font-black">{value}</span>
            <span className="mt-1 block text-[10px] font-bold leading-tight opacity-80 sm:text-[11px]">
              {value === 5
                ? "ฝั่งซ้าย"
                : value === 4
                  ? "เอนซ้าย"
                  : value === 3
                    ? "พอ ๆ กัน"
                    : value === 2
                      ? "เอนขวา"
                      : "ฝั่งขวา"}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function TraitSide({
  title,
  subtitle,
  score,
  align
}: {
  title: string;
  subtitle: string;
  score: 1 | 5;
  align: "left" | "right";
}) {
  return (
    <div className={cx("min-w-0 py-1", align === "right" && "text-right")}>
      <span className="inline-block text-[10px] font-black text-[#168e8a] sm:text-xs">
        {score} คะแนน
      </span>
      <p className="mt-1 break-words text-lg font-black leading-tight text-[#24324b] sm:text-2xl">
        {title}
      </p>
      <p className="mt-1 break-words text-sm font-bold leading-snug text-[#4f6d91] sm:mt-2 sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}
