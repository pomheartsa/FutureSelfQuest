export const belbinSectionIds = ["A", "B", "C", "D", "E", "F", "G"] as const;

export type BelbinSectionId = (typeof belbinSectionIds)[number];

export const belbinRoleIds = ["SH", "CO", "PL", "RI", "ME", "IM", "TW", "CF"] as const;

export type BelbinRoleId = (typeof belbinRoleIds)[number];
export type BelbinSectionScores = Record<number, number>;
export type BelbinAnswers = Partial<Record<BelbinSectionId, BelbinSectionScores>>;

export type BelbinRole = {
  id: BelbinRoleId;
  titleTh: string;
  titleEn: string;
  summary: string;
  description: string;
};

export type BelbinRoleScore = BelbinRole & {
  score: number;
  rank: number;
};

export type BelbinResult = {
  scores: Record<BelbinRoleId, number>;
  rankedRoles: BelbinRoleScore[];
  featuredRoles: BelbinRoleScore[];
  hasCutoffTie: boolean;
};

export const belbinSections: Array<{
  id: BelbinSectionId;
  title: string;
  items: string[];
}> = [
  {
    id: "A",
    title: "เมื่อท่านมีส่วนร่วมในโครงการ",
    items: [
      "ท่านได้รับความไว้วางใจให้ทำงานที่ต้องจัดระบบระเบียบและทำตามลำดับขั้นตอน",
      "ท่านมองเห็นข้อบกพร่องของงานที่คนอื่นมักมองข้ามหรือไม่ได้สังเกตเห็นเหมือนท่าน",
      "ท่านแสดงให้ที่ประชุมทราบหากการประชุมเริ่มหลงประเด็น",
      "ท่านเสนอแนะความคิดเห็นที่จุดประกายเริ่มต้น",
      "ท่านวิเคราะห์ความคิดเห็นของผู้อื่นอย่างมีหลักการ มีความเที่ยงตรง ทั้งข้อดีและข้อด้อยของความคิดนั้น ๆ",
      "ท่านมักจะมองหาข้อสรุปล่าสุดและนำไปพัฒนาต่อยอด",
      "ท่านมีทักษะในการบริหารจัดการคนในทีม",
      "ท่านมักสนับสนุนข้อคิดเห็นที่ดีที่ช่วยแก้ปัญหาต่าง ๆ"
    ]
  },
  {
    id: "B",
    title: "ความพึงพอใจในผลงานของท่าน",
    items: [
      "ท่านมักจะมีอิทธิพลต่อการตัดสินใจมาก",
      "ท่านสามารถตัดสินใจได้ว่างานใดที่ต้องการความใส่ใจจดจ่อเป็นพิเศษ",
      "ท่านมักกังวลและตั้งใจที่จะช่วยเพื่อนร่วมงานในการแก้ปัญหาของเขา",
      "ท่านชอบตัดสินใจเลือกทางออกของปัญหาวิกฤต",
      "ท่านมักจะมีวิธีแก้ปัญหาต่าง ๆ อย่างสร้างสรรค์",
      "ท่านมีวิธีในการประนีประนอมความคิดเห็นที่แตกต่างหลากหลาย",
      "ท่านสนับสนุนสิ่งที่สามารถนำไปใช้งานได้จริงมากกว่าความคิดใหม่ ๆ",
      "ท่านมักแสวงหาความคิดและเทคนิคที่แตกต่าง"
    ]
  },
  {
    id: "C",
    title: "เมื่อทีมกำลังแก้ปัญหาที่ยุ่งยากซับซ้อน",
    items: [
      "ท่านเฝ้าดูและค้นหาว่าต้นเหตุของปัญหาอยู่ที่ใด",
      "ท่านแสวงหาความคิดใหม่ที่อาจมีความเหมาะสมมากกว่าเพื่อนำไปใช้กับงานในปัจจุบัน",
      "ท่านมักไตร่ตรองใคร่ครวญทุกข้อเสนอแนะอย่างรอบคอบก่อนตัดสินใจเลือก",
      "ท่านสามารถประสานงานและดึงความสามารถรวมทั้งศักยภาพของผู้อื่นมาใช้ให้เกิดประโยชน์",
      "ท่านปฏิบัติงานเป็นระบบแบบแผนอย่างสม่ำเสมอแม้ว่าจะมีความกดดันต่อท่าน",
      "ท่านพัฒนาวิธีการใหม่ ๆ ในการจัดการแก้ไขปัญหาที่ยืดเยื้อเรื้อรัง",
      "ท่านพร้อมที่จะนำเสนอความคิดของท่าน และทำให้มีผลในทางปฏิบัติได้ในกรณีที่จำเป็น",
      "ท่านพร้อมเสมอที่จะให้ความช่วยเหลือทุกครั้งที่ท่านสามารถทำได้"
    ]
  },
  {
    id: "D",
    title: "การปฏิบัติงานประจำวัน",
    items: [
      "ท่านมีความชัดเจนเกี่ยวกับการทำงานและวัตถุประสงค์ของงาน",
      "ท่านมักไม่กล้าแสดงความคิดเห็นของท่านต่อที่ประชุม",
      "ท่านสามารถร่วมงานกับคนทุกประเภทที่มีความหลากหลายได้",
      "ท่านพยายามติดตามความคิด และ/หรือ คนที่น่าสนใจ",
      "ท่านมักโต้แย้งข้อเสนอที่ไม่สมเหตุสมผล",
      "ท่านมักเห็นแบบแผนความเป็นไปได้ในขณะที่ผู้อื่นมองข้าม",
      "ภาระงานที่ยุ่งเสมอทำให้ท่านมีความพึงพอใจอย่างมาก",
      "ท่านมีความสนใจที่จะรู้จักผู้อื่นให้มากขึ้น"
    ]
  },
  {
    id: "E",
    title: "เมื่อท่านได้รับมอบหมายให้ทำงานที่ยาก มีข้อจำกัดด้านเวลาและทีมงานที่ไม่คุ้นเคย",
    items: [
      "ท่านรู้สึกความคิดไม่โลดแล่นเมื่อทำงานในกลุ่ม",
      "ท่านค้นพบทักษะเฉพาะตัว โดยเฉพาะมีวิธีการที่เหมาะสมในการบรรลุข้อตกลงของกลุ่ม",
      "ความรู้สึกของท่านมักขัดแย้งกับความคิดของตัวเองบ่อย ๆ",
      "ท่านพยายามต่อสู้เพื่อให้โครงสร้างของกลุ่มมีประสิทธิผล",
      "ท่านสามารถทำงานกับคนที่มีคุณสมบัติและรูปลักษณ์ที่แตกต่างกันได้",
      "ท่านรู้สึกว่าบางครั้งการทำตัวเงียบ ๆ ในกลุ่มก็มีคุณค่า เมื่อท่านต้องการเสนอความคิดเห็นให้เป็นที่ยอมรับในกลุ่ม",
      "ท่านรู้ว่าใครมีความรู้ และมีความสามารถพิเศษที่เหมาะกับงานในกลุ่ม",
      "ท่านรู้ว่าเมื่อใดที่ควรจะเร่งรีบทำงานให้เสร็จทันเวลา"
    ]
  },
  {
    id: "F",
    title: "เมื่อท่านได้รับข้อเสนออย่างฉับพลันเพื่อให้ทำโครงการใหม่",
    items: [
      "ท่านมองหาช่องทางของความคิดและโอกาสที่เป็นไปได้",
      "ท่านกังวลว่าจะทำงานได้ทันและเสร็จสมบูรณ์หรือไม่ ก่อนที่จะเริ่มทำงาน",
      "ท่านวิเคราะห์ถึงปัญหาอย่างถี่ถ้วน รอบคอบ",
      "ท่านมีความสามารถในการดึงคนอื่น ๆ มาร่วมงานกับท่านได้ถ้าจำเป็น",
      "ท่านสามารถวิเคราะห์แทบทุกสถานการณ์ได้ด้วยความคิดที่มีอิสระ เป็นตัวของตัวเอง และมีนวัตกรรมใหม่ ๆ",
      "ท่านสามารถนำทีมได้หากจำเป็น",
      "ท่านสามารถโต้ตอบเชิงบวกต่อความคิดเห็นของเพื่อนร่วมงานและการเริ่มต้นโครงการของพวกเขา",
      "ท่านพบว่าเป็นเรื่องยากในการทำงาน หากเป้าหมายของงานไม่มีความชัดเจน"
    ]
  },
  {
    id: "G",
    title: "ลักษณะทั่วไปเมื่อท่านมีส่วนร่วมในโครงการกลุ่ม",
    items: [
      "ท่านมีความสามารถในการสรุปขั้นตอนการทำงานได้ชัดเจนเป็นรูปธรรมก่อนนำไปปฏิบัติจริง",
      "ท่านมักใช้เวลาในการคิดไตร่ตรองนาน แต่ความคิดรวบยอดของท่านมักตรงประเด็นเสมอ",
      "เครือข่ายที่กว้างขวางของท่านมีส่วนสำคัญต่อรูปแบบการทำงานของท่าน",
      "ท่านสามารถเห็นรายละเอียดต่าง ๆ ที่ถูกต้องของงาน",
      "ท่านพยายามเสนอประเด็นต่อที่ประชุม",
      "ท่านสามารถนำความคิดและเทคนิคใหม่ ๆ มาใช้ในการสร้างสัมพันธภาพใหม่กับเพื่อนร่วมงาน",
      "ท่านมองปัญหาได้ทะลุปรุโปร่งทั้งสองด้าน และทำให้การตัดสินใจเป็นที่ยอมรับเป็นเอกฉันท์",
      "ท่านสามารถร่วมงานกับผู้อื่นได้ดีและทุ่มเททำงานเต็มที่เพื่อกลุ่ม"
    ]
  }
];

