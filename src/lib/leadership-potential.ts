export const leadershipPotentialCodes = ["A", "B", "C", "D"] as const;

export type LeadershipPotentialCode = (typeof leadershipPotentialCodes)[number];
export type LeadershipPotentialAnswers = Record<number, LeadershipPotentialCode>;

export type LeadershipPotentialOption = {
  code: LeadershipPotentialCode;
  label: string;
};

export type LeadershipPotentialProfile = {
  code: LeadershipPotentialCode;
  colorName: string;
  color: string;
  title: string;
  summary: string;
  description: string;
  watchOut: string;
};

export type LeadershipPotentialResult = {
  counts: Record<LeadershipPotentialCode, number>;
  maxCount: number;
  leaders: LeadershipPotentialProfile[];
  hasTie: boolean;
};

export const leadershipPotentialQuestions: Array<{
  id: number;
  prompt: string;
  options: LeadershipPotentialOption[];
}> = [
  {
    id: 1,
    prompt: "สถานภาพมีความสำคัญกับคุณอย่างไร?",
    options: [
      { code: "A", label: "สำคัญมาก คุณชอบที่จะรู้สึกว่าตนเองอยู่ในลำดับสูงสุดของสังคม" },
      { code: "B", label: "ค่อนข้างสำคัญ คุณรู้สึกดีที่ได้อยู่ท่ามกลางฝูงชน" },
      { code: "C", label: "เป็นเรื่องคุณภาพของความสัมพันธ์มากกว่า ว่าคุณอยู่ตรงไหนของความสัมพันธ์นั้น" },
      { code: "D", label: "ไม่สำคัญเลย คุณแค่ต้องการความก้าวหน้าและประสบความสำเร็จ" }
    ]
  },
  {
    id: 2,
    prompt: "ในวัยเด็กคุณอยู่ลำดับไหนของกลุ่มเพื่อน?",
    options: [
      { code: "A", label: "ผู้นำกลุ่มที่ทุกคนต่างก็กลัวเกรง" },
      { code: "B", label: "ผู้มีความสนุกสนาน เป็นที่ชื่นชอบของทุกคน" },
      { code: "C", label: "นักคิดที่ทุกคนรับฟัง" },
      { code: "D", label: "เงียบขรึม ไม่มีใครสังเกตเห็นเลย" }
    ]
  },
  {
    id: 3,
    prompt: "เมื่ออยู่ที่สำนักงาน คุณเป็นคนที่เสนอแนวคิดหรือคำแนะนำใหม่ ๆ หรือไม่?",
    options: [
      { code: "A", label: "ตลอดเวลา คุณต้องการให้ทุกคนรู้ว่าคุณคิดอย่างไร" },
      { code: "B", label: "ค่อนข้างบ่อย แต่ไม่ได้ตลอดเวลา เพราะอาจทำให้ใครบางคนไม่พอใจ" },
      { code: "C", label: "บ่อยครั้ง แต่ระมัดระวังในบางประเด็น โดยเฉพาะเรื่องความเป็นส่วนตัวและการเมือง" },
      { code: "D", label: "นาน ๆ ครั้ง เนื่องจากหากสิ่งนั้นเป็นสิ่งผิด จะไม่ยอมเด็ดขาด" }
    ]
  },
  {
    id: 4,
    prompt: "หากเพื่อนร่วมงานโดนตำหนิเรื่องรายงานที่ไม่เรียบร้อยและไม่มีคุณภาพ คุณจะทำอย่างไร?",
    options: [
      { code: "A", label: "บอกพวกเขาในสิ่งที่พวกเขาควรจะรู้มากขึ้น" },
      { code: "B", label: "พาพวกเขาออกไปสังสรรค์หลังเลิกงาน" },
      { code: "C", label: "เสนอตัวช่วยตรวจรายงานให้ในครั้งต่อไป" },
      { code: "D", label: "หลีกเลี่ยงไม่เจอพวกเขา เพราะคุณมีสิ่งที่ต้องทำมากอยู่แล้ว" }
    ]
  },
  {
    id: 5,
    prompt: "คุณได้รับ Feedback ที่ไม่ดีกลับมา คุณจะตอบสนองอย่างไร?",
    options: [
      { code: "A", label: "รู้สึกโกรธและปกป้องตัวเอง" },
      { code: "B", label: "รับฟังอย่างตั้งใจ แต่มีความรู้สึกผิดหวัง" },
      { code: "C", label: "พิจารณาสิ่งที่ต้องเปลี่ยนแปลง และหาวิธีใหม่เพื่อปรับปรุง" },
      { code: "D", label: "ถอนหายใจแล้วคิดว่า หัวหน้าก็เป็นแบบนี้แหละ" }
    ]
  },
  {
    id: 6,
    prompt: "อีคิว หรือความฉลาดทางอารมณ์ มีความหมายอย่างไรกับตัวคุณ?",
    options: [
      { code: "A", label: "ไม่มี เพราะเป็นเพียงความนิยมในการบริหารจัดการและจะหายไปเมื่อไม่ได้รับความนิยม" },
      { code: "B", label: "จะถือเป็นความผิด หากมีการอนุญาตให้หัวเราะได้ในเวลาทำงาน" },
      { code: "C", label: "เป็นความใส่ใจถึงความรู้สึกของเพื่อนร่วมงาน" },
      { code: "D", label: "เป็นสิ่งที่คุณพยายามจะเข้าใจในอารมณ์ของเจ้านาย" }
    ]
  },
  {
    id: 7,
    prompt: "เมื่อเผชิญหน้ากับปัญหาที่ต้องได้รับการแก้ไข คุณจะทำอย่างไร?",
    options: [
      { code: "A", label: "เสนอวิธีแก้ไขวิธีเดียว และบอกว่าเป็นวิธีที่ถูกต้องแล้ว" },
      { code: "B", label: "เสนอวิธีแก้ไขที่มีความเป็นไปได้ และขอให้คนอื่นแสดงความคิดเห็น" },
      { code: "C", label: "ระดมสมองกับเพื่อนร่วมงาน" },
      { code: "D", label: "ขอคำแนะนำจากผู้จัดการหรือหัวหน้า" }
    ]
  },
  {
    id: 8,
    prompt: "หากเจ้านายขอให้คุณทำบางสิ่งที่เกินความสามารถของคุณ คุณจะทำอย่างไร?",
    options: [
      { code: "A", label: "รับมาด้วยความเต็มใจ เพราะคุณสามารถทำได้ทุกอย่าง" },
      { code: "B", label: "ทำอย่างเต็มความสามารถ และไม่ตำหนิตัวเองหากเกิดผิดพลาด" },
      { code: "C", label: "รับมา แต่ถามถึงวิธีการและความช่วยเหลือจากคนที่มีความรู้หรือประสบการณ์" },
      { code: "D", label: "รับมาและทำเงียบ ๆ สุดท้ายจึงสารภาพว่าไม่คิดว่าจะสามารถจัดการได้" }
    ]
  },
  {
    id: 9,
    prompt: "การกระจายอำนาจหรือการแบ่งงานกันทำคืออะไร?",
    options: [
      { code: "A", label: "การเสียเวลา ไม่มีใครทำได้ดีเท่าคุณ ดังนั้นคุณต้องทำด้วยตัวเอง" },
      { code: "B", label: "เป็นวิธีที่ง่ายในการแบ่งภาระงาน" },
      { code: "C", label: "เป็นวิธีที่มีประสิทธิภาพในการสร้างโอกาสเรียนรู้ใหม่ให้ผู้อื่น" },
      { code: "D", label: "เป็นบางสิ่งที่คุณต้องรับเป็นคนสุดท้ายเสมอ" }
    ]
  },
  {
    id: 10,
    prompt: "การเปลี่ยนแปลงมีความหมายอะไรกับคุณ?",
    options: [
      { code: "A", label: "บางสิ่งบางอย่างที่สามารถควบคุมได้" },
      { code: "B", label: "เป็นโอกาสที่ทุกสิ่งทุกอย่างสามารถเกิดขึ้นได้" },
      { code: "C", label: "เป็นโอกาสในการสร้างความก้าวหน้า" },
      { code: "D", label: "บางสิ่งบางอย่างที่จะต้องรับมือกับมัน" }
    ]
  }
];

