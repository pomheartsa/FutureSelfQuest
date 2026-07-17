"use client";

import {
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ClipboardList,
  Download,
  Medal,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import {
  cx,
  genderLabel,
  resultJobByStat,
  type AvatarConfig,
  type Gender
} from "@/lib/app-core";
import { chapters, type ChapterId } from "@/lib/assessment";
import {
  assessmentMethodology,
  type AnswerMap,
  type CategoryScore,
  type ProfileResult,
  type RpgStat
} from "@/lib/scoring";
import { exportPartWorkbook } from "@/lib/export-excel";
import { AvatarPreview } from "@/components/avatar-preview";

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

export function ResultScreen({
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