export const belbinRoles: BelbinRole[] = [
  {
    id: "SH",
    titleTh: "นักผลักดัน",
    titleEn: "Shaper",
    summary: "ขับเคลื่อนทีมให้มุ่งสู่ความสำเร็จและไม่ย่อท้อต่ออุปสรรค",
    description: "เป็นคนไม่หยุดนิ่ง เชื่อมั่นในตนเอง ชอบความท้าทาย และมีทักษะกระตุ้นสมาชิกให้ทำงานได้ดี ช่วยกำหนดวัตถุประสงค์ ลำดับความสำคัญ และคอยดูแลไม่ให้ทีมออกนอกทิศทาง"
  },
  {
    id: "CO",
    titleTh: "ผู้ประสานงาน",
    titleEn: "Coordinator",
    summary: "เชื่อมคน วางระบบ และดึงศักยภาพของสมาชิกมาใช้ร่วมกัน",
    description: "มีบุคลิกสงบเยือกเย็นและได้รับการยอมรับในกลุ่ม คอยสนับสนุนข้อดี ชดเชยจุดอ่อน กระชับความสัมพันธ์ และทำให้สมาชิกปฏิบัติงานตามแผนจนสำเร็จอย่างมีประสิทธิผล"
  },
  {
    id: "PL",
    titleTh: "นักสร้างสรรค์",
    titleEn: "Creator",
    summary: "จุดประกายแนวคิด กลยุทธ์ และวิธีแก้ปัญหาใหม่ให้ทีม",
    description: "มีจินตนาการและความคิดสร้างสรรค์สูง เป็นผู้เสนอแนวคิด กลยุทธ์ และนวัตกรรมใหม่ เหมาะกับการแก้ปัญหาซับซ้อน แต่อาจชอบทำงานลำพังและมีวิธีทำงานแตกต่างจากผู้อื่น"
  },
  {
    id: "RI",
    titleTh: "นักแสวงหาทรัพยากร",
    titleEn: "Resource Investigator",
    summary: "ค้นหาโอกาส ความคิด และเครือข่ายจากภายนอกมาต่อยอดให้ทีม",
    description: "กระตือรือร้น คล่องแคล่ว ใฝ่รู้ และสื่อสารได้ดี คอยแสวงหาความคิดกับทรัพยากรจากภายนอก สร้างความสัมพันธ์ และมองเห็นช่องทางที่จะพัฒนาแนวคิดใหม่ไปสู่ความสำเร็จ"
  },
  {
    id: "ME",
    titleTh: "นักวิเคราะห์ประเมิน",
    titleEn: "Monitor-Evaluator",
    summary: "วิเคราะห์ข้อดีข้อเสียอย่างรอบด้านก่อนช่วยทีมตัดสินใจ",
    description: "คอยวิเคราะห์และประเมินปัญหาหรือความคิดของทีมอย่างจริงจัง เพื่อให้งานสมบูรณ์ขึ้น แต่อาจใช้เวลาไตร่ตรองนาน ตัดสินใจช้า มองความเสี่ยงมาก และทำให้บรรยากาศเคร่งเครียดได้"
  },
  {
    id: "IM",
    titleTh: "นักปฏิบัติ",
    titleEn: "Implementer",
    summary: "เปลี่ยนแผนให้เป็นงานที่มีระบบ ระเบียบ และลงมือทำได้จริง",
    description: "มีวินัย ขยัน รับผิดชอบ และจัดระบบการทำงานได้ดี ชอบงานที่มีแบบแผนและมุ่งมั่นต่อความสำเร็จ แต่อาจรับมือกับสถานการณ์หรือปัจจัยใหม่ที่เปลี่ยนจากเดิมได้ยาก"
  },
  {
    id: "TW",
    titleTh: "ผู้สนับสนุนทีม",
    titleEn: "Team Worker",
    summary: "สร้างความร่วมมือ รับฟัง และช่วยให้สมาชิกทำงานร่วมกันได้ราบรื่น",
    description: "ชอบเข้าสังคม ยืดหยุ่น ปรับตัวได้ดี และมีบุคลิกแบบนักการทูต เป็นนักฟังที่ดีและช่วยสร้างบรรยากาศที่ดีในกลุ่ม แต่อาจหลีกเลี่ยงการเผชิญหน้าหรือการตัดสินใจที่ซับซ้อน"
  },
  {
    id: "CF",
    titleTh: "ผู้เก็บรายละเอียดจนจบ",
    titleEn: "Completer-Finisher",
    summary: "ติดตามรายละเอียดและผลักดันให้งานสำเร็จเรียบร้อยตามมาตรฐานสูง",
    description: "เอาใจใส่ข้อมูลปลีกย่อย เจ้าระเบียบ และตามเก็บงานจนถึงขั้นตอนสุดท้าย มีแรงกระตุ้นจากภายในสูง แต่อาจจุกจิก วิตกกังวล หรือไม่ไว้วางใจงานที่ผู้อื่นทำอย่างสะเพร่า"
  }
];

