export type SideQuestId = "engagement" | "leadershipStyle";

export type SideAnswerMap = Record<number, number>;

export type EngagementQuestion = {
  id: number;
  prompt: string;
};

export type LeadershipStyleOption = {
  value: number;
  code: "A" | "B" | "C";
  label: string;
};

export type LeadershipStyleQuestion = {
  id: number;
  prompt: string;
  options: LeadershipStyleOption[];
};

export type SideAssessmentResult = {
  score: number;
  minScore: number;
  maxScore: number;
  title: string;
  titleEn?: string;
  description: string;
  strengths: string;
  watchOut: string;
};

export const engagementQuestions: EngagementQuestion[] = [
  { id: 1, prompt: "ท่านเชื่อมั่นว่าผู้บริหารระดับสูงได้นำองค์กรไปสู่ทิศทางที่ถูกต้อง" },
  { id: 2, prompt: "ท่านมั่นใจว่าผู้บริหารระดับสูงมีภาวะผู้นำที่ดี" },
  { id: 3, prompt: "องค์กรส่งเสริมการติดต่อสื่อสารอย่างทั่วถึง" },
  { id: 4, prompt: "ท่านรู้สึกพึงพอใจในสิ่งที่ท่านได้ตัดสินใจทำไปและส่งผลที่ดีต่องานของท่าน" },
  { id: 5, prompt: "ท่านมั่นใจว่าผู้บริหารระดับกลางมีภาวะผู้นำที่ดี" },
  { id: 6, prompt: "ท่านไว้วางใจในผู้บริหารระดับกลางขององค์กรท่าน" },
  { id: 7, prompt: "ผู้บริหารระดับกลางเป็นแบบอย่างที่ดี" },
  { id: 8, prompt: "ผู้บริหารระดับกลางให้เกียรติท่าน" },
  { id: 9, prompt: "ท่านสามารถสื่อสารกับผู้บริหารระดับกลางได้อย่างตรงไปตรงมา" },
  { id: 10, prompt: "ผู้บริหารระดับกลางรับรู้ถึงความทุ่มเทและผลงานของท่าน" },
  { id: 11, prompt: "ผู้บริหารระดับกลางปฏิบัติต่อท่านอย่างเท่าเทียมในฐานะเพื่อนมนุษย์" },
  { id: 12, prompt: "ท่านได้เรียนรู้อย่างมากจากผู้บริหารระดับกลาง" },
  { id: 13, prompt: "ท่านได้รับกำลังใจและผลสะท้อนกลับที่ช่วยให้เพิ่มผลงานยิ่งขึ้น" },
  { id: 14, prompt: "ผู้บริหารระดับกลางใส่ใจกับชีวิตส่วนตัวของท่าน ซึ่งส่งผลต่อการทำงาน" },
  { id: 15, prompt: "ปรัชญาการทำงานขององค์กรสอดคล้องกับค่านิยมส่วนตัวของท่าน" },
  { id: 16, prompt: "ท่านเชื่อมั่นว่าพนักงานทุกคนได้รับการปฏิบัติอย่างให้เกียรติและเท่าเทียมกัน" },
  { id: 17, prompt: "องค์กรใส่ใจในความรู้สึกของท่าน" },
  { id: 18, prompt: "องค์กรส่งเสริมและสนับสนุนสุขภาพและชีวิตความเป็นอยู่ของท่าน" },
  { id: 19, prompt: "ท่านรู้สึกภาคภูมิใจที่องค์กรเสียสละและมีส่วนร่วมต่อชุมชน" },
  { id: 20, prompt: "ท่านมีใจจดจ่อและอยากไปทำงาน" },
  { id: 21, prompt: "ท่านตั้งใจทุ่มเททำงานเพื่อให้องค์กรประสบความสำเร็จ" },
  { id: 22, prompt: "ท่านรู้สึกมีชีวิตชีวาที่ได้ทำงาน" }
];

export const engagementScale = [
  { value: 1, label: "ไม่เห็นด้วยอย่างยิ่ง" },
  { value: 2, label: "ไม่เห็นด้วย" },
  { value: 3, label: "รู้สึกกลาง ๆ" },
  { value: 4, label: "เห็นด้วย" },
  { value: 5, label: "เห็นด้วยอย่างยิ่ง" }
];

