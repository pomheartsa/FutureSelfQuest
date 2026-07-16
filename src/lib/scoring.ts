import { categories, questions, type CategoryKey, type ChapterId } from "./assessment";

export type AnswerMap = Record<string, number>;

export type Level = "low" | "mid" | "high";

export type ScoreReference = {
  kind: "eq-range" | "big-five-norm" | "competency-benchmark";
  label: string;
  low?: number;
  high?: number;
  mean?: number;
};

export type CategoryScore = {
  key: CategoryKey;
  label: string;
  labelTh: string;
  raw: number;
  max: number;
  normScore?: number;
  percent: number;
  exactPercent: number;
  itemCount: number;
  level: Level;
  levelLabel: string;
  note: string;
  reference?: ScoreReference;
};

export type RpgStatKey = "STR" | "AGI" | "VIT" | "INT" | "DEX" | "LUK";

export type RpgStat = {
  key: RpgStatKey;
  label: string;
  labelTh: string;
  value: number;
};

export type ClassProfile = {
  key: RpgStatKey;
  title: string;
  titleTh: string;
  tagline: string;
  description: string;
};

export type ProfileResult = {
  answeredCount: number;
  totalQuestions: number;
  completion: number;
  categoryScores: CategoryScore[];
  rpgStats: RpgStat[];
  classProfile: ClassProfile;
  summary: string;
  strengths: string[];
  growth: string[];
};

export const assessmentMethodology: Record<
  ChapterId,
  { title: string; calculation: string; source: string; note: string }
> = {
  eq: {
    title: "EQ",
    calculation: "รวมคะแนนข้อที่อยู่ในแต่ละด้าน แล้วแสดงคะแนน 0-100 ด้วยสูตร (คะแนนดิบ / คะแนนเต็ม) x 100",
    source: "Emotional Quotient (EQ) questionnaire และช่วงคะแนนรายด้านจากเอกสารประกอบการสอนที่อาจารย์มอบให้",
    note: "ช่วงคะแนนต้นฉบับ: Self-awareness 36-48, Social Awareness 18-24, Self Management 24-32 และ Social Skills 18-24"
  },
  bigFive: {
    title: "Big Five Locator",
    calculation: "รวมคะแนนดิบ 5 ข้อต่อด้าน แปลงเป็น Norm Score ด้วย Score Conversion Sheet แล้วแปลง Norm 20-80 เป็นคะแนน 0-100",
    source: "Big Five Locator Score Conversion Sheet และ Big Five Locator Interpretation Sheet, Chapter 2: Understanding Individual Differences",
    note: "เฉพาะ Adjustment กลับทิศคะแนน 0-100 เพื่อให้คะแนนสูงหมายถึงความมั่นคงทางอารมณ์สูง ทั้งนี้ Norm Score ยังคงแสดงค่าต้นฉบับ"
  },
  competency: {
    title: "Professional Competencies",
    calculation: "รวมคะแนน 10 ข้อของแต่ละสมรรถนะบนมาตร 1-10 ได้คะแนนรายด้าน 10-100 แล้วเทียบกับ Mean และช่วงคะแนนของคนส่วนใหญ่ประมาณ 68%",
    source: "Professional Competencies Plot Graph: competencies rated by experienced managers and managerial professionals",
    note: "ช่วงคนส่วนใหญ่ประมาณ 68% ใช้เปรียบเทียบกับ managerial population ตามเอกสารประกอบการสอน ไม่ใช่คะแนนผ่านหรือตก"
  }
};

const categoryMeta = new Map(categories.map((category) => [category.key, category]));