export const belbinScoringKey: Record<
  BelbinSectionId,
  Record<BelbinRoleId, number>
> = {
  A: { SH: 3, CO: 7, PL: 4, RI: 6, ME: 5, IM: 1, TW: 8, CF: 2 },
  B: { SH: 1, CO: 6, PL: 5, RI: 8, ME: 4, IM: 7, TW: 3, CF: 2 },
  C: { SH: 7, CO: 4, PL: 6, RI: 2, ME: 3, IM: 5, TW: 8, CF: 1 },
  D: { SH: 2, CO: 3, PL: 6, RI: 4, ME: 5, IM: 1, TW: 8, CF: 7 },
  E: { SH: 6, CO: 5, PL: 1, RI: 7, ME: 3, IM: 4, TW: 2, CF: 8 },
  F: { SH: 6, CO: 4, PL: 5, RI: 1, ME: 3, IM: 8, TW: 7, CF: 2 },
  G: { SH: 5, CO: 7, PL: 6, RI: 3, ME: 2, IM: 1, TW: 8, CF: 4 }
};

export function isBelbinSectionComplete(scores?: BelbinSectionScores) {
  if (!scores) return false;
  const values = Object.values(scores);
  return (
    values.length >= 1 &&
    values.length <= 3 &&
    values.every((score) => Number.isInteger(score) && score >= 1 && score <= 10) &&
    values.reduce((sum, score) => sum + score, 0) === 10
  );
}

