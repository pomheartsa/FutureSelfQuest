"use client";

import {
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Crown,
  Download,
  HeartHandshake,
  LockKeyhole,
  Medal,
  Minus,
  Play,
  Plus,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Workflow,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  chapters,
  competencyScaleAnchors,
  eqScale,
  questions,
  type ChapterId,
  type Question
} from "@/lib/assessment";
import {
  assessmentMethodology,
  calculateProfile,
  type AnswerMap,
  type CategoryScore,
  type ProfileResult,
  type RpgStat
} from "@/lib/scoring";
import { exportPartWorkbook } from "@/lib/export-excel";
import {
  calculateEngagementResult,
  calculateLeadershipStyleResult,
  engagementQuestions,
  engagementScale,
  leadershipStyleQuestions,
  type SideAnswerMap,
  type SideAssessmentResult,
  type SideQuestId
} from "@/lib/side-assessments";
import {
  belbinSections,
  calculateBelbinResult,
  countCompletedBelbinSections,
  isBelbinSectionComplete,
  sanitizeBelbinAnswers,
  type BelbinAnswers,
  type BelbinResult,
  type BelbinSectionId,
  type BelbinSectionScores
} from "@/lib/belbin-assessment";
import {
  calculateLeadershipPotentialResult,
  leadershipPotentialCodes,
  leadershipPotentialProfiles,
  leadershipPotentialQuestions,
  sanitizeLeadershipPotentialAnswers,
  type LeadershipPotentialAnswers,
  type LeadershipPotentialCode,
  type LeadershipPotentialResult
} from "@/lib/leadership-potential";

const SESSION_STORAGE_KEY = "future-self-quest-session-v2";
const LEGACY_STORAGE_KEY = "future-self-quest-state-v1";
const APP_VERSION = "1.6.0";
const UPDATE_STORAGE_KEY = `future-self-quest-update-${APP_VERSION}`;