export const leadershipPotentialProfiles: LeadershipPotentialProfile[] = [
  {
    code: "A",
    colorName: "สีเหลือง",
    color: "#d7a51e",
    title: "ผู้นำโดยกำเนิด",
    summary: "แข็งแกร่ง กล้าตัดสินใจ และพร้อมรับบทบาทนำเมื่อพบงานที่เหมาะสม",
    description: "คุณมีความเป็นผู้นำโดยกำเนิด มีความแข็งแกร่ง กล้าตัดสินใจ และเป็นนักปกครองที่ดี คนรอบตัวมีแนวโน้มให้ความเคารพนับถือคุณ",
    watchOut: "ระวังความเย่อหยิ่ง ความมุทะลุ และการบริหารแบบเอกาธิปไตย ควรเปิดโอกาสให้คนรอบตัวที่มีความรู้ความสามารถ"
  },
  {
    code: "B",
    colorName: "สีชมพู",
    color: "#cf6a9f",
    title: "ผู้นำผู้สนับสนุน",
    summary: "มีศักยภาพด้านการนำ รับฟัง สนับสนุน และอยู่เคียงข้างคนรอบตัว",
    description: "คุณมีศักยภาพที่ดีในการเป็นผู้นำ เป็นคนมีความคิดริเริ่มสร้างสรรค์ สนับสนุนและรับฟังคนรอบข้าง พร้อมอยู่เคียงข้างทีม",
    watchOut: "อย่าเอาชนะข้อผิดพลาดเพียงเพื่อให้เป็นที่ชื่นชอบ ควรกล้าเผชิญความขัดแย้งด้วยความจริงใจและซื่อสัตย์"
  },
  {
    code: "C",
    colorName: "สีฟ้าอมเขียว",
    color: "#35b8c2",
    title: "นักบริหารจัดการ",
    summary: "สร้างสรรค์ เด็ดขาด ใส่ใจ และช่วยรวมคนให้ทำงานไปด้วยกัน",
    description: "คุณเป็นนักบริหารจัดการที่มีความคิดสร้างสรรค์ เด็ดขาด และใส่ใจ สามารถรวมกลุ่มและช่วยให้ผู้อื่นค้นพบศักยภาพของตนเอง",
    watchOut: "คุณคาดหวังกับผู้อื่นค่อนข้างสูง จึงควรสื่อสารความคาดหวังให้ชัดและเหมาะกับความพร้อมของแต่ละคน"
  },
  {
    code: "D",
    colorName: "สีฟ้า",
    color: "#4f9bc4",
    title: "สมาชิกทีมที่น่าเชื่อถือ",
    summary: "ถนัดรับฟัง ลงมือทำ และเป็นกำลังสำคัญที่หนักแน่นให้กับทีม",
    description: "คุณรู้ว่าตนเองเหมาะกับการเป็นสมาชิกในทีมมากกว่าหัวหน้าทีม ชอบฟังแนวคิดมากกว่าการสั่ง และชอบลงมือทำมากกว่าตัดสินใจ",
    watchOut: "คุณเป็นสมาชิกทีมที่หนักแน่น น่าเชื่อถือ และซื่อสัตย์ พร้อมพัฒนาความกล้าเพื่อทำสิ่งที่ตนเองต้องการมากขึ้น"
  }
];

