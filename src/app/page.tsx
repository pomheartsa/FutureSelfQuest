"use client";

import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  LockKeyhole,
  Medal,
  Play,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  chapters,
  competencyScaleAnchors,
  eqScale,
  questions,
  type ChapterId,
  type Question
} from "@/lib/assessment";
import {
  calculateProfile,
  type AnswerMap,
  type CategoryScore,
  type ProfileResult,
  type RpgStat
} from "@/lib/scoring";
import { exportPartWorkbook } from "@/lib/export-excel";

const STORAGE_KEY = "future-self-quest-state-v1";
const APP_VERSION = "1.1.1";
const UPDATE_STORAGE_KEY = `future-self-quest-update-${APP_VERSION}`;

const releaseNotes = [
  "ปรับสมดุลสูตรเลือกอาชีพให้ทั้ง 5 อาชีพมีโอกาสเป็นผลลัพธ์อย่างเหมาะสม",
  "เพิ่มผลลัพธ์ 5 อาชีพ: Swordman, Mage, Archer, Acolyte และ Merchant",
  "เพิ่มภาพตัวละครชายและหญิงให้ตรงกับเพศที่เลือก",
  "ซ่อนอาชีพไว้จนกว่าจะตอบแบบประเมินครบทั้ง 127 ข้อ",
  "แยกดาวน์โหลด Excel เป็น EQ, Big Five และ Professional Competencies"
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type BodyType = "female" | "male";
type Gender = "female" | "male";
type JobId = "acolyte" | "archer" | "mage" | "merchant" | "sword";

type AvatarConfig = {
  jobId: JobId;
  bodyType: BodyType;
};

const defaultAvatarConfig: AvatarConfig = {
  jobId: "sword",
  bodyType: "female"
};

const jobOptions: Array<{
  id: JobId;
  variants: { male: string; female: string };
}> = [
  {
    id: "sword",
    variants: {
      female: "/jobs/swordwoman.png",
      male: "/jobs/swordman.png"
    }
  },
  {
    id: "mage",
    variants: {
      female: "/jobs/magewoman.png",
      male: "/jobs/mageman.png"
    }
  },
  {
    id: "archer",
    variants: {
      female: "/jobs/archerwoman.png",
      male: "/jobs/archerman.png"
    }
  },
  {
    id: "acolyte",
    variants: {
      female: "/jobs/acolytewoman.png",
      male: "/jobs/acolyteman.png"
    }
  },
  {
    id: "merchant",
    variants: {
      female: "/jobs/merchantwoman.png",
      male: "/jobs/merchantman.png"
    }
  }
];

const resultJobByStat: Record<RpgStat["key"], JobId> = {
  STR: "sword",
  AGI: "merchant",
  VIT: "sword",
  DEX: "archer",
  INT: "mage",
  LUK: "acolyte"
};

const genderOptions: Array<{ value: Gender; label: string; labelEn: string; symbol: string }> = [
  { value: "male", label: "ชาย", labelEn: "Male", symbol: "♂" },
  { value: "female", label: "หญิง", labelEn: "Female", symbol: "♀" }
];

function genderLabel(gender: Gender | null) {
  return genderOptions.find((option) => option.value === gender)?.label ?? "ผู้เล่น";
}

function normalizeAvatarConfig(value?: Partial<AvatarConfig>): AvatarConfig {
  const next = { ...defaultAvatarConfig, ...(value || {}) };
  if (!jobOptions.some((job) => job.id === next.jobId)) {
    next.jobId = defaultAvatarConfig.jobId;
  }
  return { jobId: next.jobId, bodyType: next.bodyType === "male" ? "male" : "female" };
}

function getSelectedJob(avatarConfig: AvatarConfig) {
  return jobOptions.find((job) => job.id === avatarConfig.jobId) ?? jobOptions[0];
}

function getJobImage(avatarConfig: AvatarConfig) {
  const job = getSelectedJob(avatarConfig);
  return job.variants[avatarConfig.bodyType];
}

function AvatarPreview({
  avatarConfig,
  className,
  altText = "ตัวละครผู้เล่น"
}: {
  avatarConfig: AvatarConfig;
  className?: string;
  altText?: string;
}) {
  const imageSrc = getJobImage(avatarConfig);

  return (
    <img
      src={imageSrc}
      alt={altText}
      className={cx(
        "h-full w-auto object-contain drop-shadow-[0_22px_24px_rgba(54,74,102,0.22)]",
        className
      )}
    />
  );
}

function AppOverlays({
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

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);

  const profile = useMemo(() => calculateProfile(answers), [answers]);
  const currentQuestion = questions[currentIndex] ?? questions[0];
  const isComplete = profile.answeredCount === questions.length;

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as {
          playerName?: string;
          answers?: AnswerMap;
          currentIndex?: number;
          started?: boolean;
          showResult?: boolean;
          gender?: Gender;
          avatarConfig?: Partial<AvatarConfig>;
        };
        setPlayerName(saved.playerName || "");
        setAnswers(saved.answers || {});
        setCurrentIndex(Math.min(saved.currentIndex || 0, questions.length - 1));
        setStarted(Boolean(saved.started));
        setShowResult(Boolean(saved.showResult));
        setGender(saved.gender || saved.avatarConfig?.bodyType || null);
        setAvatarConfig(normalizeAvatarConfig(saved.avatarConfig));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setShowUpdate(window.localStorage.getItem(UPDATE_STORAGE_KEY) !== "seen");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ playerName, gender, answers, currentIndex, started, showResult, avatarConfig })
    );
  }, [answers, avatarConfig, currentIndex, gender, hydrated, playerName, showResult, started]);

  function beginQuest() {
    if (!playerName.trim() || !gender) return;
    setStarted(true);
    setShowResult(false);
    setCurrentIndex(0);
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
    setStarted(false);
    setPlayerName("");
    setGender(null);
    setAvatarConfig(defaultAvatarConfig);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function answerCurrent(value: number) {
    const answeredIndex = currentIndex;
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (answeredIndex === questions.length - 1) {
        if (Object.keys(nextAnswers).length === questions.length) {
          setShowResult(true);
        }
        return;
      }

      setCurrentIndex((index) => (index === answeredIndex ? index + 1 : index));
    }, 170);
  }

  function goPrevious() {
    setShowResult(false);
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    if (currentIndex === questions.length - 1) {
      if (isComplete) setShowResult(true);
      return;
    }
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
  }

  function closeUpdate() {
    window.localStorage.setItem(UPDATE_STORAGE_KEY, "seen");
    setShowUpdate(false);
  }

  const appOverlays = (
    <AppOverlays
      showUpdate={showUpdate}
      onOpenUpdate={() => setShowUpdate(true)}
      onCloseUpdate={closeUpdate}
    />
  );

  if (!hydrated) {
    return <main className="quest-shell min-h-svh" />;
  }

  if (!started) {
    return (
      <>
        <main className="quest-shell flex min-h-svh items-center px-4 py-6 sm:px-6 lg:px-10">
          <StartScreen
            playerName={playerName}
            setPlayerName={setPlayerName}
            gender={gender}
            setGender={(nextGender) => {
              setGender(nextGender);
              setAvatarConfig((config) => ({ ...config, bodyType: nextGender }));
            }}
            onStart={beginQuest}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  if (showResult && isComplete) {
    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-6 sm:px-6 lg:px-10">
          <ResultScreen
            playerName={playerName}
            gender={gender}
            avatarConfig={avatarConfig}
            answers={answers}
            profile={profile}
            onRestart={restart}
            onBack={() => {
              setShowResult(false);
              setCurrentIndex(questions.length - 1);
            }}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  return (
    <>
      <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
        <QuestScreen
          answers={answers}
          currentQuestion={currentQuestion}
          currentIndex={currentIndex}
          playerName={playerName}
          gender={gender}
          profile={profile}
          onAnswer={answerCurrent}
          onNext={goNext}
          onPrevious={goPrevious}
          onRestart={restart}
        />
      </main>
      {appOverlays}
    </>
  );
}

function StartScreen({
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
          ตั้งชื่อ เลือกเพศ แล้วตอบ 3 เควสต์เพื่อค้นหาอาชีพในตำนานที่เข้ากับตัวคุณ
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

        <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="rounded-[8px] border border-white/70 bg-white/62 p-4 shadow-sm backdrop-blur"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
                {chapter.short}
              </p>
              <p className="mt-2 text-base font-black text-[#24324b]">{chapter.titleTh}</p>
              <p className="mt-1 text-sm text-[#657692]">{chapter.scale}</p>
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
          เริ่มเควสต์
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
              ทำแบบประเมินให้ครบเพื่อปลดล็อกอาชีพ
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
            <p className="text-xs font-bold text-[#6a7890]">Total Quest</p>
            <p className="text-2xl font-black text-[#2d5f9c]">{questions.length}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestScreen({
  answers,
  currentQuestion,
  currentIndex,
  playerName,
  gender,
  profile,
  onAnswer,
  onNext,
  onPrevious,
  onRestart
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

        <button
          onClick={onRestart}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 text-sm font-black text-[#38516f] transition hover:bg-white"
        >
          <RotateCcw size={16} />
          เริ่มใหม่
        </button>
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
  const options =
    question.kind === "eq"
      ? eqScale
      : Array.from({ length: 10 }, (_, index) => ({
          value: index + 1,
          label: String(index + 1)
        }));

  return (
    <>
      <h3 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-[#24324b]">
        {question.promptTh}
      </h3>
      <p className="mt-3 max-w-4xl text-base leading-7 text-[#667393]">{question.prompt}</p>

      <div
        className={cx(
          "answer-grid mt-8 grid gap-3",
          question.kind === "competency" && "sm:grid-cols-10"
        )}
      >
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
            {question.kind === "eq" ? (
              <span className="mt-1 block text-xs font-bold leading-5 opacity-85">
                {option.label}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {question.kind === "competency" ? (
        <div className="mt-4 grid gap-2 text-sm font-bold text-[#667393] sm:grid-cols-4">
          {Object.entries(competencyScaleAnchors).map(([value, label]) => (
            <div key={value} className="rounded-[8px] border border-[#cdddf0] bg-white/55 px-3 py-2">
              <span className="font-black text-[#2d5f9c]">{value}</span> {label}
            </div>
          ))}
        </div>
      ) : null}
    </>
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

type GroupedScores = Array<{
  chapter: (typeof chapters)[number];
  scores: CategoryScore[];
}>;

function partSummaryRows(groupedScores: GroupedScores) {
  return groupedScores.map(({ chapter, scores }) => {
    const raw = scores.reduce((sum, score) => sum + score.raw, 0);
    const max = scores.reduce((sum, score) => sum + score.max, 0);
    const averagePower = Math.round(
      scores.reduce((sum, score) => sum + score.percent, 0) / scores.length
    );

    return {
      part: `${chapter.short} - ${chapter.titleTh}`,
      raw,
      max,
      averagePower
    };
  });
}

function PrintReport({
  playerName,
  profile,
  groupedScores
}: {
  playerName: string;
  profile: ProfileResult;
  groupedScores: GroupedScores;
}) {
  return (
    <section className="print-report" aria-label="Printable score report">
      <header className="print-header">
        <div>
          <p className="print-kicker">Future Self Quest</p>
          <h1>Score Report</h1>
          <p>{playerName || "Player One"}</p>
        </div>
        <div className="print-class">
          <p>{profile.classProfile.title}</p>
          <strong>{profile.classProfile.titleTh}</strong>
        </div>
      </header>

      <section className="print-section">
        <h2>ภาพรวม</h2>
        <p>{profile.summary}</p>
        <p>{profile.classProfile.description}</p>
      </section>

      <section className="print-section">
        <h2>Part Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Part</th>
              <th>Raw</th>
              <th>Max</th>
              <th>Average Power</th>
            </tr>
          </thead>
          <tbody>
            {partSummaryRows(groupedScores).map((row) => (
              <tr key={row.part}>
                <td>{row.part}</td>
                <td>{row.raw}</td>
                <td>{row.max}</td>
                <td>{row.averagePower}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-section">
        <h2>RPG Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Meaning</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {profile.rpgStats.map((stat) => (
              <tr key={stat.key}>
                <td>{stat.key}</td>
                <td>{stat.labelTh}</td>
                <td>{stat.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {groupedScores.map(({ chapter, scores }) => (
        <section key={chapter.id} className="print-section">
          <h2>
            {chapter.short}: {chapter.titleTh}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Raw</th>
                <th>Max</th>
                <th>Norm</th>
                <th>Power</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score.key}>
                  <td>
                    <strong>{score.labelTh}</strong>
                    <br />
                    <span>{score.label}</span>
                  </td>
                  <td>{score.raw}</td>
                  <td>{score.max}</td>
                  <td>{score.normScore ?? "-"}</td>
                  <td>{score.percent}</td>
                  <td>{score.levelLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <footer className="print-footer">
        ผลลัพธ์นี้ใช้เพื่อสะท้อนตัวเองจากแบบสอบถาม ไม่ใช่การวินิจฉัยทางจิตวิทยาหรือการประเมินทางคลินิก
      </footer>
    </section>
  );
}

function ResultScreen({
  playerName,
  gender,
  avatarConfig,
  answers,
  profile,
  onRestart,
  onBack
}: {
  playerName: string;
  gender: Gender | null;
  avatarConfig: AvatarConfig;
  answers: AnswerMap;
  profile: ProfileResult;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [exportingPart, setExportingPart] = useState<ChapterId | null>(null);
  const [exportError, setExportError] = useState("");
  const sortedStats = [...profile.rpgStats].sort((a, b) => b.value - a.value);
  const resultAvatarConfig: AvatarConfig = {
    ...avatarConfig,
    jobId: resultJobByStat[profile.classProfile.key]
  };
  const groupedScores = chapters.map((chapter) => ({
    chapter,
    scores: profile.categoryScores.filter((score) => score.key && score.label)
      .filter((score) => {
        if (chapter.id === "eq") return ["selfAwareness", "socialAwareness", "selfManagement", "socialSkills"].includes(score.key);
        if (chapter.id === "bigFive") return ["adjustment", "sociability", "openness", "agreeableness", "conscientiousness"].includes(score.key);
        return ["managingSelf", "communication", "diversity", "ethics", "acrossCultures", "teams", "change"].includes(score.key);
      })
  }));

  async function handleExcelExport(chapterId: ChapterId) {
    setExportingPart(chapterId);
    setExportError("");

    try {
      await exportPartWorkbook({ playerName, chapterId, answers, profile });
    } catch (error) {
      console.error("Excel export failed", error);
      setExportError("สร้างไฟล์ Excel ไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setExportingPart(null);
    }
  }

  return (
    <section className="mx-auto max-w-7xl">
      <PrintReport playerName={playerName} profile={profile} groupedScores={groupedScores} />

      <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
        >
          <ChevronLeft size={18} />
          กลับไปดูคำตอบ
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <button
            onClick={() => window.print()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/80 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <Printer size={16} />
            Save as PDF
          </button>
          <div className="w-full sm:w-auto">
            <p className="mb-1 text-xs font-black text-[#61799b]">Export Excel แยกตามส่วน</p>
            <div className="grid grid-cols-3 overflow-hidden rounded-[8px] border border-[#b8cce4] bg-white/80">
              {([
                { id: "eq", label: "EQ" },
                { id: "bigFive", label: "BIG 5" },
                { id: "competency", label: "PRO" }
              ] as Array<{ id: ChapterId; label: string }>).map((part, index) => (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => void handleExcelExport(part.id)}
                  disabled={exportingPart !== null}
                  title={`ดาวน์โหลด ${part.label} เป็นไฟล์ Excel`}
                  className={cx(
                    "inline-flex h-11 min-w-20 items-center justify-center gap-1.5 px-3 text-xs font-black text-[#38516f] transition hover:bg-white disabled:cursor-wait disabled:opacity-55",
                    index > 0 && "border-l border-[#b8cce4]"
                  )}
                >
                  <Download size={14} />
                  {exportingPart === part.id ? "กำลังสร้าง" : part.label}
                </button>
              ))}
            </div>
            {exportError ? (
              <p className="mt-1 text-xs font-bold text-[#b54c4c]">{exportError}</p>
            ) : null}
          </div>
          <button
            onClick={onRestart}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2f6fb6] px-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#275f9e]"
          >
            <RotateCcw size={16} />
            เล่นใหม่
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[410px_minmax(0,1fr)]">
        <section className="panel animate-rise rounded-[8px] p-5">
          <div className="relative overflow-hidden rounded-[8px] border border-white/80 bg-gradient-to-b from-[#f8fcff] via-[#edf6ff] to-[#dcebf7] px-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
                  นักผจญภัย · {genderLabel(gender)}
                </p>
                <h1 className="mt-1 text-4xl font-black leading-tight text-[#24324b]">
                  {playerName || "Player One"}
                </h1>
              </div>
              <div className="rounded-[8px] border border-[#cdddf0] bg-white/70 px-3 py-2 text-right">
                <p className="text-xs font-bold text-[#667393]">Complete</p>
                <p className="text-2xl font-black text-[#2d5f9c]">100%</p>
              </div>
            </div>
            <div className="relative mt-3 flex h-72 items-end justify-center">
              <div className="pulse-rune absolute bottom-8 h-24 w-56 rounded-[50%] border-4 border-[#8ab7ed]/45" />
              <AvatarPreview
                avatarConfig={resultAvatarConfig}
                altText={`ตัวละครอาชีพ ${profile.classProfile.titleTh}`}
                className="avatar-float relative z-10 h-full"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1 text-sm font-black text-[#2d5f9c]">
              <Medal size={16} />
              อาชีพที่ปลดล็อก · {profile.classProfile.title}
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#24324b]">
              {profile.classProfile.titleTh}
            </h2>
            <p className="mt-2 text-lg font-black text-[#dd6d6d]">
              {profile.classProfile.tagline}
            </p>
            <p className="mt-4 leading-8 text-[#586984]">{profile.classProfile.description}</p>
            <p className="mt-4 rounded-[8px] border border-[#d5e3f4] bg-white/60 p-4 text-sm leading-7 text-[#667393]">
              ผลลัพธ์นี้ใช้เพื่อสะท้อนตัวเองจากแบบสอบถาม ไม่ใช่การวินิจฉัยทางจิตวิทยาหรือการประเมินทางคลินิก
            </p>
          </div>
        </section>

        <section className="panel animate-rise rounded-[8px] p-5 [animation-delay:80ms]">
          <div className="flex flex-col gap-4 border-b border-[#cdddf0] pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#61799b]">
                <BarChart3 size={16} />
                Result Board
              </p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-[#24324b]">
                {profile.summary}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="rounded-[8px] border border-[#cdddf0] bg-white/58 p-4">
              <RadarChart stats={profile.rpgStats} />
            </div>
            <div className="stat-grid grid gap-3">
              {sortedStats.map((stat) => (
                <StatBar key={stat.key} stat={stat} />
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <ResultList title="พลังเด่น" items={profile.strengths} tone="strong" />
            <ResultList title="ช่องอัปสกิล" items={profile.growth} tone="growth" />
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-5">
        {groupedScores.map(({ chapter, scores }) => (
          <div key={chapter.id} className="panel rounded-[8px] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
                  {chapter.short}
                </p>
                <h3 className="text-2xl font-black text-[#24324b]">{chapter.titleTh}</h3>
              </div>
              <span
                className="rounded-[8px] px-3 py-1 text-sm font-black text-white"
                style={{ backgroundColor: chapter.accent }}
              >
                {chapter.scale}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {scores.map((score) => (
                <CategoryBar key={score.key} score={score} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

function RadarChart({ stats }: { stats: RpgStat[] }) {
  const size = 320;
  const center = size / 2;
  const radius = 105;
  const angleStep = (Math.PI * 2) / stats.length;
  const axisPoints = stats.map((_, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
  const statPoints = stats.map((stat, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const scaledRadius = radius * (stat.value / 100);
    return {
      x: center + Math.cos(angle) * scaledRadius,
      y: center + Math.sin(angle) * scaledRadius
    };
  });
  const polygon = statPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" role="img" aria-label="RPG stat radar">
      {[0.25, 0.5, 0.75, 1].map((level) => {
        const points = stats
          .map((_, index) => {
            const angle = -Math.PI / 2 + index * angleStep;
            const currentRadius = radius * level;
            return `${center + Math.cos(angle) * currentRadius},${center + Math.sin(angle) * currentRadius}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="#9abbe2"
            strokeOpacity={level === 1 ? 0.75 : 0.32}
            strokeWidth={level === 1 ? 2 : 1}
          />
        );
      })}
      {axisPoints.map((point, index) => (
        <line
          key={stats[index].key}
          x1={center}
          y1={center}
          x2={point.x}
          y2={point.y}
          stroke="#9abbe2"
          strokeOpacity="0.38"
        />
      ))}
      <polygon points={polygon} fill="#4f8ee8" fillOpacity="0.34" stroke="#2f6fb6" strokeWidth="3" />
      {statPoints.map((point, index) => (
        <circle key={stats[index].key} cx={point.x} cy={point.y} r="5" fill="#e0a93d" stroke="white" strokeWidth="2" />
      ))}
      {axisPoints.map((point, index) => {
        const stat = stats[index];
        const dx = point.x - center;
        const dy = point.y - center;
        return (
          <g key={stat.key}>
            <text
              x={point.x + Math.sign(dx) * 22}
              y={point.y + Math.sign(dy) * 18 + 5}
              textAnchor={Math.abs(dx) < 1 ? "middle" : dx > 0 ? "start" : "end"}
              className="fill-[#2d5f9c] text-[18px] font-black"
            >
              {stat.key}
            </text>
            <text
              x={point.x + Math.sign(dx) * 22}
              y={point.y + Math.sign(dy) * 18 + 24}
              textAnchor={Math.abs(dx) < 1 ? "middle" : dx > 0 ? "start" : "end"}
              className="fill-[#667393] text-[10px] font-bold"
            >
              {stat.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatBar({ stat }: { stat: RpgStat }) {
  return (
    <div className="rounded-[8px] border border-[#cdddf0] bg-white/62 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xl font-black text-[#24324b]">{stat.key}</p>
          <p className="text-sm font-bold text-[#667393]">{stat.labelTh}</p>
        </div>
        <p className="text-3xl font-black text-[#2d5f9c]">{stat.value}</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e3edf8]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#39a7a5] to-[#4f8ee8]"
          style={{ width: `${stat.value}%` }}
        />
      </div>
    </div>
  );
}

function CategoryBar({ score }: { score: CategoryScore }) {
  return (
    <div className="rounded-[8px] border border-[#cdddf0] bg-white/62 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-black text-[#24324b]">{score.labelTh}</p>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#667393]">
            {score.label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#2d5f9c]">{score.percent}</p>
          <p className="text-xs font-bold text-[#667393]">
            {score.normScore ? `Norm ${score.normScore}` : score.levelLabel}
          </p>
        </div>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e3edf8]">
        <div className="h-full rounded-full bg-[#e0a93d]" style={{ width: `${score.percent}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#667393]">{score.note}</p>
    </div>
  );
}

function ResultList({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "strong" | "growth";
}) {
  return (
    <div className="rounded-[8px] border border-[#cdddf0] bg-white/58 p-4">
      <p className="mb-3 flex items-center gap-2 text-lg font-black text-[#24324b]">
        {tone === "strong" ? <Sparkles size={18} /> : <ShieldCheck size={18} />}
        {title}
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-[8px] bg-white/70 px-3 py-3 text-sm leading-6 text-[#586984]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
