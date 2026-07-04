"use client";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Medal,
  Play,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound
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

const STORAGE_KEY = "future-self-quest-state-v1";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type HairStyle = "soft" | "short" | "long" | "bun";
type OutfitStyle = "armor" | "hoodie" | "scholar" | "scout";
type AccessoryStyle = "stars" | "glasses" | "crown" | "none";
type BodyType = "female" | "male";
type JobId = "sword";

type AvatarConfig = {
  jobId: JobId;
  bodyType: BodyType;
  skin: string;
  hair: string;
  outfit: string;
  accent: string;
  hairStyle: HairStyle;
  outfitStyle: OutfitStyle;
  accessory: AccessoryStyle;
};

const defaultAvatarConfig: AvatarConfig = {
  jobId: "sword",
  bodyType: "female",
  skin: "#FFD6BA",
  hair: "#F3B96A",
  outfit: "#8D5E9A",
  accent: "#DDEBFA",
  hairStyle: "soft",
  outfitStyle: "armor",
  accessory: "stars"
};

const jobOptions: Array<{
  id: JobId;
  name: string;
  titleTh: string;
  variants: { male: string; female: string };
  accent: string;
  description: string;
}> = [
  {
    id: "sword",
    name: "Swordsman",
    titleTh: "นักดาบ",
    variants: {
      female: "/jobs/swordwoman.png",
      male: "/jobs/swordman.png"
    },
    accent: "#D19A3A",
    description: "สายบุกผู้ว่องไว อ่านจังหวะแม่น กล้าตัดสินใจ และพร้อมเปิดทางให้ทีม"
  }
];

const skinOptions = ["#FFD6BA", "#E7B38E", "#C88F68", "#8C5F4A"];
const hairOptions = ["#F3B96A", "#6E4A3A", "#1F2937", "#D66A59", "#E8E1D5"];
const outfitOptions = ["#8D5E9A", "#2F6FB6", "#168E8A", "#D96C6C", "#5B6477"];
const accentOptions = ["#DDEBFA", "#FCE7A3", "#F8BBD0", "#BCEBD8", "#E2D4FF"];

const bodyTypes: Array<{ value: BodyType; label: string }> = [
  { value: "female", label: "ผญ" },
  { value: "male", label: "ผช" }
];

const hairStyles: Array<{ value: HairStyle; label: string }> = [
  { value: "soft", label: "Soft" },
  { value: "short", label: "Short" },
  { value: "long", label: "Long" },
  { value: "bun", label: "Bun" }
];

const outfitStyles: Array<{ value: OutfitStyle; label: string }> = [
  { value: "armor", label: "Armor" },
  { value: "hoodie", label: "Hoodie" },
  { value: "scholar", label: "Scholar" },
  { value: "scout", label: "Scout" }
];

const accessoryStyles: Array<{ value: AccessoryStyle; label: string }> = [
  { value: "stars", label: "Stars" },
  { value: "glasses", label: "Glasses" },
  { value: "crown", label: "Crown" },
  { value: "none", label: "None" }
];