const categoryNotes: Record<CategoryKey, Record<Level, string>> = {
  selfAwareness: {
    high: "อ่านอารมณ์และแรงขับของตัวเองได้ชัด",
    mid: "รู้ทันตัวเองได้ดีในหลายสถานการณ์",
    low: "ควรเพิ่มเวลาทบทวนอารมณ์และเหตุผลของตัวเอง"
  },
  socialAwareness: {
    high: "จับสัญญาณจากคนรอบตัวได้ไว",
    mid: "เข้าใจผู้อื่นได้ดีเมื่อมีบริบทชัด",
    low: "ควรฝึกอ่านสีหน้า น้ำเสียง และบริบททางสังคม"
  },
  selfManagement: {
    high: "ตั้งหลักและพาตัวเองผ่านแรงกดดันได้ดี",
    mid: "จัดการตัวเองได้ค่อนข้างมั่นคง",
    low: "ควรเสริมระบบช่วยตัดสินใจและจัดการอารมณ์"
  },
  socialSkills: {
    high: "ทำให้คนรอบตัวรู้สึกดีและร่วมมือได้ง่าย",
    mid: "เชื่อมสัมพันธ์กับคนอื่นได้พอเหมาะ",
    low: "ควรฝึกการให้ feedback ชื่นชม และประคองบรรยากาศ"
  },
  adjustment: {
    high: "หนักแน่น ฟื้นตัวไว และรับมือแรงกดดันได้ดี",
    mid: "มีทั้งช่วงนิ่งและช่วงไวต่อแรงกดดัน",
    low: "มีแนวโน้มไวต่อความกังวล ควรมีจังหวะพักและตั้งหลัก"
  },
  sociability: {
    high: "ได้พลังจากผู้คนและสื่อสารออกไปง่าย",
    mid: "เข้าสังคมได้ แต่ยังต้องการพื้นที่ส่วนตัว",
    low: "ชอบทำงานเงียบ ๆ และเลือกวงสนทนาอย่างระมัดระวัง"
  },
  openness: {
    high: "ชอบทดลอง ไอเดียเยอะ และอยู่กับความไม่ชัดเจนได้",
    mid: "เปิดรับสิ่งใหม่เมื่อเห็นเหตุผลที่ดี",
    low: "ชอบความชัดเจนและวิธีที่พิสูจน์แล้ว"
  },
  agreeableness: {
    high: "ร่วมมือ อบอุ่น และให้ความสำคัญกับความสัมพันธ์",
    mid: "ประนีประนอมได้โดยยังรักษาจุดยืน",
    low: "ตรงไปตรงมา ท้าทายเหตุผล และไม่เชื่ออะไรง่าย"
  },
  conscientiousness: {
    high: "มีวินัย ตรงเวลา และชอบทำงานเป็นระบบ",
    mid: "รักษาระบบได้เมื่อเป้าหมายชัด",
    low: "ยืดหยุ่นสูง แต่ควรเพิ่มโครงช่วยติดตามงาน"
  },
  managingSelf: {
    high: "บริหารเวลา เป้าหมาย และ feedback ได้แข็งแรง",
    mid: "ดูแลการทำงานของตัวเองได้ดีในงานส่วนใหญ่",
    low: "ควรเสริมการจัดลำดับงานและการขอความช่วยเหลือ"
  },
  communication: {
    high: "สื่อสาร ฟัง และถ่ายทอดประเด็นได้คม",
    mid: "สื่อสารได้ดีเมื่อมีเวลาเรียบเรียง",
    low: "ควรฝึกจับประเด็น ฟังเชิงลึก และเขียนให้กระชับ"
  },
  diversity: {
    high: "มองความต่างเป็นทรัพยากรของทีม",
    mid: "ร่วมงานกับความแตกต่างได้เมื่อข้อตกลงชัด",
    low: "ควรเปิดพื้นที่ให้มุมมองที่ไม่เหมือนตัวเองมากขึ้น"
  },
  ethics: {
    high: "มีหลักยึด ชัดเจน และรับผิดชอบต่อการตัดสินใจ",
    mid: "รักษามาตรฐานได้ดีในสถานการณ์ทั่วไป",
    low: "ควรทำเกณฑ์ตัดสินใจและขอบเขตความรับผิดชอบให้ชัด"
  },
  acrossCultures: {
    high: "ปรับตัวข้ามวัฒนธรรมและอ่านบริบทกว้างได้ดี",
    mid: "เปิดรับบริบทใหม่เมื่อมีข้อมูลเพียงพอ",
    low: "ควรสะสมประสบการณ์และกรอบคิดข้ามวัฒนธรรมเพิ่ม"
  },
  teams: {
    high: "เติมพลังทีม แบ่งเครดิต และขับเป้าหมายร่วม",
    mid: "ทำงานร่วมกับทีมได้ดีเมื่อบทบาทชัด",
    low: "ควรฝึกการชวนทีมคุย เป้าหมายร่วม และการยอมรับผลงานคนอื่น"
  },
  change: {
    high: "นำการเปลี่ยนแปลงและจัดการแรงต้านได้ดี",
    mid: "ปรับตัวกับการเปลี่ยนแปลงได้เมื่อแผนชัด",
    low: "ควรฝึกแตกการเปลี่ยนแปลงเป็นก้าวเล็ก ๆ และสื่อสารเหตุผล"
  }
};

