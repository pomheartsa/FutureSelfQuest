import { questions } from "@/lib/assessment";
import type { AnswerMap, RpgStat } from "@/lib/scoring";
import {
  engagementQuestions,
  leadershipStyleQuestions,
  type SideAnswerMap,
  type SideQuestId
} from "@/lib/side-assessments";

export const SESSION_STORAGE_KEY = "future-self-quest-session-v2";
export const LEGACY_STORAGE_KEY = "future-self-quest-state-v1";
export const APP_VERSION = "1.6.0";
export const UPDATE_STORAGE_KEY = `future-self-quest-update-${APP_VERSION}`;

export const releaseNotes = [
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

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type BodyType = "female" | "male";
export type Gender = "female" | "male";
export type JobId = "acolyte" | "archer" | "mage" | "merchant" | "sword";
export type AppView =
  | "registration"
  | "hub"
  | "core"
  | "belbin"
  | "leadershipPotential"
  | SideQuestId;

export type AvatarConfig = {
  jobId: JobId;
  bodyType: BodyType;
};

export const defaultAvatarConfig: AvatarConfig = {
  jobId: "sword",
  bodyType: "female"
};

export const jobOptions: Array<{
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

export const resultJobByStat: Record<RpgStat["key"], JobId> = {
  STR: "sword",
  AGI: "merchant",
  VIT: "sword",
  DEX: "archer",
  INT: "mage",
  LUK: "acolyte"
};

export const genderOptions: Array<{ value: Gender; label: string; labelEn: string; symbol: string }> = [
  { value: "male", label: "ชาย", labelEn: "Male", symbol: "♂" },
  { value: "female", label: "หญิง", labelEn: "Female", symbol: "♀" }
];

export function genderLabel(gender: Gender | null) {
  return genderOptions.find((option) => option.value === gender)?.label ?? "ผู้เล่น";
}

export function normalizeAvatarConfig(value?: Partial<AvatarConfig>): AvatarConfig {
  const next = { ...defaultAvatarConfig, ...(value || {}) };
  if (!jobOptions.some((job) => job.id === next.jobId)) {
    next.jobId = defaultAvatarConfig.jobId;
  }
  return { jobId: next.jobId, bodyType: next.bodyType === "male" ? "male" : "female" };
}

export function clampStoredIndex(value: unknown, total: number) {
  if (typeof value !== "number" || !Number.isInteger(value)) return 0;
  return Math.max(0, Math.min(value, total - 1));
}

export function normalizeAppView(value: unknown, legacyStarted?: boolean): AppView {
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

export function sanitizeCoreAnswers(value: unknown): AnswerMap {
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

export function sanitizeSideAnswers(value: unknown, questId: SideQuestId): SideAnswerMap {
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

export function getSelectedJob(avatarConfig: AvatarConfig) {
  return jobOptions.find((job) => job.id === avatarConfig.jobId) ?? jobOptions[0];
}

export function getJobImage(avatarConfig: AvatarConfig) {
  const job = getSelectedJob(avatarConfig);
  return job.variants[avatarConfig.bodyType];
}