function normalizeAvatarConfig(value?: Partial<AvatarConfig>): AvatarConfig {
  const next = { ...defaultAvatarConfig, ...(value || {}) };
  return jobOptions.some((job) => job.id === next.jobId) ? next : defaultAvatarConfig;
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
  className
}: {
  avatarConfig: AvatarConfig;
  className?: string;
}) {
  const job = getSelectedJob(avatarConfig);
  const imageSrc = getJobImage(avatarConfig);

  return (
    <img
      src={imageSrc}
      alt={job.name}
      className={cx(
        "h-full w-auto object-contain drop-shadow-[0_22px_24px_rgba(54,74,102,0.22)]",
        className
      )}
    />
  );

  const { bodyType, skin, hair, outfit, accent, hairStyle, outfitStyle, accessory } = avatarConfig;
  const isMale = bodyType === "male";
  const trouser = isMale ? "#46536B" : "#684B58";
  const boot = isMale ? "#2E3345" : "#513B48";

  return (
    <svg
      viewBox="0 0 320 420"
      className={cx("h-full w-auto object-contain", className)}
      role="img"
      aria-label="Custom Future Self Quest avatar"
    >
      <ellipse cx="160" cy="382" rx="96" ry="22" fill="#345D8E" fillOpacity="0.2" />
      <ellipse cx="160" cy="382" rx="65" ry="14" fill="#2D5F9C" fillOpacity="0.12" />

      {hairStyle === "long" || (!isMale && hairStyle === "soft") ? (
        <path
          d={
            isMale
              ? "M105 151C92 98 123 62 163 61C208 60 233 95 222 153L212 256C201 283 119 283 108 256L105 151Z"
              : "M92 151C75 91 111 52 160 51C214 50 246 91 229 157L220 288C202 318 117 318 99 288L92 151Z"
          }
          fill={hair}
          opacity="0.82"
        />
      ) : null}

      {hairStyle === "bun" ? (
        <>
          <circle cx="101" cy="111" r={isMale ? 25 : 31} fill={hair} />
          <circle cx="219" cy="111" r={isMale ? 25 : 31} fill={hair} />
          <circle cx="94" cy="105" r={isMale ? 10 : 12} fill="#FFFFFF" fillOpacity="0.16" />
        </>
      ) : null}

      <path d="M121 302H150L146 366H102L121 302Z" fill={trouser} />
      <path d="M170 302H199L218 366H174L170 302Z" fill={trouser} />
      <path d="M98 354H150C158 359 163 370 163 381H84C84 368 89 359 98 354Z" fill={boot} />
      <path d="M170 354H222C231 359 236 368 236 381H157C157 370 162 359 170 354Z" fill={boot} />

      <rect x="143" y="190" width="35" height="35" rx="14" fill={skin} />
      <path
        d={
          isMale
            ? "M102 222C112 201 130 194 160 194C190 194 208 201 218 222L226 315H94L102 222Z"
            : "M109 224C119 202 136 194 160 194C184 194 201 202 211 224L224 316H96L109 224Z"
        }
        fill={outfit}
      />

      {outfitStyle === "hoodie" ? (
        <>
          <path d="M116 221C122 202 140 190 160 190C180 190 198 202 204 221L188 239H132L116 221Z" fill={accent} />
          <path d="M122 246H198V316H122V246Z" fill={outfit} opacity="0.86" />
          <path d="M151 235L145 279M169 235L175 279" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : outfitStyle === "scholar" ? (
        <>
          <path d="M109 224L160 255L211 224L199 209H121L109 224Z" fill={accent} />
          <path d="M128 250H192L202 316H118L128 250Z" fill="#F9FCFF" opacity="0.64" />
          <path d="M160 255V316" stroke="#6C83A4" strokeOpacity="0.48" strokeWidth="4" />
          <path d="M130 244L116 316M190 244L204 316" stroke="#27364F" strokeOpacity="0.18" strokeWidth="5" />
        </>
      ) : outfitStyle === "scout" ? (
        <>
          <path d="M113 220H138L210 316H183L113 220Z" fill={accent} />
          <path d="M207 220H182L110 316H137L207 220Z" fill="#FFFFFF" fillOpacity="0.15" />
          <circle cx="160" cy="258" r="13" fill="#E0A93D" stroke="#FFF6DC" strokeWidth="4" />
        </>
      ) : (
        <>
          <path d="M107 223L160 253L213 223L201 208H119L107 223Z" fill="#FFF6DC" fillOpacity="0.9" />
          <path d="M130 245H190L200 316H120L130 245Z" fill={accent} />
          <path d="M148 245L137 316M172 245L183 316" stroke="#6C83A4" strokeOpacity="0.48" strokeWidth="4" />
        </>
      )}

      <path d="M108 222L80 274C73 288 82 303 98 303L124 302L128 277L111 277L136 234L108 222Z" fill={skin} />
      <path d="M212 222L240 274C247 288 238 303 222 303L196 302L192 277L209 277L184 234L212 222Z" fill={skin} />
      <circle cx="102" cy="294" r="15" fill={skin} />
      <circle cx="218" cy="294" r="15" fill={skin} />

      <ellipse cx="106" cy="151" rx="12" ry="18" fill={skin} />
      <ellipse cx="214" cy="151" rx="12" ry="18" fill={skin} />
      <ellipse cx="160" cy="145" rx={isMale ? 49 : 52} ry={isMale ? 55 : 58} fill={skin} />
      <path d="M127 126C133 95 158 81 185 89C203 94 217 111 218 136C197 129 180 115 173 99C159 119 142 126 127 126Z" fill="#FFFFFF" fillOpacity="0.13" />

      {hairStyle === "short" ? (
        <path
          d={
            isMale
              ? "M104 135C107 92 136 69 177 74C205 78 226 100 224 135C190 113 151 111 119 132L112 161C103 153 101 145 104 135Z"
              : "M104 136C111 91 145 70 184 78C212 84 226 107 223 140C194 125 156 119 118 136L111 162C105 153 102 145 104 136Z"
          }
          fill={hair}
        />
      ) : hairStyle === "bun" ? (
        <path d="M105 138C109 91 146 70 184 78C212 84 226 108 222 140C203 129 190 112 186 96C168 120 138 136 105 138Z" fill={hair} />
      ) : hairStyle === "long" ? (
        <path d="M103 142C107 93 143 69 184 78C211 84 226 108 224 142C205 131 191 115 187 97C168 122 139 139 103 142Z" fill={hair} />
      ) : (
        <path
          d={
            isMale
              ? "M104 136C113 90 149 70 187 80C214 87 228 111 222 142C197 128 174 103 172 94C155 118 134 132 104 136Z"
              : "M104 141C111 92 145 69 184 78C212 84 226 108 223 142C204 130 191 112 187 96C167 122 139 139 104 141Z"
          }
          fill={hair}
        />
      )}
      <path d="M118 139C132 124 151 117 174 111" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="7" strokeLinecap="round" />

      <circle cx="138" cy="160" r="8" fill="#322B44" />
      <circle cx="183" cy="160" r="8" fill="#322B44" />
      <circle cx="140" cy="157" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
      <circle cx="185" cy="157" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
      <path d="M146 186C154 194 168 194 176 186" stroke="#8D4D5C" strokeWidth="5" strokeLinecap="round" />

      {accessory === "glasses" ? (
        <g fill="none" stroke="#24324B" strokeWidth="4" strokeLinecap="round">
          <circle cx="138" cy="160" r="17" />
          <circle cx="183" cy="160" r="17" />
          <path d="M155 160H166" />
        </g>
      ) : null}

      {accessory === "stars" ? (
        <>
          <path d="M72 57L90 77L115 68L101 91L118 111L92 105L78 128L76 101L51 93L75 82L72 57Z" fill="#E0A93D" />
          <path d="M248 79L263 96L286 88L273 108L289 124L266 121L254 143L250 118L227 112L249 101L248 79Z" fill="#4F8EE8" />
        </>
      ) : accessory === "crown" ? (
        <path d="M119 86L141 62L160 88L181 62L203 86L197 108H125L119 86Z" fill="#E0A93D" stroke="#FFF6DC" strokeWidth="5" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}

function ColorSwatches({
  label,
  values,
  selected,
  onSelect
}: {
  label: string;
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#61799b]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cx(
              "h-9 w-9 rounded-full border transition hover:-translate-y-0.5",
              selected === value ? "border-[#2f6fb6] ring-4 ring-[#b9d5f6]" : "border-white/80"
            )}
            style={{ backgroundColor: value }}
            aria-label={`${label} ${value}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChoiceButtons<T extends string>({
  label,
  options,
  selected,
  onSelect
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#61799b]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cx(
              "h-10 rounded-[8px] border px-3 text-sm font-black transition hover:-translate-y-0.5",
              selected === option.value
                ? "border-[#2f6fb6] bg-[#2f6fb6] text-white shadow-glow"
                : "border-[#c5d6ea] bg-white/72 text-[#38516f] hover:bg-white"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AvatarCustomizer({
  avatarConfig,
  onChange
}: {
  avatarConfig: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}) {
  const selectedJob = getSelectedJob(avatarConfig);

  return (
    <div className="mt-5 space-y-4 rounded-[8px] border border-[#cdddf0] bg-white/62 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserRound size={17} className="text-[#2d5f9c]" />
          <p className="text-sm font-black text-[#24324b]">เลือกอาชีพ</p>
        </div>
        <span className="rounded-[8px] bg-[#f4e6c7] px-3 py-1 text-xs font-black text-[#8a5c18]">
          {jobOptions.length} Job
        </span>
      </div>

      <div className="grid gap-3">
        {jobOptions.map((job) => {
          const selected = selectedJob.id === job.id;

          return (
            <button
              key={job.id}
              type="button"
              onClick={() => onChange({ ...avatarConfig, jobId: job.id })}
              className={cx(
                "grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-[8px] border p-3 text-left transition hover:-translate-y-0.5",
                selected
                  ? "border-[#d19a3a] bg-[#fff7e6] shadow-glow"
                  : "border-[#c5d6ea] bg-white/72 hover:bg-white"
              )}
            >
              <span className="relative flex h-20 items-end justify-center overflow-hidden rounded-[8px] bg-gradient-to-b from-[#f9fcff] to-[#e2edf8]">
                <span className="absolute bottom-2 h-6 w-14 rounded-[50%] bg-[#89a9cf]/25" />
                <img src={job.variants[avatarConfig.bodyType]} alt="" className="relative h-[92%] w-auto object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-black text-[#24324b]">{job.name}</span>
                <span className="mt-0.5 block text-sm font-bold text-[#8a5c18]">{job.titleTh}</span>
                <span className="mt-1 block text-xs leading-5 text-[#667393]">{job.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Gender toggle */}
      <div className="mt-1">
        <p className="mb-2 text-xs font-bold text-[#61799b]">เลือกเพศ</p>
        <div className="grid grid-cols-2 gap-2">
          {bodyTypes.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() => onChange({ ...avatarConfig, bodyType: bt.value })}
              className={cx(
                "flex items-center justify-center gap-2 rounded-[8px] border py-2.5 text-sm font-black transition",
                avatarConfig.bodyType === bt.value
                  ? "border-[#2f6fb6] bg-[#eaf3ff] text-[#2d5f9c] shadow-sm"
                  : "border-[#c5d6ea] bg-white/72 text-[#667393] hover:bg-white"
              )}
            >
              {bt.value === "female" ? "👩" : "👨"} {bt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const update = (patch: Partial<AvatarConfig>) => onChange({ ...avatarConfig, ...patch });

  return (
    <div className="mt-5 space-y-5 rounded-[8px] border border-[#cdddf0] bg-white/62 p-4">
      <div className="flex items-center gap-2">
        <UserRound size={17} className="text-[#2d5f9c]" />
        <p className="text-sm font-black text-[#24324b]">แต่งตัวละคร</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ChoiceButtons label="Character" options={bodyTypes} selected={avatarConfig.bodyType} onSelect={(bodyType) => update({ bodyType })} />
        <ChoiceButtons label="Hair" options={hairStyles} selected={avatarConfig.hairStyle} onSelect={(hairStyle) => update({ hairStyle })} />
        <ChoiceButtons label="Outfit" options={outfitStyles} selected={avatarConfig.outfitStyle} onSelect={(outfitStyle) => update({ outfitStyle })} />
        <ChoiceButtons label="Accessory" options={accessoryStyles} selected={avatarConfig.accessory} onSelect={(accessory) => update({ accessory })} />
        <ColorSwatches label="Skin" values={skinOptions} selected={avatarConfig.skin} onSelect={(skin) => update({ skin })} />
        <ColorSwatches label="Hair Color" values={hairOptions} selected={avatarConfig.hair} onSelect={(hair) => update({ hair })} />
        <ColorSwatches label="Outfit Color" values={outfitOptions} selected={avatarConfig.outfit} onSelect={(outfit) => update({ outfit })} />
        <ColorSwatches label="Accent" values={accentOptions} selected={avatarConfig.accent} onSelect={(accent) => update({ accent })} />
      </div>
    </div>
  );
}

export default function Home() {
  const [playerName, setPlayerName] = useState("Player One");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
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
          avatarConfig?: Partial<AvatarConfig>;
        };
        setPlayerName(saved.playerName || "Player One");
        setAnswers(saved.answers || {});
        setCurrentIndex(Math.min(saved.currentIndex || 0, questions.length - 1));
        setStarted(Boolean(saved.started));
        setShowResult(Boolean(saved.showResult));
        setAvatarConfig(normalizeAvatarConfig(saved.avatarConfig));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ playerName, answers, currentIndex, started, showResult, avatarConfig })
    );
  }, [answers, avatarConfig, currentIndex, hydrated, playerName, showResult, started]);

  function beginQuest() {
    setStarted(true);
    setShowResult(false);
    setCurrentIndex(0);
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
    setStarted(false);
    setPlayerName("Player One");
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

  if (!hydrated) {
    return <main className="quest-shell min-h-svh" />;
  }

  if (!started) {
    return (
      <main className="quest-shell flex min-h-svh items-center px-4 py-6 sm:px-6 lg:px-10">
        <StartScreen
          playerName={playerName}
          setPlayerName={setPlayerName}
          avatarConfig={avatarConfig}
          setAvatarConfig={setAvatarConfig}
          onStart={beginQuest}
        />
      </main>
    );
  }

  if (showResult && isComplete) {
    return (
      <main className="quest-shell min-h-svh px-4 py-6 sm:px-6 lg:px-10">
        <ResultScreen
          playerName={playerName}
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
    );
  }

  return (
    <main className="quest-shell min-h-svh px-4 py-5 sm:px-6 lg:px-10">
      <QuestScreen
        answers={answers}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        playerName={playerName}
        avatarConfig={avatarConfig}
        profile={profile}
        onAnswer={answerCurrent}
        onNext={goNext}
        onPrevious={goPrevious}
        onRestart={restart}
      />
    </main>
  );
}

function StartScreen({
  playerName,
  setPlayerName,
  avatarConfig,
  setAvatarConfig,
  onStart
}: {
  playerName: string;
  setPlayerName: (value: string) => void;
  avatarConfig: AvatarConfig;
  setAvatarConfig: (value: AvatarConfig) => void;
  onStart: () => void;
}) {
  const selectedJob = getSelectedJob(avatarConfig);

  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_430px]">
      <div className="animate-rise">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-[#2d5f9c] shadow-sm">
          <Sparkles size={16} />
          Future Self Quest
        </p>
        <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-[#223656] sm:text-7xl">
          เลือกอาชีพ
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#51627f]">
          เลือกอาชีพเริ่มต้น แล้วตอบ 3 เควสต์เพื่อปลดล็อกบุคลิก สเตตัส และคลาสผลลัพธ์ของคุณ
        </p>

        <div className="mt-8 max-w-xl rounded-[8px] border border-white/70 bg-white/70 p-3 shadow-insetPanel backdrop-blur">
          <label className="mb-2 flex items-center gap-2 px-1 text-sm font-bold text-[#38516f]">
            <UserRound size={16} />
            ชื่อตัวละคร
          </label>
          <input
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            className="h-14 w-full rounded-[8px] border border-[#b8cce4] bg-white/85 px-4 text-lg font-bold text-[#24324b] shadow-inner"
            maxLength={28}
            placeholder="ใส่ชื่อผู้เล่น"
          />
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
          className="mt-8 inline-flex h-14 items-center gap-3 rounded-[8px] bg-[#2f6fb6] px-7 text-lg font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#275f9e]"
        >
          <Play size={20} fill="currentColor" />
          เริ่มเควสต์
        </button>
      </div>

      <div className="panel animate-rise rounded-[8px] p-6 [animation-delay:120ms]">
        <div className="relative mx-auto flex aspect-[4/5] max-h-[560px] items-end justify-center overflow-hidden rounded-[8px] border border-white/80 bg-gradient-to-b from-[#f8fcff] via-[#edf6ff] to-[#dcebf7]">
          <div className="pulse-rune absolute bottom-12 h-28 w-56 rounded-[50%] border-4 border-[#8ab7ed]/45" />
          <AvatarPreview avatarConfig={avatarConfig} className="avatar-float relative z-10 h-[88%]" />
        </div>
        <AvatarCustomizer avatarConfig={avatarConfig} onChange={setAvatarConfig} />
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#61799b]">
              Selected Job
            </p>
            <p className="text-2xl font-black text-[#24324b]">{selectedJob.name}</p>
            <p className="mt-1 text-sm font-bold text-[#8a5c18]">{selectedJob.titleTh}</p>
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
  avatarConfig,
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
  avatarConfig: AvatarConfig;
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
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const selectedJob = getSelectedJob(avatarConfig);

  return (
    <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="panel animate-rise rounded-[8px] p-5 lg:sticky lg:top-5 lg:h-[calc(100svh-40px)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#2f6fb6] text-white shadow-glow">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#667393]">{selectedJob.name}</p>
            <p className="text-xl font-black text-[#24324b]">{playerName || "Player One"}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[8px] border border-white/80 bg-white/55">
          <div className="relative flex h-60 items-end justify-center bg-gradient-to-b from-[#f7fbff] to-[#dcebf7]">
            <div className="pulse-rune absolute bottom-8 h-20 w-44 rounded-[50%] border-4 border-[#8ab7ed]/40" />
            <AvatarPreview avatarConfig={avatarConfig} className="avatar-float relative h-[92%]" />
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
                  {chapterIndex}/{chapterQuestions.length}
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
              <div className="flex justify-between text-xs font-black uppercase tracking-[0.16em] text-[#61799b]">
                <span>Quest</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/75">
                <div
                  className="h-full rounded-full bg-[#2f6fb6] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <QuestionCard
            answers={answers}
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
              ข้อ {currentIndex + 1} จาก {questions.length}
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
  answers,
  question,
  selected,
  onAnswer
}: {
  answers: AnswerMap;
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

      <div className="mt-6 flex flex-wrap gap-2">
        {[question.id, ...Object.keys(answers).slice(-4)].map((id) => (
          <span
            key={id}
            className={cx(
              "h-2 w-8 rounded-full",
              answers[id] !== undefined ? "bg-[#4f8ee8]" : "bg-[#d8e5f3]"
            )}
          />
        ))}
      </div>
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
      <div className="mt-5 grid gap-4 rounded-[8px] border border-[#cdddf0] bg-white/62 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <TraitSide title={question.left || ""} subtitle={question.leftTh || ""} align="left" />
        <div className="hidden h-16 w-px bg-[#cdddf0] sm:block" />
        <TraitSide title={question.right || ""} subtitle={question.rightTh || ""} align="right" />
      </div>

      <div className="mt-8 grid grid-cols-5 gap-3">
        {[5, 4, 3, 2, 1].map((value) => (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={cx(
              "h-20 rounded-[8px] border text-center transition sm:h-24",
              selected === value
                ? "border-[#168e8a] bg-[#168e8a] text-white shadow-glow"
                : "border-[#c5d6ea] bg-white/72 text-[#38516f] hover:-translate-y-0.5 hover:bg-white"
            )}
          >
            <span className="block text-3xl font-black">{value}</span>
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">
              {value === 5 ? "Left" : value === 1 ? "Right" : "Mid"}
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
  align
}: {
  title: string;
  subtitle: string;
  align: "left" | "right";
}) {
  return (
    <div className={cx("min-h-24", align === "right" && "sm:text-right")}>
      <p className="text-2xl font-black leading-tight text-[#24324b]">{title}</p>
      <p className="mt-2 text-lg font-bold text-[#4f6d91]">{subtitle}</p>
    </div>
  );
}

type GroupedScores = Array<{
  chapter: (typeof chapters)[number];
  scores: CategoryScore[];
}>;

function csvCell(value: string | number | undefined) {
  const text = value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportFileName(playerName: string, extension: string) {
  const safeName = (playerName || "Player One")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `Future-Self-Quest-${safeName || "Player-One"}.${extension}`;
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
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
      averagePower,
      count: scores.length
    };
  });
}

function answerLabel(question: Question, answer: number | undefined) {
  if (answer === undefined) return "";

  if (question.kind === "eq") {
    return eqScale.find((option) => option.value === answer)?.label ?? "";
  }

  if (question.kind === "competency") {
    return competencyScaleAnchors[answer as keyof typeof competencyScaleAnchors] ?? "";
  }

  if (answer === 5) return `${question.leftTh || question.left} (${question.left})`;
  if (answer === 4) return `Lean left: ${question.leftTh || question.left} (${question.left})`;
  if (answer === 3) return "Middle / balanced";
  if (answer === 2) return `Lean right: ${question.rightTh || question.right} (${question.right})`;
  if (answer === 1) return `${question.rightTh || question.right} (${question.right})`;
  return "";
}

function questionResponseRows(answers: AnswerMap, profile: ProfileResult) {
  const scoreByKey = new Map(profile.categoryScores.map((score) => [score.key, score]));

  return questions.map((question) => {
    const chapter = chapters.find((item) => item.id === question.chapterId);
    const categoryScore = scoreByKey.get(question.category);
    const answer = answers[question.id];

    return [
      chapter ? `${chapter.short} - ${chapter.titleTh}` : question.chapterId,
      question.item,
      question.id,
      categoryScore?.labelTh,
      categoryScore?.label,
      question.promptTh,
      question.prompt,
      question.kind === "bigFive" ? question.leftTh : undefined,
      question.kind === "bigFive" ? question.left : undefined,
      question.kind === "bigFive" ? question.rightTh : undefined,
      question.kind === "bigFive" ? question.right : undefined,
      answer,
      answerLabel(question, answer),
      categoryScore?.raw,
      categoryScore?.max,
      categoryScore?.normScore,
      categoryScore?.percent,
      categoryScore?.levelLabel
    ];
  });
}

function downloadScoreCsv(
  playerName: string,
  profile: ProfileResult,
  groupedScores: GroupedScores,
  answers: AnswerMap
) {
  const rows: Array<Array<string | number | undefined>> = [
    ["Future Self Quest Score Report"],
    ["Player", playerName || "Player One"],
    ["Class", profile.classProfile.titleTh, profile.classProfile.title],
    [],
    ["Question Responses"],
    [
      "Part",
      "Item",
      "Question ID",
      "Category TH",
      "Category EN",
      "Question TH",
      "Question EN",
      "Big Five Left TH",
      "Big Five Left EN",
      "Big Five Right TH",
      "Big Five Right EN",
      "Answer Score",
      "Answer Label",
      "Category Raw",
      "Category Max",
      "Category Norm",
      "Category Power",
      "Category Level"
    ],
    ...questionResponseRows(answers, profile),
    [],
    ["Part Summary"],
    ["Part", "Raw Score", "Max Score", "Average Power", "Categories"]
  ];

  partSummaryRows(groupedScores).forEach((row) => {
    rows.push([row.part, row.raw, row.max, row.averagePower, row.count]);
  });

  rows.push(
    [],
    ["RPG Stats"],
    ["Stat", "Meaning", "Value"],
    ...profile.rpgStats.map((stat) => [stat.key, stat.labelTh, stat.value]),
    [],
    ["Category Scores"],
    ["Part", "Category", "Raw Score", "Max Score", "Norm Score", "Power", "Level", "Note"]
  );

  groupedScores.forEach(({ chapter, scores }) => {
    scores.forEach((score) => {
      rows.push([
        `${chapter.short} - ${chapter.titleTh}`,
        score.labelTh,
        score.raw,
        score.max,
        score.normScore,
        score.percent,
        score.levelLabel,
        score.note
      ]);
    });
  });

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  downloadTextFile(exportFileName(playerName, "csv"), csv, "text/csv;charset=utf-8");
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
  avatarConfig,
  answers,
  profile,
  onRestart,
  onBack
}: {
  playerName: string;
  avatarConfig: AvatarConfig;
  answers: AnswerMap;
  profile: ProfileResult;
  onRestart: () => void;
  onBack: () => void;
}) {
  const sortedStats = [...profile.rpgStats].sort((a, b) => b.value - a.value);
  const selectedJob = getSelectedJob(avatarConfig);
  const groupedScores = chapters.map((chapter) => ({
    chapter,
    scores: profile.categoryScores.filter((score) => score.key && score.label)
      .filter((score) => {
        if (chapter.id === "eq") return ["selfAwareness", "socialAwareness", "selfManagement", "socialSkills"].includes(score.key);
        if (chapter.id === "bigFive") return ["adjustment", "sociability", "openness", "agreeableness", "conscientiousness"].includes(score.key);
        return ["managingSelf", "communication", "diversity", "ethics", "acrossCultures", "teams", "change"].includes(score.key);
      })
  }));

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
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => window.print()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/80 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <Printer size={16} />
            Save as PDF
          </button>
          <button
            onClick={() => downloadScoreCsv(playerName, profile, groupedScores, answers)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#b8cce4] bg-white/80 px-4 text-sm font-black text-[#38516f] transition hover:bg-white"
          >
            <Download size={16} />
            Download CSV
          </button>
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
                  {selectedJob.name}
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
              <AvatarPreview avatarConfig={avatarConfig} className="avatar-float relative z-10 h-full" />
            </div>
          </div>

          <div className="mt-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1 text-sm font-black text-[#2d5f9c]">
              <Medal size={16} />
              {profile.classProfile.title}
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