const classProfiles: Record<RpgStatKey, ClassProfile> = {
  STR: {
    key: "STR",
    title: "Swordman",
    titleTh: "ซอร์ดแมน",
    tagline: "นักดาบแนวหน้าผู้ล็อกเป้าหมาย คุมจังหวะ และพางานไปจนจบ",
    description: "คุณคือซอร์ดแมนผู้บุกทะลวงแนวหน้า เด่นเรื่องวินัย การจัดการตัวเอง และการยืนหยัดกับเป้าหมายจนสำเร็จ ทีมมักมองว่าคุณคือคนที่ไว้ใจได้เมื่อสถานการณ์ต้องการความแน่นอนและแรงขับเคลื่อน"
  },
  AGI: {
    key: "AGI",
    title: "Merchant",
    titleTh: "เมอร์แชนท์",
    tagline: "นักค้าผู้มองเห็นโอกาส ปรับตัวไว และเปลี่ยนทรัพยากรให้เกิดคุณค่า",
    description: "คุณคือเมอร์แชนท์ผู้มองเห็นทางเลือกในทุกสถานการณ์ ปรับตัวได้ดีเมื่อบริบทเปลี่ยน ชอบเรียนรู้สิ่งใหม่ และเชื่อมผู้คนจากมุมมองที่แตกต่าง เหมาะกับภารกิจที่ต้องเจรจา บริหารทรัพยากร และหาโอกาสจากความเปลี่ยนแปลง"
  },
  VIT: {
    key: "VIT",
    title: "Swordman",
    titleTh: "ซอร์ดแมน",
    tagline: "นักดาบผู้ตั้งหลักมั่น รับแรงกดดันได้ และยืนหยัดเพื่อทีม",
    description: "คุณคือซอร์ดแมนสายป้องกันที่มีแกนในแข็งแรง รับผิดชอบต่อการตัดสินใจ และกลับมายืนได้เสมอเมื่อเจอสถานการณ์ยาก เหมาะกับบทบาทที่ต้องรักษามาตรฐานและปกป้องแนวทางของทีม"
  },
  INT: {
    key: "INT",
    title: "Mage",
    titleTh: "เมจ",
    tagline: "จอมเวทผู้อ่านเกมขาด จับแพตเทิร์นไว และเปลี่ยนข้อมูลให้เป็นไอเดีย",
    description: "คุณคือเมจผู้มองเห็นรูปแบบที่คนอื่นอาจมองข้าม เด่นเรื่องการเข้าใจอารมณ์ ความคิด และข้อมูลรอบตัว มักช่วยทีมด้วยภาพรวมและคำถามที่ทำให้ทางเลือกชัดขึ้นก่อนลงมือ"
  },
  DEX: {
    key: "DEX",
    title: "Archer",
    titleTh: "อาร์เชอร์",
    tagline: "พลธนูสายตาคม อ่านสถานการณ์ไว และยิงตรงประเด็น",
    description: "คุณคืออาร์เชอร์ผู้สังเกตรายละเอียดได้แม่นยำ ถนัดจับสัญญาณทางสังคม เข้าใจความแตกต่างของผู้คน และเลือกจังหวะสื่อสารได้เหมาะสม เหมาะกับงานที่ต้องประสานคนหลายแบบให้เดินไปทางเดียวกัน"
  },
  LUK: {
    key: "LUK",
    title: "Acolyte",
    titleTh: "อะโคไลท์",
    tagline: "ผู้เติมพลังให้ปาร์ตี้ เชื่อมผู้คน และทำให้ทุกคนพร้อมไปต่อ",
    description: "คุณคืออะโคไลท์ผู้สร้างพลังร่วม แบ่งปันเครดิต และช่วยให้คนรอบตัวรู้สึกได้รับการสนับสนุน เหมาะกับบทบาทที่ต้องดูแลบรรยากาศ เชื่อมความสัมพันธ์ และพาทีมรักษาแรงใจไปจนถึงเป้าหมาย"
  }
};