export const leadershipStyleQuestions: LeadershipStyleQuestion[] = [
  {
    id: 1,
    prompt: "คำพูดติดปากของคุณคือ",
    options: [
      { value: 1, code: "A", label: "ลองทำตามที่พี่แนะนำดูนะ" },
      { value: 2, code: "B", label: "มีอะไรอยากเสนอไหม" },
      { value: 3, code: "C", label: "ลองสำรวจได้เลยว่าอยากทำแบบไหน" }
    ]
  },
  {
    id: 2,
    prompt: "สิ่งที่คุณจะทำเมื่อเกิดความขัดแย้งขึ้นในทีม",
    options: [
      { value: 1, code: "A", label: "บอกให้ลูกน้องเลิกทะเลาะกันแล้วกลับไปทำงาน" },
      { value: 2, code: "B", label: "นัดประชุม ให้แต่ละคนอธิบายสิ่งที่เกิดขึ้น และช่วยกันหาวิธีแก้ปัญหา" },
      { value: 3, code: "C", label: "ให้ลูกน้องเคลียร์กันเองโดยไม่เข้าไปยุ่ง" }
    ]
  },
  {
    id: 3,
    prompt: "เมื่อมอบหมายงานให้ทีมทำ คุณมักจะ",
    options: [
      { value: 1, code: "A", label: "เข้าไปมีส่วนร่วมแทบทุกขั้นตอนเพื่อให้มั่นใจว่างานมีคุณภาพดี" },
      { value: 2, code: "B", label: "สนับสนุนให้ลูกน้องทำงานในแบบของตัวเอง และพร้อมช่วยเมื่อต้องการ" },
      { value: 3, code: "C", label: "ให้อิสระในการทำงานและแก้ปัญหาเต็มที่ ขอเพียงได้งานตามเป้าหมาย" }
    ]
  },
  {
    id: 4,
    prompt: "เมื่อต้องตัดสินใจอะไรสักอย่าง คุณมักจะ",
    options: [
      { value: 1, code: "A", label: "ตัดสินใจทุกเรื่องด้วยตัวเอง เพราะการหารือกันไม่ใช่เรื่องจำเป็น" },
      { value: 2, code: "B", label: "ถามความคิดเห็นของทีมและกระตุ้นให้เสนอไอเดีย ก่อนตัดสินใจ" },
      { value: 3, code: "C", label: "ให้ทีมตัดสินใจกันเอง โดยช่วยกระตุ้นให้คิดและตัดสินใจให้ดี" }
    ]
  },
  {
    id: 5,
    prompt: "วิธีการนัดประชุมของคุณคือ",
    options: [
      { value: 1, code: "A", label: "ส่งคำเชิญประชุมไปเลยและให้ทุกคนเข้าร่วม" },
      { value: 2, code: "B", label: "ตรวจสอบกับทีมก่อนว่าสะดวกเวลาใดแล้วจึงกำหนดเวลา" },
      { value: 3, code: "C", label: "กำหนดประชุมประจำสัปดาห์เพื่อให้ทุกคนทราบตารางที่แน่นอน" }
    ]
  },
  {
    id: 6,
    prompt: "คุณมีความคิดเห็นอย่างไรกับการให้ลูกน้องประเมินการทำงานของคุณ",
    options: [
      { value: 1, code: "A", label: "ไม่คาดหวังให้ลูกน้องแสดงความคิดเห็นต่อวิธีการทำงานของคุณ" },
      { value: 2, code: "B", label: "กระตุ้นให้ลูกน้องแสดงความคิดเห็นและหาทางแก้ไขร่วมกัน" },
      { value: 3, code: "C", label: "รับฟังความคิดเห็นของทีมและนำคำแนะนำมาพิจารณา" }
    ]
  },
  {
    id: 7,
    prompt: "คุณติดตามการทำงานของลูกน้องบ่อยแค่ไหน",
    options: [
      { value: 1, code: "A", label: "ถ้าเลือกได้ก็อยากตรวจสอบทุกวันว่ากำลังทำอะไรอยู่" },
      { value: 2, code: "B", label: "หนึ่งหรือสองครั้งต่อสัปดาห์" },
      { value: 3, code: "C", label: "ไม่บ่อย เพราะเชื่อว่าแต่ละคนรับผิดชอบงานของตัวเองได้" }
    ]
  },
  {
    id: 8,
    prompt: "คุณแบ่งปันข้อมูลเรื่องงานกับลูกน้องมากแค่ไหน",
    options: [
      { value: 1, code: "A", label: "แบ่งปันเท่าที่จำเป็นต่อการทำงาน" },
      { value: 2, code: "B", label: "แบ่งปันแทบทุกเรื่องเพื่อความโปร่งใสในการทำงาน" },
      { value: 3, code: "C", label: "แบ่งปันตามมารยาทที่ควรทำ" }
    ]
  }
];

function hasCompleteAnswers(
  answers: SideAnswerMap,
  questionIds: number[],
  maxValue: number
) {
  return questionIds.every((id) => {
    const answer = answers[id];
    return Number.isInteger(answer) && answer >= 1 && answer <= maxValue;
  });
}