const releaseNotes = [
  "เพิ่มแบบทดสอบภาวะผู้นำ 10 ข้อ พร้อมผลลัพธ์ 4 สีและผลแบบผสมเมื่อคะแนนเสมอ",
  "เพิ่ม Belbin Team Roles 7 ส่วน พร้อมระบบแบ่ง 10 คะแนนและผลบทบาทเด่นของทีม",
  "เพิ่มกระดานเลือกแบบประเมิน แยก Main Quest ออกจากแบบทดสอบเสริม",
  "เพิ่ม Engagement Survey 22 ข้อ และแบบทดสอบสไตล์ผู้นำ 8 ข้อพร้อมผลลัพธ์",
  "ปรับคำอธิบายผล Pro ให้แสดงว่าอยู่ในกลุ่มคนส่วนใหญ่หรือกลุ่มคนส่วนน้อย",
  "เพิ่มกราฟ Big Five Locator และกราฟเทียบคะแนน Professional Competencies กับ Mean และช่วง 68%",
  "ปรับสเกลคำตอบ Professional Competencies 1-10 ให้เป็นแท่งเลือกคะแนนแบบต่อเนื่อง",
  "แก้ไขสถานะแบบประเมินค้างหลังปิดเว็บ โดยเริ่มใหม่เมื่อเปิดแท็บครั้งถัดไป",
  "เพิ่มคะแนนดิบ Norm Score ค่า Mean และช่วงอ้างอิงจากเอกสารประกอบการสอน",
  "เพิ่มหัวข้อวิธีคำนวณ แหล่งอ้างอิง และข้อจำกัดของแบบประเมิน",
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
type AppView =
  | "registration"
  | "hub"
  | "core"
  | "belbin"
  | "leadershipPotential"
  | SideQuestId;

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
      female: "/jobs/swordwoman.webp",
      male: "/jobs/swordman.webp"
    }
  },
  {
    id: "mage",
    variants: {
      female: "/jobs/magewoman.webp",
      male: "/jobs/mageman.webp"
    }
  },
  {
    id: "archer",
    variants: {
      female: "/jobs/archerwoman.webp",
      male: "/jobs/archerman.webp"
    }
  },
  {
    id: "acolyte",
    variants: {
      female: "/jobs/acolytewoman.webp",
      male: "/jobs/acolyteman.webp"
    }
  },
  {
    id: "merchant",
    variants: {
      female: "/jobs/merchantwoman.webp",
      male: "/jobs/merchantman.webp"
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

function clampStoredIndex(value: unknown, total: number) {
  if (typeof value !== "number" || !Number.isInteger(value)) return 0;
  return Math.max(0, Math.min(value, total - 1));
}

function normalizeAppView(value: unknown, legacyStarted?: boolean): AppView {
  if (
    value === "registration" ||
    value === "hub" ||
    value === "core" ||
    value === "engagement" ||
    value === "leadershipStyle" ||
    value === "belbin" ||
    value === "leadershipPotential"
  ) {
    return value;
  }
  return legacyStarted ? "core" : "registration";
}

function sanitizeCoreAnswers(value: unknown): AnswerMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const sanitized: AnswerMap = {};

  questions.forEach((question) => {
    const answer = source[question.id];
    const max = question.kind === "eq" ? 4 : question.kind === "bigFive" ? 5 : 10;
    if (typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= max) {
      sanitized[question.id] = answer;
    }
  });

  return sanitized;
}

function sanitizeSideAnswers(value: unknown, questId: SideQuestId): SideAnswerMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const sanitized: SideAnswerMap = {};
  const validIds =
    questId === "engagement"
      ? new Set(engagementQuestions.map((question) => question.id))
      : new Set(leadershipStyleQuestions.map((question) => question.id));
  const max = questId === "engagement" ? 5 : 3;

  Object.entries(source).forEach(([idText, answer]) => {
    const id = Number(idText);
    if (
      Number.isInteger(id) &&
      validIds.has(id) &&
      typeof answer === "number" &&
      Number.isInteger(answer) &&
      answer >= 1 &&
      answer <= max
    ) {
      sanitized[id] = answer;
    }
  });

  return sanitized;
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
  const [appView, setAppView] = useState<AppView>("registration");
  const [showResult, setShowResult] = useState(false);
  const [sideAnswers, setSideAnswers] = useState<Record<SideQuestId, SideAnswerMap>>({
    engagement: {},
    leadershipStyle: {}
  });
  const [sideCurrentIndex, setSideCurrentIndex] = useState<Record<SideQuestId, number>>({
    engagement: 0,
    leadershipStyle: 0
  });
  const [sideShowResult, setSideShowResult] = useState<Record<SideQuestId, boolean>>({
    engagement: false,
    leadershipStyle: false
  });
  const [belbinAnswers, setBelbinAnswers] = useState<BelbinAnswers>({});
  const [belbinCurrentIndex, setBelbinCurrentIndex] = useState(0);
  const [belbinShowResult, setBelbinShowResult] = useState(false);
  const [leadershipPotentialAnswers, setLeadershipPotentialAnswers] =
    useState<LeadershipPotentialAnswers>({});
  const [leadershipPotentialIndex, setLeadershipPotentialIndex] = useState(0);
  const [leadershipPotentialShowResult, setLeadershipPotentialShowResult] =
    useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const navigationGeneration = useRef(0);

  const profile = useMemo(() => calculateProfile(answers), [answers]);
  const currentQuestion = questions[currentIndex] ?? questions[0];
  const isComplete = profile.answeredCount === questions.length;

  useEffect(() => {
    // Keep progress across refreshes, but start fresh after the browser tab is closed.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as {
          playerName?: string;
          answers?: AnswerMap;
          currentIndex?: number;
          started?: boolean;
          appView?: AppView;
          showResult?: boolean;
          gender?: Gender;
          avatarConfig?: Partial<AvatarConfig>;
          sideAnswers?: Partial<Record<SideQuestId, SideAnswerMap>>;
          sideCurrentIndex?: Partial<Record<SideQuestId, number>>;
          sideShowResult?: Partial<Record<SideQuestId, boolean>>;
          belbinAnswers?: BelbinAnswers;
          belbinCurrentIndex?: number;
          belbinShowResult?: boolean;
          leadershipPotentialAnswers?: LeadershipPotentialAnswers;
          leadershipPotentialIndex?: number;
          leadershipPotentialShowResult?: boolean;
        };
        setPlayerName(
          typeof saved.playerName === "string" ? saved.playerName.slice(0, 28) : ""
        );
        setAnswers(sanitizeCoreAnswers(saved.answers));
        setCurrentIndex(clampStoredIndex(saved.currentIndex, questions.length));
        setAppView(normalizeAppView(saved.appView, saved.started));
        setShowResult(Boolean(saved.showResult));
        setGender(
          saved.gender === "male" || saved.gender === "female"
            ? saved.gender
            : saved.avatarConfig?.bodyType === "male" || saved.avatarConfig?.bodyType === "female"
              ? saved.avatarConfig.bodyType
              : null
        );
        setAvatarConfig(normalizeAvatarConfig(saved.avatarConfig));
        setSideAnswers({
          engagement: sanitizeSideAnswers(saved.sideAnswers?.engagement, "engagement"),
          leadershipStyle: sanitizeSideAnswers(
            saved.sideAnswers?.leadershipStyle,
            "leadershipStyle"
          )
        });
        setSideCurrentIndex({
          engagement: clampStoredIndex(
            saved.sideCurrentIndex?.engagement,
            engagementQuestions.length
          ),
          leadershipStyle: clampStoredIndex(
            saved.sideCurrentIndex?.leadershipStyle,
            leadershipStyleQuestions.length
          )
        });
        setSideShowResult({
          engagement: Boolean(saved.sideShowResult?.engagement),
          leadershipStyle: Boolean(saved.sideShowResult?.leadershipStyle)
        });
        setBelbinAnswers(sanitizeBelbinAnswers(saved.belbinAnswers));
        setBelbinCurrentIndex(
          clampStoredIndex(saved.belbinCurrentIndex, belbinSections.length)
        );
        setBelbinShowResult(Boolean(saved.belbinShowResult));
        setLeadershipPotentialAnswers(
          sanitizeLeadershipPotentialAnswers(saved.leadershipPotentialAnswers)
        );
        setLeadershipPotentialIndex(
          clampStoredIndex(
            saved.leadershipPotentialIndex,
            leadershipPotentialQuestions.length
          )
        );
        setLeadershipPotentialShowResult(
          Boolean(saved.leadershipPotentialShowResult)
        );
      } catch {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setShowUpdate(window.localStorage.getItem(UPDATE_STORAGE_KEY) !== "seen");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        playerName,
        gender,
        answers,
        currentIndex,
        appView,
        showResult,
        avatarConfig,
        sideAnswers,
        sideCurrentIndex,
        sideShowResult,
        belbinAnswers,
        belbinCurrentIndex,
        belbinShowResult,
        leadershipPotentialAnswers,
        leadershipPotentialIndex,
        leadershipPotentialShowResult
      })
    );
  }, [
    answers,
    appView,
    avatarConfig,
    belbinAnswers,
    belbinCurrentIndex,
    belbinShowResult,
    currentIndex,
    gender,
    hydrated,
    playerName,
    leadershipPotentialAnswers,
    leadershipPotentialIndex,
    leadershipPotentialShowResult,
    showResult,
    sideAnswers,
    sideCurrentIndex,
    sideShowResult
  ]);

  function beginQuest() {
    if (!playerName.trim() || !gender) return;
    navigationGeneration.current += 1;
    setAppView("hub");
  }

  function startCoreQuest() {
    navigationGeneration.current += 1;
    setAppView("core");
    setShowResult(isComplete);
    if (Object.keys(answers).length === 0) setCurrentIndex(0);
  }

  function restart() {
    navigationGeneration.current += 1;
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
    setAppView("registration");
    setPlayerName("");
    setGender(null);
    setAvatarConfig(defaultAvatarConfig);
    setSideAnswers({ engagement: {}, leadershipStyle: {} });
    setSideCurrentIndex({ engagement: 0, leadershipStyle: 0 });
    setSideShowResult({ engagement: false, leadershipStyle: false });
    setBelbinAnswers({});
    setBelbinCurrentIndex(0);
    setBelbinShowResult(false);
    setLeadershipPotentialAnswers({});
    setLeadershipPotentialIndex(0);
    setLeadershipPotentialShowResult(false);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  function answerCurrent(value: number) {
    const answeredIndex = currentIndex;
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    const generation = ++navigationGeneration.current;
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
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
    navigationGeneration.current += 1;
    setShowResult(false);
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    navigationGeneration.current += 1;
    if (currentIndex === questions.length - 1) {
      if (isComplete) setShowResult(true);
      return;
    }
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
  }

  function sideQuestionCount(questId: SideQuestId) {
    return questId === "engagement" ? engagementQuestions.length : leadershipStyleQuestions.length;
  }

  function answerSideQuestion(questId: SideQuestId, questionId: number, value: number) {
    const answeredIndex = sideCurrentIndex[questId];
    const nextAnswers = { ...sideAnswers[questId], [questionId]: value };
    const total = sideQuestionCount(questId);
    const generation = ++navigationGeneration.current;

    setSideAnswers((current) => ({ ...current, [questId]: nextAnswers }));

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
      if (answeredIndex === total - 1) {
        if (Object.keys(nextAnswers).length === total) {
          setSideShowResult((current) => ({ ...current, [questId]: true }));
        }
        return;
      }

      setSideCurrentIndex((current) => ({
        ...current,
        [questId]: current[questId] === answeredIndex ? answeredIndex + 1 : current[questId]
      }));
    }, 170);
  }

  function goSidePrevious(questId: SideQuestId) {
    navigationGeneration.current += 1;
    setSideShowResult((current) => ({ ...current, [questId]: false }));
    setSideCurrentIndex((current) => ({
      ...current,
      [questId]: Math.max(0, current[questId] - 1)
    }));
  }

  function goSideNext(questId: SideQuestId) {
    navigationGeneration.current += 1;
    const total = sideQuestionCount(questId);
    const index = sideCurrentIndex[questId];
    if (index === total - 1) {
      if (Object.keys(sideAnswers[questId]).length === total) {
        setSideShowResult((current) => ({ ...current, [questId]: true }));
      }
      return;
    }
    setSideCurrentIndex((current) => ({
      ...current,
      [questId]: Math.min(total - 1, current[questId] + 1)
    }));
  }

  function restartSideQuest(questId: SideQuestId) {
    navigationGeneration.current += 1;
    setSideAnswers((current) => ({ ...current, [questId]: {} }));
    setSideCurrentIndex((current) => ({ ...current, [questId]: 0 }));
    setSideShowResult((current) => ({ ...current, [questId]: false }));
  }

  function updateBelbinSection(
    sectionId: BelbinSectionId,
    scores: BelbinSectionScores
  ) {
    setBelbinAnswers((current) => ({ ...current, [sectionId]: scores }));
  }

  function goBelbinPrevious() {
    navigationGeneration.current += 1;
    setBelbinShowResult(false);
    setBelbinCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goBelbinNext() {
    navigationGeneration.current += 1;
    const section = belbinSections[belbinCurrentIndex];
    if (!isBelbinSectionComplete(belbinAnswers[section.id])) return;

    if (belbinCurrentIndex === belbinSections.length - 1) {
      if (countCompletedBelbinSections(belbinAnswers) === belbinSections.length) {
        setBelbinShowResult(true);
      }
      return;
    }

    setBelbinCurrentIndex((index) => Math.min(belbinSections.length - 1, index + 1));
  }

  function restartBelbin() {
    navigationGeneration.current += 1;
    setBelbinAnswers({});
    setBelbinCurrentIndex(0);
    setBelbinShowResult(false);
  }

  function answerLeadershipPotential(
    questionId: number,
    code: LeadershipPotentialCode
  ) {
    const answeredIndex = leadershipPotentialIndex;
    const nextAnswers = {
      ...leadershipPotentialAnswers,
      [questionId]: code
    };
    const generation = ++navigationGeneration.current;
    setLeadershipPotentialAnswers(nextAnswers);

    window.setTimeout(() => {
      if (navigationGeneration.current !== generation) return;
      if (answeredIndex === leadershipPotentialQuestions.length - 1) {
        if (Object.keys(nextAnswers).length === leadershipPotentialQuestions.length) {
          setLeadershipPotentialShowResult(true);
        }
        return;
      }
      setLeadershipPotentialIndex((index) =>
        index === answeredIndex ? index + 1 : index
      );
    }, 170);
  }

  function goLeadershipPotentialPrevious() {
    navigationGeneration.current += 1;
    setLeadershipPotentialShowResult(false);
    setLeadershipPotentialIndex((index) => Math.max(0, index - 1));
  }

  function goLeadershipPotentialNext() {
    navigationGeneration.current += 1;
    if (leadershipPotentialIndex === leadershipPotentialQuestions.length - 1) {
      if (
        Object.keys(leadershipPotentialAnswers).length ===
        leadershipPotentialQuestions.length
      ) {
        setLeadershipPotentialShowResult(true);
      }
      return;
    }
    setLeadershipPotentialIndex((index) =>
      Math.min(leadershipPotentialQuestions.length - 1, index + 1)
    );
  }

  function restartLeadershipPotential() {
    navigationGeneration.current += 1;
    setLeadershipPotentialAnswers({});
    setLeadershipPotentialIndex(0);
    setLeadershipPotentialShowResult(false);
  }

  function backToQuestHub() {
    navigationGeneration.current += 1;
    setAppView("hub");
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

  if (appView === "registration") {
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

  if (appView === "hub") {
    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-6 sm:px-6 lg:px-10">
          <QuestHubScreen
            playerName={playerName}
            gender={gender}
            coreAnswered={profile.answeredCount}
            engagementAnswered={Object.keys(sideAnswers.engagement).length}
            leadershipAnswered={Object.keys(sideAnswers.leadershipStyle).length}
            belbinCompleted={countCompletedBelbinSections(belbinAnswers)}
            leadershipPotentialAnswered={
              Object.keys(leadershipPotentialAnswers).length
            }
            onSelect={(questId) => {
              if (questId === "core") {
                startCoreQuest();
              } else if (questId === "belbin") {
                if (countCompletedBelbinSections(belbinAnswers) === belbinSections.length) {
                  setBelbinShowResult(true);
                }
                setAppView("belbin");
              } else if (questId === "leadershipPotential") {
                if (
                  Object.keys(leadershipPotentialAnswers).length ===
                  leadershipPotentialQuestions.length
                ) {
                  setLeadershipPotentialShowResult(true);
                }
                setAppView("leadershipPotential");
              } else {
                if (Object.keys(sideAnswers[questId]).length === sideQuestionCount(questId)) {
                  setSideShowResult((current) => ({ ...current, [questId]: true }));
                }
                setAppView(questId);
              }
            }}
            onReset={restart}
          />
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "leadershipPotential") {
    const result = calculateLeadershipPotentialResult(
      leadershipPotentialAnswers
    );

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {leadershipPotentialShowResult && result ? (
            <LeadershipPotentialResultScreen
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setLeadershipPotentialShowResult(false);
                setLeadershipPotentialIndex(
                  leadershipPotentialQuestions.length - 1
                );
              }}
              onBackToHub={backToQuestHub}
              onRestart={restartLeadershipPotential}
            />
          ) : (
            <LeadershipPotentialScreen
              playerName={playerName}
              gender={gender}
              answers={leadershipPotentialAnswers}
              currentIndex={leadershipPotentialIndex}
              onAnswer={answerLeadershipPotential}
              onPrevious={goLeadershipPotentialPrevious}
              onNext={goLeadershipPotentialNext}
              onBackToHub={backToQuestHub}
              onRestart={restartLeadershipPotential}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "belbin") {
    const result = calculateBelbinResult(belbinAnswers);

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {belbinShowResult && result ? (
            <BelbinResultScreen
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setBelbinShowResult(false);
                setBelbinCurrentIndex(belbinSections.length - 1);
              }}
              onBackToHub={backToQuestHub}
              onRestart={restartBelbin}
            />
          ) : (
            <BelbinAssessmentScreen
              playerName={playerName}
              gender={gender}
              answers={belbinAnswers}
              currentIndex={belbinCurrentIndex}
              onChange={updateBelbinSection}
              onPrevious={goBelbinPrevious}
              onNext={goBelbinNext}
              onBackToHub={backToQuestHub}
              onRestart={restartBelbin}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "engagement" || appView === "leadershipStyle") {
    const questId = appView;
    const result =
      questId === "engagement"
        ? calculateEngagementResult(sideAnswers[questId])
        : calculateLeadershipStyleResult(sideAnswers[questId]);

    return (
      <>
        <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
          {sideShowResult[questId] && result ? (
            <SideAssessmentResultScreen
              questId={questId}
              playerName={playerName}
              result={result}
              onBackToAnswers={() => {
                navigationGeneration.current += 1;
                setSideShowResult((current) => ({ ...current, [questId]: false }));
                setSideCurrentIndex((current) => ({
                  ...current,
                  [questId]: sideQuestionCount(questId) - 1
                }));
              }}
              onBackToHub={backToQuestHub}
              onRestart={() => restartSideQuest(questId)}
            />
          ) : (
            <SideAssessmentScreen
              questId={questId}
              playerName={playerName}
              gender={gender}
              answers={sideAnswers[questId]}
              currentIndex={sideCurrentIndex[questId]}
              onAnswer={(questionId, value) => answerSideQuestion(questId, questionId, value)}
              onPrevious={() => goSidePrevious(questId)}
              onNext={() => goSideNext(questId)}
              onBackToHub={backToQuestHub}
              onRestart={() => restartSideQuest(questId)}
            />
          )}
        </main>
        {appOverlays}
      </>
    );
  }

  if (appView === "core" && showResult && isComplete) {
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
            onBackToHub={backToQuestHub}
            onBack={() => {
              navigationGeneration.current += 1;
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
          onBackToHub={backToQuestHub}
        />
      </main>
      {appOverlays}
    </>
  );
}

function QuestHubScreen({
  playerName,
  gender,
  coreAnswered,
  engagementAnswered,
  leadershipAnswered,
  leadershipPotentialAnswered,
  belbinCompleted,
  onSelect,
  onReset
}: {
  playerName: string;
  gender: Gender | null;
  coreAnswered: number;
  engagementAnswered: number;
  leadershipAnswered: number;
  leadershipPotentialAnswered: number;
  belbinCompleted: number;
  onSelect: (
    questId: "core" | "belbin" | "leadershipPotential" | SideQuestId
  ) => void;
  onReset: () => void;
}) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    if (!confirmingReset) return;
    const timer = window.setTimeout(() => setConfirmingReset(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmingReset]);

  const quests = [
    {
      id: "core" as const,
      eyebrow: "MAIN QUEST",
      title: "Future Self Quest",
      description: "EQ, Big Five และ Professional Competencies เพื่อค้นหาอาชีพที่เข้ากับคุณ",
      answered: coreAnswered,
      total: questions.length,
      unit: "ข้อ",
      duration: "ประมาณ 20-25 นาที",
      accent: "#2f6fb6",
      icon: <ShieldCheck size={25} />
    },
    {
      id: "engagement" as const,
      eyebrow: "SIDE QUEST",
      title: "ความผูกพันต่อองค์กร",
      description: "สำรวจความเชื่อมั่น ความภาคภูมิใจ และพลังที่คุณมีต่อองค์กร",
      answered: engagementAnswered,
      total: engagementQuestions.length,
      unit: "ข้อ",
      duration: "ประมาณ 5-7 นาที",
      accent: "#39a7a5",
      icon: <HeartHandshake size={25} />
    },
    {
      id: "leadershipStyle" as const,
      eyebrow: "SIDE QUEST",
      title: "สไตล์ผู้นำ",
      description: "ค้นหารูปแบบการบริหารทีมที่คุณใช้บ่อย พร้อมจุดเด่นและสิ่งที่ควรระวัง",
      answered: leadershipAnswered,
      total: leadershipStyleQuestions.length,
      unit: "ข้อ",
      duration: "ประมาณ 3-4 นาที",
      accent: "#b84f73",
      icon: <UsersRound size={25} />
    },
    {
      id: "leadershipPotential" as const,
      eyebrow: "COLOR QUEST",
      title: "ภาวะผู้นำ 4 สี",
      description: "ตอบ 10 สถานการณ์ เพื่อค้นหาแนวโน้มภาวะผู้นำจากตัวเลือก A, B, C หรือ D ที่เด่นที่สุด",
      answered: leadershipPotentialAnswered,
      total: leadershipPotentialQuestions.length,
      unit: "ข้อ",
      duration: "ประมาณ 4-6 นาที",
      accent: "#795b85",
      icon: <Crown size={25} />
    },
    {
      id: "belbin" as const,
      eyebrow: "TEAM QUEST",
      title: "บทบาทในทีม Belbin",
      description: "แบ่ง 10 คะแนนในแต่ละสถานการณ์ เพื่อค้นหาบทบาทเด่นที่คุณนำมาใช้ในทีม",
      answered: belbinCompleted,
      total: belbinSections.length,
      unit: "ส่วน",
      duration: "ประมาณ 10-15 นาที",
      accent: "#b77a26",
      icon: <Workflow size={25} />
    }
  ];

  return (
    <section className="mx-auto max-w-7xl animate-rise">
      <header className="flex flex-col gap-5 border-b border-[#cdddf0] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#61799b]">
            <ClipboardList size={17} />
            Quest Board
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-[#223656] sm:text-6xl">
            เลือกแบบประเมิน
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#586984]">
            แต่ละแบบแยกจากกัน ทำชุดไหนก่อนก็ได้ และกลับมาทำชุดอื่นต่อได้ตลอดในแท็บนี้
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-[8px] border border-white/75 bg-white/65 px-4 py-3 sm:min-w-64">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">Adventurer</p>
            <p className="text-xl font-black text-[#24324b]">{playerName}</p>
            <p className="text-xs font-bold text-[#61799b]">{genderLabel(gender)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!confirmingReset) {
                setConfirmingReset(true);
                return;
              }
              setConfirmingReset(false);
              onReset();
            }}
            className={cx(
              "inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border px-3 text-xs font-black transition",
              confirmingReset
                ? "border-[#d19090] bg-[#fdeeee] text-[#b04a4a] hover:bg-[#fce3e3]"
                : "border-[#c5d6ea] bg-white/75 text-[#38516f] hover:bg-white"
            )}
          >
            <RotateCcw size={15} />
            {confirmingReset
              ? "แตะอีกครั้ง เพื่อล้างข้อมูลและกลับหน้าลงทะเบียน"
              : "ล้างข้อมูลทั้งหมด เริ่มผู้เล่นใหม่"}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {quests.map((quest, index) => {
          const progress = Math.round((quest.answered / quest.total) * 100);
          const completed = quest.answered === quest.total;
          return (
            <article
              key={quest.id}
              className={cx(
                "panel group flex min-h-[340px] flex-col rounded-[8px] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/95",
                index === 0 && "xl:min-h-[380px]"
              )}
              style={{ borderTop: `5px solid ${quest.accent}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="grid h-12 w-12 place-items-center rounded-[8px] text-white shadow-lg"
                  style={{ backgroundColor: quest.accent }}
                >
                  {quest.icon}
                </span>
                <span className="rounded-[6px] border border-[#cdddf0] bg-white/70 px-2.5 py-1 text-xs font-black text-[#61799b]">
                  {quest.total} {quest.unit}
                </span>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em]" style={{ color: quest.accent }}>
                {quest.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#24324b]">{quest.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#667393]">{quest.description}</p>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-[#667393]">
                  <span>{quest.duration}</span>
                  <span>{quest.answered}/{quest.total}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e3edf8]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: quest.accent }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelect(quest.id)}
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-[8px] text-sm font-black text-white transition hover:-translate-y-0.5"
                style={{ backgroundColor: quest.accent }}
              >
                {completed ? "ดูผลลัพธ์" : quest.answered > 0 ? "ทำต่อ" : "เริ่มทำ"}
                <ChevronRight size={17} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RestartQuestButton({
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

function SideAssessmentScreen({
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

function SideAssessmentResultScreen({
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

function getLeadershipPotentialProfile(code: LeadershipPotentialCode) {
  return leadershipPotentialProfiles.find((profile) => profile.code === code)!;
}

function LeadershipPotentialScreen({
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

function LeadershipPotentialResultScreen({
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

function distributeBelbinScores(itemIds: number[]): BelbinSectionScores {
  if (itemIds.length === 0) return {};
  const base = Math.floor(10 / itemIds.length);
  const remainder = 10 % itemIds.length;

  return Object.fromEntries(
    itemIds.map((itemId, index) => [itemId, base + (index < remainder ? 1 : 0)])
  );
}

function BelbinAssessmentScreen({
  playerName,
  gender,
  answers,
  currentIndex,
  onChange,
  onPrevious,
  onNext,
  onBackToHub,
  onRestart
}: {
  playerName: string;
  gender: Gender | null;
  answers: BelbinAnswers;
  currentIndex: number;
  onChange: (sectionId: BelbinSectionId, scores: BelbinSectionScores) => void;
  onPrevious: () => void;
  onNext: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const accent = "#b77a26";
  const section = belbinSections[currentIndex];
  const scores = answers[section.id] ?? {};
  const hasAnyAnswer = Object.values(answers).some(
    (sectionScores) => sectionScores && Object.keys(sectionScores).length > 0
  );
  const selectedIds = Object.keys(scores).map(Number);
  const selectedTotal = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const completed = countCompletedBelbinSections(answers);
  const isSectionComplete = isBelbinSectionComplete(scores);

  function toggleItem(itemId: number) {
    const isSelected = scores[itemId] !== undefined;
    if (!isSelected && selectedIds.length >= 3) return;
    const nextIds = isSelected
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];
    onChange(section.id, distributeBelbinScores(nextIds));
  }

  function transferPoint(itemId: number, direction: -1 | 1) {
    if (selectedIds.length < 2) return;
    const next = { ...scores };

    if (direction === 1) {
      const donor = selectedIds
        .filter((id) => id !== itemId && next[id] > 1)
        .sort((left, right) => next[right] - next[left])[0];
      if (donor === undefined) return;
      next[donor] -= 1;
      next[itemId] += 1;
    } else {
      if (next[itemId] <= 1) return;
      const recipient = selectedIds
        .filter((id) => id !== itemId)
        .sort((left, right) => next[left] - next[right])[0];
      next[itemId] -= 1;
      next[recipient] += 1;
    }

    onChange(section.id, next);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
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
            <Workflow size={24} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#71809a]">BELBIN TEAM ROLES</p>
            <p className="font-black text-[#24324b]">บทบาทในทีม</p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#cdddf0] pt-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#71809a]">ผู้ทำแบบประเมิน</p>
          <p className="mt-1 text-xl font-black text-[#24324b]">{playerName}</p>
          <p className="text-sm font-bold text-[#61799b]">{genderLabel(gender)}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-[#24324b]">{Math.round((completed / belbinSections.length) * 100)}%</p>
            <p className="text-sm font-bold text-[#667393]">{completed}/{belbinSections.length} ส่วน</p>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/75">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completed / belbinSections.length) * 100}%`, backgroundColor: accent }} />
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1.5" aria-label="ความคืบหน้าแต่ละส่วน">
            {belbinSections.map((item, index) => {
              const done = isBelbinSectionComplete(answers[item.id]);
              return (
                <span
                  key={item.id}
                  className={cx(
                    "grid aspect-square place-items-center rounded-[6px] border text-xs font-black",
                    index === currentIndex
                      ? "border-[#8c5b1c] bg-[#fff3dc] text-[#8c5b1c]"
                      : done
                        ? "border-[#b77a26] bg-[#b77a26] text-white"
                        : "border-[#d4dfec] bg-white/55 text-[#8390a5]"
                  )}
                >
                  {item.id}
                </span>
              );
            })}
          </div>
          <RestartQuestButton onRestart={onRestart} disabled={!hasAnyAnswer} />
        </div>
      </aside>

      <section className="panel animate-rise rounded-[8px] p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#cdddf0] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: accent }}>BELBIN TEAM ROLES</p>
            <h1 className="mt-1 text-3xl font-black text-[#24324b]">Section {section.id}</h1>
            <p className="mt-2 max-w-3xl text-base font-bold leading-7 text-[#586984]">{section.title}</p>
          </div>
          <span className="shrink-0 rounded-[8px] border border-[#d9c49d] bg-[#fff9ed] px-3 py-1.5 text-sm font-black text-[#8c5b1c]">
            ส่วน {currentIndex + 1} จาก {belbinSections.length}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[8px] border border-[#ead7b6] bg-[#fffaf0] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-[#5d461f]">เลือกข้อความที่ตรงกับคุณ 1–3 ข้อ</p>
            <p className="mt-1 text-sm leading-6 text-[#786748]">ระบบแบ่ง 10 คะแนนให้ก่อน แล้วใช้ปุ่ม − / + เพื่อย้ายน้ำหนักระหว่างข้อที่เลือก</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <span className="rounded-[6px] border border-[#e0c99e] bg-white/75 px-3 py-2 text-sm font-black text-[#6d5730]">เลือก {selectedIds.length}/3</span>
            <span className={cx("rounded-[6px] border px-3 py-2 text-sm font-black", selectedTotal === 10 ? "border-[#8fb99a] bg-[#eef9f0] text-[#317047]" : "border-[#dfb0aa] bg-[#fff1ef] text-[#a34f45]")}>รวม {selectedTotal}/10</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3" key={section.id}>
          {section.items.map((item, index) => {
            const itemId = index + 1;
            const selected = scores[itemId] !== undefined;
            const selectionLocked = !selected && selectedIds.length >= 3;
            const canAdjust = selected && selectedIds.length > 1;

            return (
              <div
                key={itemId}
                className={cx(
                  "grid min-h-20 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[8px] border p-3 transition sm:grid-cols-[44px_minmax(0,1fr)_150px] sm:px-4",
                  selected
                    ? "border-[#c7923f] bg-[#fff9ed] shadow-[0_10px_28px_rgba(151,105,31,0.12)]"
                    : selectionLocked
                      ? "border-[#dbe4ef] bg-white/35 opacity-55"
                      : "border-[#c9d8e9] bg-white/65 hover:bg-white"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(itemId)}
                  disabled={selectionLocked}
                  aria-pressed={selected}
                  aria-label={`${selected ? "ยกเลิก" : "เลือก"}ข้อ ${itemId}`}
                  className={cx(
                    "grid h-11 w-11 place-items-center rounded-[8px] border text-sm font-black transition",
                    selected ? "border-[#b77a26] bg-[#b77a26] text-white" : "border-[#c5d6ea] bg-white/80 text-[#526986]"
                  )}
                >
                  {selected ? <CheckCircle2 size={20} /> : itemId}
                </button>

                <button
                  type="button"
                  onClick={() => toggleItem(itemId)}
                  disabled={selectionLocked}
                  className="text-left text-sm font-bold leading-6 text-[#3f5270] sm:text-base"
                >
                  {item}
                </button>

                {selected ? (
                  <div className="col-span-2 flex h-12 items-center justify-between overflow-hidden rounded-[8px] border border-[#d5b77f] bg-white sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => transferPoint(itemId, -1)}
                      disabled={!canAdjust || scores[itemId] <= 1}
                      title="ลดคะแนนข้อนี้"
                      className="grid h-full w-11 place-items-center text-[#8c5b1c] transition hover:bg-[#fff3dc] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={17} />
                    </button>
                    <div className="text-center">
                      <span className="block text-xl font-black text-[#6d4914]">{scores[itemId]}</span>
                      <span className="block text-[10px] font-black uppercase text-[#9a7a49]">คะแนน</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => transferPoint(itemId, 1)}
                      disabled={!canAdjust || selectedIds.every((id) => id === itemId || scores[id] <= 1)}
                      title="เพิ่มคะแนนข้อนี้"
                      className="grid h-full w-11 place-items-center text-[#8c5b1c] transition hover:bg-[#fff3dc] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ) : (
                  <span className="col-span-2 hidden text-right text-xs font-bold text-[#8390a5] sm:col-span-1 sm:block">แตะเพื่อเลือก</span>
                )}
              </div>
            );
          })}
        </div>

        <footer className="mt-8 flex flex-col gap-3 border-t border-[#cdddf0] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={cx(
              "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border px-5 text-sm font-black",
              currentIndex === 0 ? "cursor-not-allowed border-[#d7e3f1] bg-white/35 text-[#98a6bb]" : "border-[#b8cce4] bg-white/75 text-[#38516f]"
            )}
          >
            <ChevronLeft size={18} />
            ย้อนกลับ
          </button>
          <p className={cx("text-center text-sm font-bold", isSectionComplete ? "text-[#317047]" : "text-[#9a5b52]")}>{isSectionComplete ? "Section นี้พร้อมแล้ว" : "เลือกอย่างน้อย 1 ข้อ และรวมให้ครบ 10 คะแนน"}</p>
          <button
            type="button"
            onClick={onNext}
            disabled={!isSectionComplete}
            className={cx("inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-black text-white", !isSectionComplete ? "cursor-not-allowed bg-[#95abc6]" : "hover:-translate-y-0.5")}
            style={!isSectionComplete ? undefined : { backgroundColor: accent }}
          >
            {currentIndex === belbinSections.length - 1 ? "ดูผลลัพธ์" : "ส่วนถัดไป"}
            <ChevronRight size={18} />
          </button>
        </footer>
      </section>
    </section>
  );
}

function BelbinResultScreen({
  playerName,
  result,
  onBackToAnswers,
  onBackToHub,
  onRestart
}: {
  playerName: string;
  result: BelbinResult;
  onBackToAnswers: () => void;
  onBackToHub: () => void;
  onRestart: () => void;
}) {
  const accent = "#b77a26";

  return (
    <section className="mx-auto max-w-6xl animate-rise">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBackToHub} className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]">
          <ChevronLeft size={17} />
          กระดานเควสต์
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onBackToAnswers} className="h-11 rounded-[8px] border border-[#b8cce4] bg-white/75 px-4 text-sm font-black text-[#38516f]">ดูคำตอบ</button>
          <button type="button" onClick={onRestart} className="inline-flex h-11 items-center gap-2 rounded-[8px] px-4 text-sm font-black text-white" style={{ backgroundColor: accent }}>
            <RotateCcw size={16} />
            ทำใหม่
          </button>
        </div>
      </div>

      <article className="panel rounded-[8px] p-5 sm:p-8">
        <header className="flex flex-col gap-5 border-b border-[#cdddf0] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: accent }}>BELBIN TEAM ROLES RESULT</p>
            <p className="mt-2 text-sm font-bold text-[#667393]">{playerName}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-[#24324b] sm:text-5xl">บทบาทเด่นในทีมของคุณ</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#586984]">คะแนนสูงสุดสะท้อนบทบาทที่คุณมีแนวโน้มนำมาใช้เมื่อทำงานร่วมกับผู้อื่น</p>
          </div>
          <div className="rounded-[8px] border border-[#d9c49d] bg-[#fff9ed] px-4 py-3 text-center">
            <p className="text-xs font-black uppercase text-[#8c6d3f]">คะแนนทั้งหมด</p>
            <p className="mt-1 text-3xl font-black text-[#6d4914]">70</p>
            <p className="text-xs font-bold text-[#8c6d3f]">จาก 7 Sections</p>
          </div>
        </header>

        {result.hasCutoffTie ? (
          <div className="mt-6 rounded-[8px] border border-[#d8c08e] bg-[#fff8e8] px-4 py-3 text-sm font-bold leading-6 text-[#705426]">
            มีคะแนนเสมอกันในอันดับตัดสิน จึงแสดงทุกบทบาทที่มีคะแนนเท่ากันเพื่อไม่ตัดผลลัพธ์ทิ้ง
          </div>
        ) : null}

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {result.featuredRoles.map((role) => (
            <section key={role.id} className="rounded-[8px] border border-[#d9c49d] bg-[#fffdf8] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-[8px] text-base font-black text-white" style={{ backgroundColor: accent }}>{role.id}</span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a7a49]">อันดับ {role.rank}</p>
                    <h2 className="text-xl font-black text-[#24324b]">{role.titleTh}</h2>
                    <p className="text-sm font-bold text-[#8c6d3f]">{role.titleEn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#2d5f9c]">{role.score}</span>
                  <span className="text-xs font-bold text-[#71809a]">/70</span>
                </div>
              </div>
              <p className="mt-5 font-black leading-7 text-[#3f5270]">{role.summary}</p>
              <p className="mt-3 text-sm leading-7 text-[#667393]">{role.description}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 border-t border-[#cdddf0] pt-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: accent }}>ROLE PROFILE</p>
              <h2 className="mt-1 text-2xl font-black text-[#24324b]">คะแนนทั้ง 8 บทบาท</h2>
            </div>
            <p className="text-sm font-bold text-[#667393]">ผลรวมทุกบทบาท = 70 คะแนน</p>
          </div>

          <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {result.rankedRoles.map((role) => (
              <div key={role.id} className="grid grid-cols-[42px_minmax(0,1fr)_44px] items-center gap-3">
                <span className="text-sm font-black text-[#5c6f8b]">{role.id}</span>
                <div>
                  <div className="mb-1 flex justify-between gap-3 text-xs font-bold text-[#667393]">
                    <span>{role.titleTh}</span>
                    <span>อันดับ {role.rank}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#e3edf8]">
                    <div className="h-full rounded-full" style={{ width: `${(role.score / 70) * 100}%`, backgroundColor: role.score >= result.rankedRoles[1].score ? accent : "#7ea0c8" }} />
                  </div>
                </div>
                <span className="text-right text-lg font-black text-[#2d5f9c]">{role.score}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 border-t border-[#cdddf0] pt-4 text-xs leading-5 text-[#71809a]">
          อ้างอิง: Belbin Team Roles Self Perception Inventory และ Scoring Key ตามเอกสารประกอบการสอน ผลนี้ใช้เพื่อสะท้อนบทบาทที่มีแนวโน้มโดดเด่นในการทำงานเป็นทีม ไม่ใช่การวินิจฉัยบุคลิกภาพ
        </p>
      </article>
    </section>
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

type GroupedScores = Array<{
  chapter: (typeof chapters)[number];
  scores: CategoryScore[];
}>;

function scoreReferenceSummary(score: CategoryScore) {
  const reference = score.reference;
  if (!reference) return score.levelLabel;

  if (reference.kind === "eq-range") {
    return `ช่วงต้นฉบับ ${reference.low}-${reference.high} · ${reference.label}`;
  }

  if (reference.kind === "competency-benchmark") {
    return `Mean ${reference.mean} · ช่วงคนส่วนใหญ่ (68%) ${reference.low}-${reference.high} · ${reference.label}`;
  }

  return `Norm ${score.normScore} · ${reference.label}`;
}

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
          <table className="print-score-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Raw</th>
                <th>Max</th>
                <th>Norm</th>
                <th>0-100</th>
                <th>Reference</th>
                <th>Interpretation</th>
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
                  <td>{scoreReferenceSummary(score)}</td>
                  <td>{score.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section className="print-section">
        <h2>วิธีคำนวณและแหล่งอ้างอิง</h2>
        {chapters.map((chapter) => {
          const methodology = assessmentMethodology[chapter.id];
          return (
            <div key={chapter.id} className="print-method">
              <strong>{methodology.title}</strong>
              <p>{methodology.calculation}</p>
              <p>แหล่งอ้างอิง: {methodology.source}</p>
              <p>{methodology.note}</p>
            </div>
          );
        })}
      </section>

      <footer className="print-footer">
        Big Five Locator และผลลัพธ์ทั้งหมดใช้เพื่อการเรียนการสอนและการสะท้อนตนเอง ไม่ใช่การวินิจฉัยทางจิตวิทยาหรือการประเมินทางคลินิก
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
  onBackToHub,
  onBack
}: {
  playerName: string;
  gender: Gender | null;
  avatarConfig: AvatarConfig;
  answers: AnswerMap;
  profile: ProfileResult;
  onRestart: () => void;
  onBackToHub: () => void;
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onBackToHub}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <ClipboardList size={17} />
            กระดานเควสต์
          </button>
          <button
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/70 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <ChevronLeft size={18} />
            กลับไปดูคำตอบ
          </button>
        </div>
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
            {chapter.id === "bigFive" ? <BigFiveLocatorChart scores={scores} /> : null}
            {chapter.id === "competency" ? <CompetencyBenchmarkChart scores={scores} /> : null}
          </div>
        ))}
      </section>

      <section className="panel mt-5 rounded-[8px] p-5" aria-labelledby="methodology-title">
        <div className="flex items-start gap-3 border-b border-[#cdddf0] pb-4">
          <BookOpenCheck className="mt-0.5 shrink-0 text-[#2f6fb6]" size={22} />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">SCORING NOTE</p>
            <h3 id="methodology-title" className="mt-1 text-2xl font-black text-[#24324b]">
              วิธีคำนวณและแหล่งอ้างอิง
            </h3>
          </div>
        </div>

        <div className="grid gap-5 py-5 md:grid-cols-3 md:gap-0">
          {chapters.map((chapter, index) => {
            const methodology = assessmentMethodology[chapter.id];
            return (
              <article
                key={chapter.id}
                className={cx(index > 0 && "border-t border-[#cdddf0] pt-5 md:border-l md:border-t-0 md:px-5 md:pt-0", index === 0 && "md:pr-5")}
              >
                <p className="text-sm font-black" style={{ color: chapter.accent }}>
                  {methodology.title}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#3f5270]">{methodology.calculation}</p>
                <p className="mt-3 text-xs leading-5 text-[#667393]">
                  <strong className="text-[#526987]">แหล่งอ้างอิง:</strong> {methodology.source}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#667393]">{methodology.note}</p>
              </article>
            );
          })}
        </div>

        <div className="flex items-start gap-3 border-t border-[#cdddf0] pt-4 text-sm leading-6 text-[#667393]">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#39a7a5]" size={18} />
          <p>
            Big Five Locator และผลลัพธ์ทั้งหมดใช้เพื่อการเรียนการสอนและการสะท้อนตนเอง
            ไม่ใช่การวินิจฉัยทางจิตวิทยาหรือการประเมินทางคลินิก
          </p>
        </div>
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

const bigFiveLocatorLabels: Record<string, [string, string, string]> = {
  adjustment: ["Resilient", "Responsive", "Reactive"],
  sociability: ["Introvert", "Ambivert", "Extrovert"],
  openness: ["Preserver", "Moderate", "Explorer"],
  agreeableness: ["Challenger", "Negotiator", "Adapter"],
  conscientiousness: ["Flexible", "Balanced", "Focused"]
};

function BigFiveLocatorChart({ scores }: { scores: CategoryScore[] }) {
  const locatorMin = 20;
  const locatorMax = 80;
  const ticks = [35, 45, 55, 65];
  const positionFor = (value: number) =>
    Math.max(2, Math.min(98, ((value - locatorMin) / (locatorMax - locatorMin)) * 100));

  return (
    <section className="mt-5 border-t border-[#cdddf0] pt-5" aria-labelledby="big-five-locator-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">BIG FIVE LOCATOR</p>
          <h4 id="big-five-locator-title" className="mt-1 text-xl font-black text-[#24324b]">
            ตำแหน่ง Norm Score บนแนวตีความ
          </h4>
        </div>
        <p className="text-xs font-bold text-[#667393]">จุดสีน้ำเงินคือ Norm Score ของผู้ทำ</p>
      </div>

      <div className="mt-4 grid gap-4">
        {scores.map((score) => {
          const normScore = score.normScore ?? 50;
          const labels = bigFiveLocatorLabels[score.key] ?? ["Low", "Moderate", "High"];
          const markerLeft = positionFor(normScore);

          return (
            <article key={score.key} className="grid gap-2 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-5">
              <div className="flex items-baseline justify-between gap-3 sm:block">
                <div>
                  <p className="font-black text-[#24324b]">{score.labelTh}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#667393]">{score.label}</p>
                </div>
                <span className="shrink-0 rounded-[6px] bg-[#eaf3ff] px-2 py-1 text-sm font-black text-[#2f6fb6]">
                  Norm {normScore}
                </span>
              </div>

              <div className="relative pt-7">
                <div className="absolute inset-x-0 top-0 h-5 text-[10px] font-black text-[#61799b] sm:text-xs">
                  {labels.map((label, index) => (
                    <span
                      key={label}
                      className="absolute -translate-x-1/2 whitespace-nowrap"
                      style={{ left: `${[33.33, 50, 66.67][index]}%` }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="relative h-5 rounded-full bg-[#e4edf8]">
                  <div className="absolute left-[25%] top-0 h-full w-[16.67%] rounded-l-full bg-[#dbeaff]" />
                  <div className="absolute left-[41.67%] top-0 h-full w-[16.66%] bg-[#d8f0ee]" />
                  <div className="absolute left-[58.33%] top-0 h-full w-[16.67%] rounded-r-full bg-[#fff0cb]" />
                  {ticks.map((tick) => (
                    <span
                      key={tick}
                      className="absolute top-0 h-full w-px bg-[#8ca4c2]/70"
                      style={{ left: `${positionFor(tick)}%` }}
                    />
                  ))}
                  <span
                    className="absolute top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f6fb6] shadow-[0_0_0_4px_rgba(47,111,182,0.16)]"
                    style={{ left: `${markerLeft}%` }}
                  />
                </div>
                <div className="relative mt-1 h-4 text-[10px] font-bold text-[#71809a] sm:text-xs">
                  {ticks.map((tick) => (
                    <span key={tick} className="absolute -translate-x-1/2" style={{ left: `${positionFor(tick)}%` }}>
                      {tick}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CompetencyBenchmarkChart({ scores }: { scores: CategoryScore[] }) {
  const benchmarkScores = scores.filter((score) => score.reference?.kind === "competency-benchmark");
  const chart = { width: 820, height: 455, left: 54, top: 30, plotWidth: 720, plotHeight: 308 };
  const bottom = chart.top + chart.plotHeight;
  const yFor = (value: number) => chart.top + ((100 - Math.max(0, Math.min(100, value))) / 100) * chart.plotHeight;
  const xFor = (index: number) =>
    chart.left + (chart.plotWidth / Math.max(benchmarkScores.length - 1, 1)) * index;

  return (
    <section className="mt-5 border-t border-[#cdddf0] pt-5" aria-labelledby="competency-chart-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">PROFESSIONAL COMPETENCIES</p>
          <h4 id="competency-chart-title" className="mt-1 text-xl font-black text-[#24324b]">
            เปรียบเทียบคะแนนกับกลุ่มอ้างอิง
          </h4>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-[#667393]" aria-label="คำอธิบายกราฟ">
          <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-[#24324b]" />Mean</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-3 w-5 bg-[#f5df5d]" />ช่วงคนส่วนใหญ่ (68%)</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-3 w-5 rounded-[2px] border-2 border-[#d6555b] bg-white" />คะแนนของคุณ</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[8px] border border-[#d5e3f4] bg-white/70 p-3">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="w-full min-w-[760px]"
          role="img"
          aria-label="กราฟเปรียบเทียบคะแนน Professional Competencies กับค่าเฉลี่ยและช่วงอ้างอิง 68 เปอร์เซ็นต์"
        >
          {Array.from({ length: 11 }, (_, index) => index * 10).map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line x1={chart.left} x2={chart.left + chart.plotWidth} y1={y} y2={y} stroke="#9bb1ca" strokeDasharray="4 5" strokeWidth="1" />
                <text x={chart.left - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="#667393">
                  {tick}
                </text>
              </g>
            );
          })}
          <line x1={chart.left} x2={chart.left} y1={chart.top} y2={bottom} stroke="#38516f" strokeWidth="1.5" />
          <line x1={chart.left} x2={chart.left + chart.plotWidth} y1={bottom} y2={bottom} stroke="#38516f" strokeWidth="1.5" />

          {benchmarkScores.map((score, index) => {
            const reference = score.reference;
            if (!reference || reference.kind !== "competency-benchmark") return null;
            const x = xFor(index);
            const top = yFor(reference.high ?? 100);
            const rangeBottom = yFor(reference.low ?? 0);
            const meanY = yFor(reference.mean ?? 0);
            const scoreY = yFor(score.raw);
            const labelY = Math.max(chart.top + 2, scoreY - 23);
            const labelWords = score.label.replace("Managing ", "").split(" ");

            return (
              <g key={score.key}>
                <line x1={x} x2={x} y1={chart.top} y2={bottom} stroke="#d5e3f4" strokeWidth="1" />
                <rect x={x - 9} y={top} width="18" height={rangeBottom - top} fill="#f5df5d" fillOpacity="0.9" />
                <circle cx={x} cy={meanY} r="4" fill="#24324b" />
                <line x1={x} x2={x} y1={scoreY} y2={labelY + 17} stroke="#d6555b" strokeWidth="1.5" />
                <rect x={x - 17} y={labelY} width="34" height="17" rx="2" fill="white" stroke="#d6555b" strokeWidth="1.5" />
                <text x={x} y={labelY + 12} textAnchor="middle" fontSize="10" fontWeight="800" fill="#b64148">
                  {score.raw}
                </text>
                <text x={x} y={bottom + 23} textAnchor="middle" fontSize="10" fontWeight="700" fill="#3f5270">
                  {labelWords.slice(0, 2).map((word, wordIndex) => (
                    <tspan key={word} x={x} dy={wordIndex === 0 ? 0 : 12}>{word}</tspan>
                  ))}
                </text>
              </g>
            );
          })}
          <text x={chart.left} y={16} fontSize="12" fontWeight="800" fill="#3f5270">คะแนน</text>
        </svg>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#667393]">
        ช่วงสีเหลืองแสดงคะแนนของคนส่วนใหญ่ในกลุ่มอ้างอิงประมาณ 68% จุดดำคือ Mean และกรอบแดงคือคะแนนของคุณ
      </p>
    </section>
  );
}

function CategoryBar({ score }: { score: CategoryScore }) {
  const metrics = [{ label: "คะแนนดิบ", value: `${score.raw}/${score.max}` }];
  const reference = score.reference;

  if (score.normScore !== undefined) {
    metrics.push({ label: "Norm Score", value: String(score.normScore) });
  } else if (reference?.kind === "eq-range") {
    metrics.push({ label: "ช่วงต้นฉบับ", value: `${reference.low}-${reference.high}` });
  } else if (reference?.kind === "competency-benchmark") {
    metrics.push(
      { label: "Mean", value: String(reference.mean) },
      { label: "ช่วงคนส่วนใหญ่ 68%", value: `${reference.low}-${reference.high}` }
    );
  }

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
          <p className="whitespace-nowrap text-2xl font-black text-[#2d5f9c]">
            {score.percent}<span className="text-xs text-[#667393]">/100</span>
          </p>
          <p className="text-xs font-bold text-[#667393]">คะแนนแสดงผล</p>
        </div>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e3edf8]">
        <div className="h-full rounded-full bg-[#e0a93d]" style={{ width: `${score.percent}%` }} />
      </div>

      <div
        className="mt-3 grid border-y border-[#dbe7f4] py-2"
        style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
      >
        {metrics.map((metric, index) => (
          <div key={metric.label} className={cx("min-w-0 px-2", index > 0 && "border-l border-[#dbe7f4]") }>
            <p className="truncate text-[10px] font-black uppercase text-[#71809a]">{metric.label}</p>
            <p className="mt-0.5 text-sm font-black text-[#38516f]">{metric.value}</p>
          </div>
        ))}
      </div>

      <p
        className={cx(
          "mt-3 text-sm font-black leading-6",
          score.level === "high" && "text-[#168e8a]",
          score.level === "mid" && "text-[#2f6fb6]",
          score.level === "low" && "text-[#c45f63]"
        )}
      >
        {score.levelLabel}
      </p>
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
