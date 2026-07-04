export type ChapterId = "eq" | "bigFive" | "competency";

export type CategoryKey =
  | "selfAwareness"
  | "socialAwareness"
  | "selfManagement"
  | "socialSkills"
  | "adjustment"
  | "sociability"
  | "openness"
  | "agreeableness"
  | "conscientiousness"
  | "managingSelf"
  | "communication"
  | "diversity"
  | "ethics"
  | "acrossCultures"
  | "teams"
  | "change";

export type QuestionKind = "eq" | "bigFive" | "competency";

export type Question = {
  id: string;
  chapterId: ChapterId;
  kind: QuestionKind;
  item: number;
  category: CategoryKey;
  prompt: string;
  promptTh: string;
  left?: string;
  leftTh?: string;
  right?: string;
  rightTh?: string;
};

export type ChapterMeta = {
  id: ChapterId;
  title: string;
  titleTh: string;
  short: string;
  scale: string;
  accent: string;
};

export type CategoryMeta = {
  key: CategoryKey;
  chapterId: ChapterId;
  label: string;
  labelTh: string;
  shortLabel: string;
  maxPerItem: number;
};

export const chapters: ChapterMeta[] = [
  {
    id: "eq",
    title: "Emotional Quotient",
    titleTh: "วุฒิภาวะทางอารมณ์",
    short: "EQ",
    scale: "1-4",
    accent: "#4F8EE8"
  },
  {
    id: "bigFive",
    title: "Big Five Locator",
    titleTh: "คุณลักษณะ Big Five",
    short: "BIG 5",
    scale: "5-1",
    accent: "#39A7A5"
  },
  {
    id: "competency",
    title: "Professional Competencies",
    titleTh: "สมรรถนะการทำงาน",
    short: "PRO",
    scale: "1-10",
    accent: "#E0A93D"
  }
];

export const categories: CategoryMeta[] = [
  { key: "selfAwareness", chapterId: "eq", label: "Self-awareness", labelTh: "การรู้จักตนเอง", shortLabel: "Self", maxPerItem: 4 },
  { key: "socialAwareness", chapterId: "eq", label: "Social Awareness", labelTh: "การตระหนักรู้ทางสังคม", shortLabel: "Social", maxPerItem: 4 },
  { key: "selfManagement", chapterId: "eq", label: "Self Management", labelTh: "การจัดการตนเอง", shortLabel: "Manage", maxPerItem: 4 },
  { key: "socialSkills", chapterId: "eq", label: "Social Skills", labelTh: "ทักษะสังคม", shortLabel: "Skill", maxPerItem: 4 },
  { key: "adjustment", chapterId: "bigFive", label: "Adjustment", labelTh: "ความมั่นคงทางอารมณ์", shortLabel: "Adj", maxPerItem: 5 },
  { key: "sociability", chapterId: "bigFive", label: "Sociability", labelTh: "การเข้าสังคม", shortLabel: "Soc", maxPerItem: 5 },
  { key: "openness", chapterId: "bigFive", label: "Openness", labelTh: "การเปิดรับสิ่งใหม่", shortLabel: "Open", maxPerItem: 5 },
  { key: "agreeableness", chapterId: "bigFive", label: "Agreeableness", labelTh: "ความร่วมมือและเป็นมิตร", shortLabel: "Agree", maxPerItem: 5 },
  { key: "conscientiousness", chapterId: "bigFive", label: "Conscientiousness", labelTh: "ความมีวินัยและละเอียดรอบคอบ", shortLabel: "Focus", maxPerItem: 5 },
  { key: "managingSelf", chapterId: "competency", label: "Managing Self", labelTh: "การจัดการตนเอง", shortLabel: "Self", maxPerItem: 10 },
  { key: "communication", chapterId: "competency", label: "Managing Communication", labelTh: "การสื่อสาร", shortLabel: "Comm", maxPerItem: 10 },
  { key: "diversity", chapterId: "competency", label: "Managing Diversity", labelTh: "ความหลากหลาย", shortLabel: "Diverse", maxPerItem: 10 },
  { key: "ethics", chapterId: "competency", label: "Managing Ethics", labelTh: "จริยธรรม", shortLabel: "Ethics", maxPerItem: 10 },
  { key: "acrossCultures", chapterId: "competency", label: "Managing Across Cultures", labelTh: "การทำงานข้ามวัฒนธรรม", shortLabel: "Culture", maxPerItem: 10 },
  { key: "teams", chapterId: "competency", label: "Managing Teams", labelTh: "การทำงานเป็นทีม", shortLabel: "Team", maxPerItem: 10 },
  { key: "change", chapterId: "competency", label: "Managing Change", labelTh: "การจัดการการเปลี่ยนแปลง", shortLabel: "Change", maxPerItem: 10 }
];