const bigFiveNormScores: Partial<Record<CategoryKey, Record<number, number>>> = {
  adjustment: {
    7: 21,
    8: 25,
    9: 29,
    10: 33,
    11: 36,
    12: 40,
    13: 44,
    14: 48,
    15: 51,
    16: 55,
    17: 59,
    18: 62,
    19: 66,
    20: 70,
    21: 73,
    22: 77
  },
  sociability: {
    5: 21,
    6: 26,
    7: 28,
    8: 30,
    9: 33,
    10: 35,
    11: 37,
    12: 40,
    13: 43,
    14: 46,
    15: 48,
    16: 50,
    17: 52,
    18: 55,
    19: 57,
    20: 60,
    21: 62,
    22: 65,
    23: 67,
    24: 70,
    25: 72
  },
  openness: {
    5: 23,
    6: 25,
    7: 28,
    8: 31,
    9: 34,
    10: 37,
    11: 40,
    12: 42,
    13: 45,
    14: 47,
    15: 50,
    16: 54,
    17: 56,
    18: 59,
    19: 62,
    20: 64,
    21: 67,
    22: 70,
    23: 73,
    24: 76,
    25: 79
  },
  agreeableness: {
    8: 20,
    9: 24,
    10: 27,
    11: 29,
    12: 32,
    13: 35,
    14: 38,
    15: 41,
    16: 44,
    17: 47,
    18: 50,
    19: 54,
    20: 55,
    21: 59,
    22: 62,
    23: 65,
    24: 68,
    25: 71
  },
  conscientiousness: {
    6: 24,
    7: 26,
    8: 28,
    9: 30,
    10: 33,
    11: 35,
    12: 38,
    13: 41,
    14: 44,
    15: 46,
    16: 48,
    17: 50,
    18: 52,
    19: 55,
    20: 59,
    21: 61,
    22: 63,
    23: 65,
    24: 67,
    25: 69
  }
};

const eqReferenceRanges: Partial<Record<CategoryKey, { low: number; high: number }>> = {
  selfAwareness: { low: 36, high: 48 },
  socialAwareness: { low: 18, high: 24 },
  selfManagement: { low: 24, high: 32 },
  socialSkills: { low: 18, high: 24 }
};

const competencyBenchmarks: Partial<
  Record<CategoryKey, { mean: number; low: number; high: number }>
> = {
  managingSelf: { mean: 78, low: 69, high: 87 },
  communication: { mean: 75, low: 66, high: 84 },
  diversity: { mean: 75, low: 63, high: 87 },
  ethics: { mean: 84, low: 75, high: 93 },
  acrossCultures: { mean: 72, low: 58, high: 86 },
  teams: { mean: 77, low: 65, high: 89 },
  change: { mean: 69, low: 52, high: 83 }
};

const bigFiveInterpretations: Partial<
  Record<CategoryKey, { low: string; mid: string; high: string }>
> = {
  adjustment: {
    low: "Resilient - ฟื้นตัวและตั้งหลักได้ดี",
    mid: "Responsive - ตอบสนองตามสถานการณ์",
    high: "Reactive - ไวต่อแรงกระตุ้น"
  },
  sociability: {
    low: "Introvert - ชอบพื้นที่ส่วนตัว",
    mid: "Ambivert - สมดุลระหว่างสังคมกับพื้นที่ส่วนตัว",
    high: "Extrovert - ได้พลังจากการเข้าสังคม"
  },
  openness: {
    low: "Preserver - ชอบแนวทางที่คุ้นเคย",
    mid: "Moderate - เปิดรับอย่างพอดี",
    high: "Explorer - ชอบสำรวจสิ่งใหม่"
  },
  agreeableness: {
    low: "Challenger - ตั้งคำถามและรักษาจุดยืน",
    mid: "Negotiator - ประนีประนอมอย่างสมดุล",
    high: "Adapter - ร่วมมือและปรับตัวกับผู้อื่น"
  },
  conscientiousness: {
    low: "Flexible - ยืดหยุ่นและเป็นธรรมชาติ",
    mid: "Balanced - สมดุลระหว่างระบบกับความยืดหยุ่น",
    high: "Focused - มีระบบและมุ่งเป้าหมาย"
  }
};

