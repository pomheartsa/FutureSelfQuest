"use client";

import {
  ChevronRight,
  ClipboardList,
  Crown,
  HeartHandshake,
  RotateCcw,
  ShieldCheck,
  UsersRound,
  Workflow
} from "lucide-react";
import { useEffect, useState } from "react";
import { cx, genderLabel, type Gender } from "@/lib/app-core";
import { questions } from "@/lib/assessment";
import { belbinSections } from "@/lib/belbin-assessment";
import { leadershipPotentialQuestions } from "@/lib/leadership-potential";
import {
  engagementQuestions,
  leadershipStyleQuestions,
  type SideQuestId
} from "@/lib/side-assessments";

export function QuestHubScreen({
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