export function calculateEngagementResult(answers: SideAnswerMap): SideAssessmentResult | null {
  if (!hasCompleteAnswers(answers, engagementQuestions.map((question) => question.id), 5)) {
    return null;
  }
  const score = engagementQuestions.reduce((sum, question) => sum + answers[question.id], 0);

  if (score >= 80) {
    return {
      score,
      minScore: 22,
      maxScore: 110,
      title: "มีความผูกพันต่อองค์กรมาก",
      titleEn: "Highly Engaged",
      description: "คุณมีความเชื่อมั่น ความภาคภูมิใจ และพลังในการทุ่มเทให้องค์กรในระดับสูง",
      strengths: "มีแนวโน้มเชื่อมโยงกับเป้าหมาย ผู้นำ และสภาพแวดล้อมขององค์กรได้ดี",
      watchOut: "รักษาปัจจัยที่สร้างความไว้วางใจ การยอมรับ และโอกาสเติบโตให้ต่อเนื่อง"
    };
  }

  if (score >= 50) {
    return {
      score,
      minScore: 22,
      maxScore: 110,
      title: "มีความผูกพันต่อองค์กรบ้าง",
      titleEn: "Partly Engaged",
      description: "คุณมีความรู้สึกเชิงบวกต่อองค์กรในบางด้าน แต่อาจยังมีบางปัจจัยที่ทำให้ความผูกพันไม่เต็มที่",
      strengths: "มีฐานความสัมพันธ์กับองค์กรที่สามารถพัฒนาให้แข็งแรงขึ้นได้",
      watchOut: "ลองพิจารณาข้อที่ให้คะแนนต่ำ เพื่อมองหาปัจจัยด้านผู้นำ การสื่อสาร หรือการสนับสนุนที่ควรปรับปรุง"
    };
  }

  return {
    score,
    minScore: 22,
    maxScore: 110,
    title: "ยังไม่มีความผูกพันต่อองค์กร",
    titleEn: "Not Engaged",
    description: "หลายปัจจัยในประสบการณ์ทำงานปัจจุบันอาจยังไม่ช่วยให้คุณรู้สึกเชื่อมั่นหรือเชื่อมโยงกับองค์กร",
    strengths: "ผลนี้ช่วยระบุจุดที่องค์กรและผู้ดูแลสามารถเริ่มต้นรับฟังและปรับปรุงได้",
    watchOut: "ควรพิจารณาประเด็นด้านภาวะผู้นำ การสื่อสาร การยอมรับ และคุณภาพชีวิตการทำงานอย่างเป็นรูปธรรม"
  };
}

export function calculateLeadershipStyleResult(
  answers: SideAnswerMap
): SideAssessmentResult | null {
  if (
    !hasCompleteAnswers(
      answers,
      leadershipStyleQuestions.map((question) => question.id),
      3
    )
  ) {
    return null;
  }
  const score = leadershipStyleQuestions.reduce((sum, question) => sum + answers[question.id], 0);

  if (score <= 12) {
    return {
      score,
      minScore: 8,
      maxScore: 24,
      title: "หัวหน้าสั่งลุย",
      titleEn: "Autocratic Leader",
      description: "คุณบริหารทีมแบบสั่งการจากบนลงล่าง มั่นใจ ตัดสินใจเด็ดขาด และกำหนดวิธีทำงานอย่างชัดเจน",
      strengths: "รับมือภาวะวิกฤตและตัดสินใจได้รวดเร็วเมื่อทีมต้องการทิศทางที่แน่นอน",
      watchOut: "การควบคุมมากเกินไปอาจทำให้ทีมขาดโอกาสคิด แก้ปัญหา และสร้างสรรค์ด้วยตัวเอง"
    };
  }

  if (score <= 19) {
    return {
      score,
      minScore: 8,
      maxScore: 24,
      title: "หัวหน้าแบบประชาธิปไตย",
      titleEn: "Democratic Leader",
      description: "คุณให้ความสำคัญกับความคิดเห็นและการมีส่วนร่วมของทีม พร้อมรับฟังและยังรับผิดชอบการตัดสินใจสุดท้าย",
      strengths: "ช่วยให้ทีมรู้สึกเป็นเจ้าของงานและเปิดพื้นที่ให้ความเชี่ยวชาญกับความคิดสร้างสรรค์",
      watchOut: "การรวบรวมความคิดเห็นมากเกินไปในภาวะเร่งด่วนอาจทำให้ตัดสินใจล่าช้า"
    };
  }

  return {
    score,
    minScore: 8,
    maxScore: 24,
    title: "หัวหน้าแบบปล่อยให้ทำ",
    titleEn: "Laissez-Faire Leader",
    description: "คุณกระจายงานและให้อิสระแก่ทีม โดยเข้าไปช่วยเมื่อจำเป็นหรือเมื่องานเริ่มออกนอกทิศทาง",
    strengths: "เหมาะกับทีมที่มีแรงจูงใจ รับผิดชอบตัวเอง และต้องการพื้นที่แสดงศักยภาพ",
    watchOut: "ถ้าทีมยังไม่พร้อม การติดตามน้อยเกินไปอาจทำให้พลาดปัญหาและลดความเป็นหนึ่งเดียวกัน"
  };
}