const statLabels: Record<RpgStatKey, Pick<RpgStat, "label" | "labelTh">> = {
  STR: { label: "Resolve", labelTh: "แรงขับเคลื่อน" },
  AGI: { label: "Adaptability", labelTh: "ความยืดหยุ่น" },
  VIT: { label: "Resilience", labelTh: "ความทนทานใจ" },
  INT: { label: "Insight", labelTh: "การอ่านเกม" },
  DEX: { label: "Tact", labelTh: "การประสานคน" },
  LUK: { label: "Influence", labelTh: "พลังร่วม" }
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function levelFromPercent(percent: number): Level {
  if (percent >= 75) return "high";
  if (percent >= 45) return "mid";
  return "low";
}

function levelLabel(level: Level) {
  if (level === "high") return "พลังเด่น";
  if (level === "mid") return "สมดุล";
  return "ยังชาร์จได้อีก";
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function normScoreFor(key: CategoryKey, raw: number) {
  const lookup = bigFiveNormScores[key];
  if (!lookup) return undefined;

  if (lookup[raw] !== undefined) return lookup[raw];

  const rawScores = Object.keys(lookup).map(Number).sort((a, b) => a - b);
  const clampedRaw = Math.min(rawScores[rawScores.length - 1], Math.max(rawScores[0], raw));
  return lookup[clampedRaw];
}

type NormBand = "low" | "mid" | "high";

function normBand(normScore: number): NormBand {
  if (normScore < 45) return "low";
  if (normScore < 55) return "mid";
  return "high";
}

function referenceFor(
  chapterId: ChapterId,
  key: CategoryKey,
  raw: number,
  normScore?: number
): ScoreReference | undefined {
  if (chapterId === "eq") {
    const range = eqReferenceRanges[key];
    if (!range) return undefined;
    return {
      kind: "eq-range",
      ...range,
      label: raw >= range.low ? "อยู่ในช่วงคะแนนต้นฉบับ" : "ต่ำกว่าช่วงคะแนนต้นฉบับ"
    };
  }

  if (chapterId === "bigFive" && normScore !== undefined) {
    const interpretations = bigFiveInterpretations[key];
    if (!interpretations) return undefined;
    return {
      kind: "big-five-norm",
      label: interpretations[normBand(normScore)]
    };
  }

  if (chapterId === "competency") {
    const benchmark = competencyBenchmarks[key];
    if (!benchmark) return undefined;
    const label =
      raw < benchmark.low
        ? "อยู่ในกลุ่มคนส่วนน้อย (คะแนนต่ำกว่าช่วงของคนส่วนใหญ่)"
        : raw > benchmark.high
          ? "อยู่ในกลุ่มคนส่วนน้อย (คะแนนสูงกว่าช่วงของคนส่วนใหญ่)"
          : "อยู่ในกลุ่มคนส่วนใหญ่";
    return {
      kind: "competency-benchmark",
      ...benchmark,
      label
    };
  }

  return undefined;
}

function levelForCategory(
  chapterId: ChapterId,
  key: CategoryKey,
  raw: number,
  percent: number,
  normScore?: number
): Level {
  if (chapterId === "bigFive" && normScore !== undefined) {
    const band = normBand(normScore);
    if (key === "adjustment") {
      return band === "low" ? "high" : band === "high" ? "low" : "mid";
    }
    return band;
  }

  if (chapterId === "competency") {
    const benchmark = competencyBenchmarks[key];
    if (benchmark) {
      if (raw < benchmark.low) return "low";
      if (raw > benchmark.high) return "high";
      return "mid";
    }
  }

  if (chapterId === "eq") {
    const range = eqReferenceRanges[key];
    if (range && raw >= range.low) return "high";
  }

  return levelFromPercent(percent);
}

function scoreCategories(answers: AnswerMap): CategoryScore[] {
  return categories.map((meta) => {
    const items = questions.filter((question) => question.category === meta.key);
    const raw = items.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0);
    const max = items.length * meta.maxPerItem;
    const min = meta.chapterId === "bigFive" ? items.length : 0;
    const span = max - min || 1;
    const normScore = meta.chapterId === "bigFive" ? normScoreFor(meta.key, raw) : undefined;
    let percent =
      normScore === undefined ? ((raw - min) / span) * 100 : ((normScore - 20) / 60) * 100;

    if (meta.key === "adjustment") {
      percent = 100 - percent;
    }

    const exactPercent = clamp(percent);
    const safePercent = Math.round(exactPercent);
    const reference = referenceFor(meta.chapterId, meta.key, raw, normScore);
    const level = levelForCategory(meta.chapterId, meta.key, raw, safePercent, normScore);

    return {
      key: meta.key,
      label: meta.label,
      labelTh: meta.labelTh,
      raw,
      max,
      normScore,
      percent: safePercent,
      exactPercent,
      itemCount: items.length,
      level,
      levelLabel: reference?.label ?? levelLabel(level),
      note: categoryNotes[meta.key][level],
      reference
    };
  });
}

function getPercent(scoreByKey: Map<CategoryKey, CategoryScore>, key: CategoryKey) {
  return scoreByKey.get(key)?.exactPercent ?? 0;
}

type CalculatedRpgStat = RpgStat & { exactValue: number };

const careerStatKeys: RpgStatKey[] = ["STR", "AGI", "INT", "DEX", "LUK"];

function buildRpgStats(scoreByKey: Map<CategoryKey, CategoryScore>): CalculatedRpgStat[] {
  const stats: Array<[RpgStatKey, CategoryKey[]]> = [
    ["STR", ["managingSelf", "selfManagement", "conscientiousness"]],
    ["AGI", ["openness", "change", "acrossCultures"]],
    ["VIT", ["adjustment", "ethics", "selfManagement"]],
    ["INT", ["selfAwareness", "communication", "openness"]],
    ["DEX", ["socialAwareness", "diversity", "agreeableness"]],
    ["LUK", ["socialSkills", "sociability", "teams"]]
  ];

  return stats.map(([key, sourceKeys]) => {
    const exactValue = average(sourceKeys.map((sourceKey) => getPercent(scoreByKey, sourceKey)));

    return {
      key,
      ...statLabels[key],
      value: Math.round(exactValue),
      exactValue
    };
  });
}

function buildSummary(scores: CategoryScore[], rpgStats: RpgStat[]) {
  const top = [...scores].sort((a, b) => b.percent - a.percent).slice(0, 4);
  const lower = [...scores].sort((a, b) => a.percent - b.percent).slice(0, 3);
  const topStats = [...rpgStats].sort((a, b) => b.value - a.value).slice(0, 2);

  const summary = `ภาพรวมคือคนที่เด่นด้าน${topStats.map((stat) => stat.labelTh).join("และ")} โดยมีฐานสำคัญจาก${top.map((score) => score.labelTh).join(", ")}.`;

  return {
    summary,
    strengths: top.map((score) => `${score.labelTh}: ${score.note}`),
    growth: lower.map((score) => `${score.labelTh}: ${score.note}`)
  };
}

export function calculateProfile(answers: AnswerMap): ProfileResult {
  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const categoryScores = scoreCategories(answers);
  const scoreByKey = new Map(categoryScores.map((score) => [score.key, score]));
  const rpgStats = buildRpgStats(scoreByKey);
  const dominantStat = rpgStats
    .filter((stat) => careerStatKeys.includes(stat.key))
    .sort((a, b) => b.exactValue - a.exactValue)[0] ?? rpgStats[0];
  const classProfile = classProfiles[dominantStat.key];
  const { summary, strengths, growth } = buildSummary(categoryScores, rpgStats);

  return {
    answeredCount,
    totalQuestions: questions.length,
    completion: Math.round((answeredCount / questions.length) * 100),
    categoryScores,
    rpgStats,
    classProfile,
    summary,
    strengths,
    growth
  };
}

export function getCategoryLabel(key: CategoryKey) {
  const meta = categoryMeta.get(key);
  return meta?.labelTh ?? key;
}
