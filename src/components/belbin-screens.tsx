"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Workflow
} from "lucide-react";
import { cx, genderLabel, type Gender } from "@/lib/app-core";
import {
  belbinSections,
  countCompletedBelbinSections,
  isBelbinSectionComplete,
  type BelbinAnswers,
  type BelbinResult,
  type BelbinSectionId,
  type BelbinSectionScores
} from "@/lib/belbin-assessment";
import { RestartQuestButton } from "@/components/restart-quest-button";

function distributeBelbinScores(itemIds: number[]): BelbinSectionScores {
  if (itemIds.length === 0) return {};
  const base = Math.floor(10 / itemIds.length);
  const remainder = 10 % itemIds.length;

  return Object.fromEntries(
    itemIds.map((itemId, index) => [itemId, base + (index < remainder ? 1 : 0)])
  );
}

export function BelbinAssessmentScreen({
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

export function BelbinResultScreen({
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