export function sanitizeLeadershipPotentialAnswers(
  value: unknown
): LeadershipPotentialAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const validIds = new Set(leadershipPotentialQuestions.map((question) => question.id));
  const answers: LeadershipPotentialAnswers = {};

  Object.entries(source).forEach(([idText, answer]) => {
    const id = Number(idText);
    if (
      Number.isInteger(id) &&
      validIds.has(id) &&
      typeof answer === "string" &&
      leadershipPotentialCodes.includes(answer as LeadershipPotentialCode)
    ) {
      answers[id] = answer as LeadershipPotentialCode;
    }
  });

  return answers;
}

export function calculateLeadershipPotentialResult(
  answers: LeadershipPotentialAnswers
): LeadershipPotentialResult | null {
  const complete = leadershipPotentialQuestions.every((question) =>
    leadershipPotentialCodes.includes(answers[question.id])
  );
  if (!complete) return null;

  const counts = Object.fromEntries(
    leadershipPotentialCodes.map((code) => [code, 0])
  ) as Record<LeadershipPotentialCode, number>;

  leadershipPotentialQuestions.forEach((question) => {
    counts[answers[question.id]] += 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const leaders = leadershipPotentialProfiles.filter(
    (profile) => counts[profile.code] === maxCount
  );

  return {
    counts,
    maxCount,
    leaders,
    hasTie: leaders.length > 1
  };
}