export function countCompletedBelbinSections(answers: BelbinAnswers) {
  return belbinSectionIds.filter((sectionId) =>
    isBelbinSectionComplete(answers[sectionId])
  ).length;
}

export function sanitizeBelbinAnswers(value: unknown): BelbinAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const sanitized: BelbinAnswers = {};

  belbinSectionIds.forEach((sectionId) => {
    const rawSection = source[sectionId];
    if (!rawSection || typeof rawSection !== "object" || Array.isArray(rawSection)) return;

    const next: BelbinSectionScores = {};
    Object.entries(rawSection as Record<string, unknown>)
      .sort(([a], [b]) => Number(a) - Number(b))
      .slice(0, 3)
      .forEach(([itemText, score]) => {
        const itemId = Number(itemText);
        if (
          Number.isInteger(itemId) &&
          itemId >= 1 &&
          itemId <= 8 &&
          typeof score === "number" &&
          Number.isInteger(score) &&
          score >= 1 &&
          score <= 10
        ) {
          next[itemId] = score;
        }
      });

    if (Object.keys(next).length > 0) sanitized[sectionId] = next;
  });

  return sanitized;
}

export function calculateBelbinResult(answers: BelbinAnswers): BelbinResult | null {
  if (countCompletedBelbinSections(answers) !== belbinSectionIds.length) return null;

  const scores = Object.fromEntries(
    belbinRoleIds.map((roleId) => [roleId, 0])
  ) as Record<BelbinRoleId, number>;

  belbinSectionIds.forEach((sectionId) => {
    const sectionScores = answers[sectionId] as BelbinSectionScores;
    belbinRoleIds.forEach((roleId) => {
      const itemId = belbinScoringKey[sectionId][roleId];
      scores[roleId] += sectionScores[itemId] ?? 0;
    });
  });

  const sorted = belbinRoles
    .map((role) => ({ ...role, score: scores[role.id] }))
    .sort((left, right) => right.score - left.score || belbinRoleIds.indexOf(left.id) - belbinRoleIds.indexOf(right.id));

  const rankedRoles: BelbinRoleScore[] = sorted.map((role, index) => ({
    ...role,
    rank: index > 0 && role.score === sorted[index - 1].score ? 0 : index + 1
  }));

  let currentRank = 1;
  rankedRoles.forEach((role, index) => {
    if (role.rank === 0) {
      role.rank = currentRank;
    } else {
      currentRank = index + 1;
      role.rank = currentRank;
    }
  });

  const cutoffScore = sorted[1].score;
  const featuredRoles = rankedRoles.filter((role) => role.score >= cutoffScore);

  return {
    scores,
    rankedRoles,
    featuredRoles,
    hasCutoffTie: featuredRoles.length > 2
  };
}