const q = (
  kind: QuestionKind,
  item: number,
  category: CategoryKey,
  prompt: string,
  promptTh: string
): Question => ({
  id: `${kind}-${item}`,
  chapterId: kind === "competency" ? "competency" : kind === "bigFive" ? "bigFive" : "eq",
  kind,
  item,
  category,
  prompt,
  promptTh
});

const b = (
  item: number,
  category: CategoryKey,
  left: string,
  leftTh: string,
  right: string,
  rightTh: string
): Question => ({
  id: `bigFive-${item}`,
  chapterId: "bigFive",
  kind: "bigFive",
  item,
  category,
  prompt: `${left} / ${right}`,
  promptTh: `${leftTh} / ${rightTh}`,
  left,
  leftTh,
  right,
  rightTh
});

export const questions: Question[] = [
  q("eq", 1, "selfAwareness", "I know when to speak about my personal problems to others.", "ฉันรู้ว่าเมื่อไรควรพูดปัญหาส่วนตัวกับคนอื่น"),
  q("eq", 2, "selfManagement", "When I face obstacles, I remember similar obstacles I overcame.", "เมื่อเจออุปสรรค ฉันนึกถึงครั้งที่เคยผ่านเรื่องคล้ายกันมาได้"),
  q("eq", 3, "selfManagement", "I expect that I will do well on most things.", "ฉันคาดหวังว่าฉันจะทำสิ่งต่าง ๆ ได้ดีเป็นส่วนใหญ่"),
  q("eq", 4, "socialAwareness", "Other people find it easy to confide in me.", "คนอื่นรู้สึกว่าไว้ใจและเล่าเรื่องกับฉันได้ง่าย"),
  q("eq", 5, "socialSkills", "I find it easy to understand the nonverbal messages of other people.", "ฉันเข้าใจภาษาท่าทางของคนอื่นได้ง่าย"),
  q("eq", 6, "selfAwareness", "Major life events have led me to reevaluate what is important.", "เหตุการณ์ใหญ่ในชีวิตทำให้ฉันทบทวนว่าอะไรสำคัญหรือไม่สำคัญ"),
  q("eq", 7, "selfAwareness", "When my mood changes, I see new possibilities.", "เมื่ออารมณ์เปลี่ยน ฉันมองเห็นความเป็นไปได้ใหม่ ๆ"),
  q("eq", 8, "selfAwareness", "Emotions are one of the things that make life worth living.", "อารมณ์เป็นสิ่งหนึ่งที่ทำให้ชีวิตมีคุณค่า"),
  q("eq", 9, "selfManagement", "I am aware of my emotions as I experience them.", "ฉันตระหนักถึงอารมณ์ของตัวเองขณะที่มันเกิดขึ้น"),
  q("eq", 10, "selfManagement", "I expect good things to happen.", "ฉันคาดหวังว่าสิ่งดี ๆ จะเกิดขึ้น"),
  q("eq", 11, "socialSkills", "I like to share my emotions with other people.", "ฉันชอบแบ่งปันอารมณ์ของฉันกับคนอื่น"),
  q("eq", 12, "selfAwareness", "When I experience a positive emotion, I know how to make it last.", "เมื่อฉันรู้สึกดี ฉันรู้ว่าจะทำให้ความรู้สึกนั้นอยู่ต่อได้อย่างไร"),
  q("eq", 13, "socialSkills", "I arrange events others enjoy.", "ฉันสร้างสถานการณ์หรือกิจกรรมที่ทำให้คนอื่นสนุกได้"),
  q("eq", 14, "selfAwareness", "I seek out activities that make me happy.", "ฉันค้นหากิจกรรมที่ทำให้ฉันมีความสุข"),
  q("eq", 15, "socialAwareness", "I am aware of the nonverbal messages I send to others.", "ฉันตระหนักถึงกิริยาท่าทางที่ฉันส่งออกไปหาคนอื่น"),
  q("eq", 16, "selfManagement", "I present myself in a way that makes a good impression on others.", "ฉันนำเสนอตัวเองในแบบที่ทำให้คนอื่นประทับใจ"),
  q("eq", 17, "selfAwareness", "When I am in a positive mood, solving problems is easy for me.", "เมื่อฉันอารมณ์ดี การแก้ปัญหาเป็นเรื่องง่ายขึ้น"),
  q("eq", 18, "socialAwareness", "By looking at facial expressions, I can recognize what others feel.", "ฉันอ่านอารมณ์คนอื่นจากสีหน้าได้"),
  q("eq", 19, "selfAwareness", "I know why my emotions change.", "ฉันรู้ว่าทำไมอารมณ์ของฉันจึงเปลี่ยนไป"),
  q("eq", 20, "selfAwareness", "When I am in a positive mood, I can come up with new ideas.", "เมื่อฉันอารมณ์ดี ฉันคิดไอเดียใหม่ ๆ ได้"),
  q("eq", 21, "selfManagement", "I have control over my emotions.", "ฉันควบคุมอารมณ์ของตัวเองได้"),
  q("eq", 22, "selfAwareness", "I easily recognize my emotions as I experience them.", "ฉันรับรู้อารมณ์ของตัวเองได้ง่ายเมื่อมันเกิดขึ้น"),
  q("eq", 23, "selfAwareness", "I motivate myself by imagining a good outcome to my tasks.", "ฉันจูงใจตัวเองด้วยการนึกถึงผลลัพธ์ที่ดีของงาน"),
  q("eq", 24, "socialSkills", "I compliment others when they have done something well.", "ฉันชื่นชมคนอื่นเมื่อเขาทำสิ่งใดได้ดี"),
  q("eq", 25, "socialAwareness", "I am aware of the nonverbal messages other people send.", "ฉันตระหนักถึงภาษาท่าทางที่คนอื่นแสดงออก"),
  q("eq", 26, "socialSkills", "When someone tells me about an important event, I almost feel it myself.", "เมื่อคนอื่นเล่าเหตุการณ์สำคัญ ฉันรู้สึกราวกับได้สัมผัสเหตุการณ์นั้นเอง"),
  q("eq", 27, "selfAwareness", "When I feel a change in emotions, I tend to come up with new ideas.", "เมื่ออารมณ์เปลี่ยน ฉันมักเกิดไอเดียใหม่ ๆ"),
  q("eq", 28, "selfManagement", "When I am faced with challenges, I usually rise to the occasion.", "เมื่อเจอเรื่องท้าทาย ฉันมักยกระดับตัวเองขึ้นมารับมือ"),
  q("eq", 29, "socialAwareness", "I know what other people are feeling just by looking at them.", "ฉันรู้ว่าคนอื่นรู้สึกอย่างไรเพียงแค่มองพวกเขา"),
  q("eq", 30, "socialSkills", "I help other people feel better when they are down.", "ฉันช่วยให้คนอื่นรู้สึกดีขึ้นเมื่อเขาท้อแท้"),
  q("eq", 31, "selfManagement", "I use good moods to keep trying in the face of obstacles.", "ฉันใช้ความรู้สึกดี ๆ ช่วยให้ตัวเองพยายามต่อเมื่อเจออุปสรรค"),
  q("eq", 32, "socialAwareness", "I can tell how people feel by listening to the tone of their voices.", "ฉันบอกความรู้สึกของคนอื่นได้จากโทนเสียง"),

  b(1, "adjustment", "Eager", "กระตือรือร้น", "Calm", "นิ่งเฉย"),
  b(2, "sociability", "Prefer Being with Other People", "ชอบอยู่กับคนอื่น", "Prefer Being Alone", "ชอบอยู่คนเดียว"),
  b(3, "openness", "A Dreamer", "นักฝัน", "No-Nonsense", "จริงจังตรงไปตรงมา"),
  b(4, "agreeableness", "Courteous", "สุภาพอ่อนน้อม", "Abrupt", "หุนหันพลันแล่น"),
  b(5, "conscientiousness", "Neat", "เรียบร้อย", "Messy", "ไม่เรียบร้อย"),
  b(6, "adjustment", "Cautious", "รอบคอบ", "Confident", "เชื่อมั่นในตัวเอง"),
  b(7, "sociability", "Optimistic", "มองโลกในแง่ดี", "Pessimistic", "มองโลกในแง่ร้าย"),
  b(8, "openness", "Theoretical", "นักทฤษฎี", "Practical", "นักปฏิบัติ"),
  b(9, "agreeableness", "Generous", "ใจกว้าง", "Selfish", "เห็นแก่ตัว"),
  b(10, "conscientiousness", "Decisive", "เด็ดขาด ไม่ลังเล", "Open-Ended", "ยืดหยุ่นง่าย"),
  b(11, "adjustment", "Discouraged", "ท้อแท้ง่าย", "Upbeat", "มีความหวัง"),
  b(12, "sociability", "Exhibitionist", "ชอบเป็นที่สนใจ", "Private", "เป็นส่วนตัว"),
  b(13, "openness", "Follow Imagination", "ทำตามจินตนาการ", "Follow Authority", "ทำตามคำสั่ง"),
  b(14, "agreeableness", "Warm", "เป็นมิตร", "Cold", "เย็นชา"),
  b(15, "conscientiousness", "Stay Focused", "มีสมาธิ ตั้งใจ", "Easily Distracted", "วอกแวกง่าย"),
  b(16, "adjustment", "Easily Embarrassed", "ขี้อาย", "Do Not Give a Darn", "ใจกล้า ไม่แคร์สื่อ"),
  b(17, "sociability", "Outgoing", "เข้ากับคนอื่นง่าย", "Cool", "เย็นชา ไม่ค่อยเปิดรับ"),
  b(18, "openness", "Seek Novelty", "ชอบความแปลกใหม่", "Seek Routine", "ชอบกิจวัตรเดิม"),
  b(19, "agreeableness", "Team Player", "ชอบทำงานเป็นทีม", "Independent", "ชอบทำงานคนเดียว"),
  b(20, "conscientiousness", "A Preference for Order", "ชอบลำดับและระบบ", "Comfortable with Chaos", "แก้ปัญหาเฉพาะหน้าได้ดี"),
  b(21, "adjustment", "Distractible", "วิตกกังวลง่าย", "Unflappable", "หนักแน่น"),
  b(22, "sociability", "Conversational", "ช่างพูดช่างคุย", "Thoughtful", "คิดมาก เงียบกว่า"),
  b(23, "openness", "Comfortable with Ambiguity", "อยู่กับความไม่ชัดเจนได้", "Prefer Things Clear-Cut", "ชอบความชัดเจน"),
  b(24, "agreeableness", "Trusting", "เชื่อใจง่าย", "Skeptical", "ขี้สงสัย"),
  b(25, "conscientiousness", "On Time", "ตรงเวลา", "Procrastinate", "ผัดวันประกันพรุ่ง"),

  q("competency", 1, "managingSelf", "Maintain awareness of own behavior and how it affects others.", "ตระหนักถึงพฤติกรรมของตนเองและผลต่อผู้อื่น"),
  q("competency", 2, "managingSelf", "Set priorities and manage time.", "ลำดับความสำคัญของงานและบริหารเวลาได้"),
  q("competency", 3, "managingSelf", "Know own limitations and ask for help when necessary.", "รู้ข้อจำกัดของตัวเองและขอความช่วยเหลือเมื่อจำเป็น"),
  q("competency", 4, "managingSelf", "Assess and establish own life- and work-related goals.", "ประเมินและตั้งเป้าหมายชีวิตและงานของตนเอง"),
  q("competency", 5, "managingSelf", "Take responsibility for decisions and managing self.", "รับผิดชอบต่อการตัดสินใจและการจัดการตัวเอง"),
  q("competency", 6, "managingSelf", "Persevere in the face of obstacles or criticism.", "มีความเพียรเมื่อเจออุปสรรคหรือคำวิจารณ์"),
  q("competency", 7, "managingSelf", "Avoid being self-promoting or arrogant.", "ไม่ยกตนหรือหยิ่งทระนง"),
  q("competency", 8, "managingSelf", "Recover quickly from failure and learn from mistakes.", "ฟื้นตัวจากความผิดพลาดได้เร็วและเรียนรู้จากมัน"),
  q("competency", 9, "managingSelf", "Try to learn continuously.", "พยายามเรียนรู้อย่างต่อเนื่อง"),
  q("competency", 10, "managingSelf", "Pursue feedback openly and nondefensively.", "เปิดใจรับ feedback โดยไม่ตั้งการ์ด"),
  q("competency", 11, "communication", "Organize and present ideas effectively.", "จัดระเบียบและนำเสนอความคิดได้อย่างมีประสิทธิผล"),
  q("competency", 12, "communication", "Detect and understand others' values, motives, and emotions.", "สังเกตและเข้าใจคุณค่า แรงจูงใจ และอารมณ์ของผู้อื่น"),
  q("competency", 13, "communication", "Present written materials clearly and concisely.", "เขียนสื่อสารได้ชัดเจนและกระชับ"),
  q("competency", 14, "communication", "Listen actively and nonjudgmentally.", "ฟังอย่างตั้งใจและไม่รีบตัดสิน"),
  q("competency", 15, "communication", "Respond appropriately to positive and negative feedback.", "ตอบสนองต่อ feedback ทั้งบวกและลบอย่างเหมาะสม"),
  q("competency", 16, "communication", "Be aware of and sensitive to nonverbal messages.", "ตระหนักและไวต่อภาษาท่าทาง"),
  q("competency", 17, "communication", "Hold people's attention when communicating.", "รักษาความสนใจของผู้ฟังเมื่อสื่อสาร"),
  q("competency", 18, "communication", "Share information willingly.", "เต็มใจแบ่งปันข้อมูล"),
  q("competency", 19, "communication", "Express needs, opinions, and preferences without offending others.", "สื่อสารความต้องการและความเห็นโดยไม่ทำร้ายคนอื่น"),
  q("competency", 20, "communication", "Use a variety of electronic resources to communicate.", "ใช้เครื่องมืออิเล็กทรอนิกส์หลากหลายในการสื่อสาร"),
  q("competency", 21, "diversity", "Encourage inclusion of those who are different from self.", "สนับสนุนให้คนที่แตกต่างได้มีส่วนร่วม"),
  q("competency", 22, "diversity", "Seek to learn from those with different characteristics and perspectives.", "เรียนรู้จากคนที่มีลักษณะและมุมมองแตกต่าง"),
  q("competency", 23, "diversity", "Respect people of other cultures and races.", "เคารพผู้คนต่างวัฒนธรรมและเชื้อชาติ"),
  q("competency", 24, "diversity", "Show sensitivity to the needs and concerns of others.", "ใส่ใจความต้องการและความกังวลของผู้อื่น"),
  q("competency", 25, "diversity", "Seek win-win or appropriate compromise solutions to diversity conflicts.", "หาทางออกแบบ win-win หรือประนีประนอมในประเด็นความหลากหลาย"),
  q("competency", 26, "diversity", "Use unique individual and group characteristics as organizational strengths.", "มองเอกลักษณ์ของบุคคลและกลุ่มเป็นจุดแข็งขององค์กร"),
  q("competency", 27, "diversity", "Be sensitive to differences among people and seek ways to work with them.", "ใส่ใจความแตกต่างและหาวิธีทำงานร่วมกัน"),
  q("competency", 28, "diversity", "Respect ideas, values, and traditions of others.", "เคารพความคิด คุณค่า และธรรมเนียมของผู้อื่น"),
  q("competency", 29, "diversity", "Identify opportunities to promote diversity.", "มองเห็นโอกาสในการส่งเสริมความหลากหลาย"),
  q("competency", 30, "diversity", "Help people with different attributes succeed.", "ช่วยให้คนที่มีลักษณะแตกต่างจากตนเองประสบความสำเร็จ"),
  q("competency", 31, "ethics", "Demonstrate dignity and respect in working relationships.", "ให้เกียรติและเคารพผู้อื่นในการทำงานร่วมกัน"),
  q("competency", 32, "ethics", "Be honest and open in communication within privacy, legal, and competitive limits.", "สื่อสารอย่างซื่อสัตย์และเปิดเผยภายใต้ข้อจำกัดที่เหมาะสม"),
  q("competency", 33, "ethics", "Assess right and wrong in own decisions and behaviors.", "ประเมินความถูกผิดในการตัดสินใจและพฤติกรรมของตนเอง"),
  q("competency", 34, "ethics", "Adhere to professional and organizational codes of conduct.", "ปฏิบัติตามจริยธรรมวิชาชีพและองค์กร"),
  q("competency", 35, "ethics", "Avoid pressure from others to engage in unethical conduct.", "หลีกเลี่ยงแรงกดดันที่นำไปสู่พฤติกรรมไร้จริยธรรม"),
  q("competency", 36, "ethics", "Understand ethical principles and rules.", "เข้าใจหลักการและกฎด้านจริยธรรม"),
  q("competency", 37, "ethics", "Be seen by others as a person of integrity.", "เป็นคนซื่อตรงในสายตาคนอื่น"),
  q("competency", 38, "ethics", "Set clear expectations for ethical behavior and reinforce them.", "ตั้งความคาดหวังด้านจริยธรรมอย่างชัดเจนและย้ำสม่ำเสมอ"),
  q("competency", 39, "ethics", "Be sensitive to the rights of others.", "ใส่ใจสิทธิของผู้อื่น"),
  q("competency", 40, "ethics", "Take responsibility for decisions and actions without blaming others.", "รับผิดชอบต่อการตัดสินใจและการกระทำ ไม่โยนความผิด"),
  q("competency", 41, "acrossCultures", "Understand and appreciate what makes a culture unique.", "เข้าใจและเห็นคุณค่าความเฉพาะตัวของวัฒนธรรม"),
  q("competency", 42, "acrossCultures", "Treat people from different cultures with respect.", "ปฏิบัติต่อคนต่างวัฒนธรรมด้วยความเคารพ"),
  q("competency", 43, "acrossCultures", "Consider issues from a worldwide perspective: think globally, act locally.", "มองประเด็นจากระดับโลกและปรับใช้กับบริบทท้องถิ่น"),
  q("competency", 44, "acrossCultures", "Work effectively with members from different cultures.", "ทำงานกับสมาชิกต่างวัฒนธรรมได้อย่างมีประสิทธิผล"),
  q("competency", 45, "acrossCultures", "Like to experience different cultures.", "ชอบเรียนรู้และสัมผัสวัฒนธรรมที่แตกต่าง"),
  q("competency", 46, "acrossCultures", "Learn from those with different cultural backgrounds.", "เรียนรู้จากคนที่มีพื้นฐานวัฒนธรรมต่างกัน"),
  q("competency", 47, "acrossCultures", "Know cultures where individuals are expected to take care of themselves.", "เข้าใจวัฒนธรรมที่คาดหวังให้แต่ละคนดูแลตัวเอง"),
  q("competency", 48, "acrossCultures", "Know how cultures manage uncertainty and risk with rules.", "เข้าใจวัฒนธรรมที่ใช้กฎเพื่อลดความไม่แน่นอนและความเสี่ยง"),
  q("competency", 49, "acrossCultures", "Know how masculinity and femininity affect relationships in societies.", "เข้าใจผลของบทบาทชายหญิงต่อความสัมพันธ์ในสังคมต่าง ๆ"),
  q("competency", 50, "acrossCultures", "Work effectively with cultures that value unequal power distribution.", "ทำงานกับวัฒนธรรมที่มองการกระจายอำนาจไม่เท่ากันได้"),
  q("competency", 51, "teams", "Work effectively in team situations.", "ทำงานเป็นทีมได้อย่างมีประสิทธิผล"),
  q("competency", 52, "teams", "Encourage teams to celebrate accomplishments.", "ส่งเสริมให้ทีมฉลองความสำเร็จร่วมกัน"),
  q("competency", 53, "teams", "Demonstrate mutual and personal responsibility for team goals.", "แสดงความร่วมมือและความรับผิดชอบต่อเป้าหมายทีม"),
  q("competency", 54, "teams", "Observe group dynamics and raise relevant issues for discussion.", "สังเกตพลวัตของกลุ่มและหยิบประเด็นสำคัญมาคุย"),
  q("competency", 55, "teams", "Promote teamwork and discourage us-versus-them thinking.", "ส่งเสริมทีมเวิร์กและลดความคิดแบ่งฝ่าย"),
  q("competency", 56, "teams", "Support and praise others for reaching goals and accomplishing tasks.", "สนับสนุนและชื่นชมคนอื่นเมื่อทำงานสำเร็จ"),
  q("competency", 57, "teams", "Encourage and support creativity in teams.", "กระตุ้นและสนับสนุนความคิดสร้างสรรค์ในทีม"),
  q("competency", 58, "teams", "Share credit with others.", "แบ่งปันเครดิตความสำเร็จกับคนอื่น"),
  q("competency", 59, "teams", "Motivate team members to work toward common goals.", "จูงใจสมาชิกทีมให้ไปสู่เป้าหมายร่วมกัน"),
  q("competency", 60, "teams", "Use groupware and information technologies to achieve team goals.", "ใช้เครื่องมือทำงานร่วมกันและเทคโนโลยีเพื่อบรรลุเป้าหมายทีม"),
  q("competency", 61, "change", "Demonstrate leadership skills to implement planned change.", "แสดงทักษะผู้นำในการขับเคลื่อนการเปลี่ยนแปลงตามแผน"),
  q("competency", 62, "change", "Diagnose pressures for and resistance to change.", "วิเคราะห์แรงผลักดันและแรงต้านต่อการเปลี่ยนแปลง"),
  q("competency", 63, "change", "Prepare people to manage change.", "เตรียมคนให้พร้อมจัดการการเปลี่ยนแปลง"),
  q("competency", 64, "change", "Learn, share, and apply new knowledge to improve teams or organizations.", "เรียนรู้ แบ่งปัน และใช้ความรู้ใหม่เพื่อพัฒนาทีมหรือองค์กร"),
  q("competency", 65, "change", "Diagnose a firm's culture.", "วิเคราะห์วัฒนธรรมองค์กรได้"),
  q("competency", 66, "change", "Use a variety of technologies to achieve successful change.", "ใช้เทคโนโลยีหลากหลายเพื่อให้การเปลี่ยนแปลงสำเร็จ"),
  q("competency", 67, "change", "Use organizational designs to bring about successful change.", "เข้าใจการออกแบบองค์กรที่ช่วยให้การเปลี่ยนแปลงสำเร็จ"),
  q("competency", 68, "change", "Have a positive attitude toward changes and new ideas.", "มีทัศนคติเชิงบวกต่อการเปลี่ยนแปลงและไอเดียใหม่"),
  q("competency", 69, "change", "Negotiate and resolve conflicts that come with significant change.", "ต่อรองและแก้ความขัดแย้งที่เกิดกับการเปลี่ยนแปลงสำคัญ"),
  q("competency", 70, "change", "Understand how organizational culture influences change.", "เข้าใจว่าวัฒนธรรมองค์กรส่งผลต่อการเปลี่ยนแปลงอย่างไร")
];

export const eqScale = [
  { value: 1, label: "ไม่เห็นด้วยอย่างยิ่ง" },
  { value: 2, label: "ไม่เห็นด้วย" },
  { value: 3, label: "เห็นด้วย" },
  { value: 4, label: "เห็นด้วยอย่างยิ่ง" }
];

export const competencyScaleAnchors = {
  1: "ยังไม่มีประสบการณ์",
  5: "ยังขาดอยู่",
  7: "ปานกลาง",
  10: "ยอดเยี่ยม"
} as const;
