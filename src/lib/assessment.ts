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
  b(2, "sociability", "Prefer Being with Other People", "ชอบสมาคมกับคนหมู่มาก", "Prefer Being Alone", "ชอบอยู่คนเดียว"),
  b(3, "openness", "A Dreamer", "นักฝัน", "No-Nonsense", "จริงจัง"),
  b(4, "agreeableness", "Courteous", "สุภาพอ่อนน้อม", "Abrupt", "หุนหันพลันแล่น"),
  b(5, "conscientiousness", "Neat", "เรียบร้อย", "Messy", "ไม่เรียบร้อย"),
  b(6, "adjustment", "Cautious", "รอบคอบ", "Confident", "เชื่อมั่นในตัวเอง"),
  b(7, "sociability", "Optimistic", "มองโลกในแง่ดี", "Pessimistic", "มองโลกในแง่ร้าย"),
  b(8, "openness", "Theoretical", "นักทฤษฎี", "Practical", "นักปฏิบัติ"),
  b(9, "agreeableness", "Generous", "ใจกว้าง", "Selfish", "เห็นแก่ตัว"),
  b(10, "conscientiousness", "Decisive", "เด็ดขาด ไม่ลังเล", "Open-Ended", "ยืดหยุ่นง่าย"),
  b(11, "adjustment", "Discourage", "ท้อแท้ง่าย", "Upbeat", "มีความหวัง"),
  b(12, "sociability", "Exhibitionist", "เป็นที่สนใจ", "Private", "มักอยู่ลำพัง"),
  b(13, "openness", "Follow Imagination", "ทำตามจินตนาการ", "Follow Authority", "ทำตามคำสั่ง"),
  b(14, "agreeableness", "Warm", "เป็นมิตร", "Cold", "เย็นชา"),
  b(15, "conscientiousness", "Stay Focused", "มีสมาธิ ตั้งใจ", "Easily Distracted", "ลังเล เปลี่ยนแปลงง่าย"),
  b(16, "adjustment", "Easily Embarrassed", "ขี้อาย", "Don't Give a Darn", "ใจกล้า ไม่แคร์สื่อ"),
  b(17, "sociability", "Outgoing", "เข้ากับคนอื่นได้ง่าย", "Cool", "เย็นชา ไม่เป็นมิตร"),
  b(18, "openness", "Seek Novelty", "ชอบค้นหาความแปลกใหม่", "Seek Routine", "ไม่ชอบการเปลี่ยนแปลง ชอบงานที่ทำกิจวัตรประจำ"),
  b(19, "agreeableness", "Team Player", "ชอบทำงานเป็นทีม", "Independent", "ชอบทำงานคนเดียว"),
  b(20, "conscientiousness", "A Preference for Order", "ทำตามลำดับก่อนหลัง ทำตามคำสั่ง", "Comfortable with Chaos", "แก้ปัญหาเฉพาะหน้าได้ดี"),
  b(21, "adjustment", "Distractible", "วิตกกังวล", "Unflappable", "หนักแน่น"),
  b(22, "sociability", "Conversational", "ช่างพูดช่างคุย", "Thoughtful", "คิดมาก"),
  b(23, "openness", "Comfortable with Ambiguity", "ปรับตัวกับความไม่ชัดเจนได้", "Prefer Things Clear-Cut", "ชอบสิ่งที่มีความชัดเจน"),
  b(24, "agreeableness", "Trusting", "เชื่อถือได้", "Skeptical", "ขี้สงสัย"),
  b(25, "conscientiousness", "On Time", "ตรงเวลา", "Procrastinate", "ผัดวันประกันพรุ่ง"),

  q("competency", 1, "managingSelf", "Maintains awareness of own behavior and how it affects others.", "ตระหนักถึงพฤติกรรมของตนเอง และรู้ว่าพฤติกรรมนั้นส่งผลต่อผู้อื่นอย่างไร"),
  q("competency", 2, "managingSelf", "Is able to set priorities and manage time.", "สามารถลำดับความสำคัญของงานและบริหารเวลาได้"),
  q("competency", 3, "managingSelf", "Knows own limitations and asks for help when necessary.", "รู้ข้อจำกัดของตัวเองและขอความช่วยเหลือเมื่อจำเป็น"),
  q("competency", 4, "managingSelf", "Assesses and establishes own life- and work-related goals.", "ประเมินและตั้งเป้าหมายชีวิตและเป้าหมายในการทำงานของตนเอง"),
  q("competency", 5, "managingSelf", "Takes responsibility for decisions and managing self.", "มีความรับผิดชอบต่อการตัดสินใจและการจัดการเกี่ยวกับตัวเอง"),
  q("competency", 6, "managingSelf", "Perseveres in the face of obstacles or criticism.", "มีความเพียรเมื่อเผชิญหน้ากับอุปสรรคหรือคำวิจารณ์"),
  q("competency", 7, "managingSelf", "Is not self-promoting or arrogant.", "ไม่ยกยอตัวเอง หรือไม่หยิ่งทระนง"),
  q("competency", 8, "managingSelf", "Recovers quickly from failure, including learning from mistakes.", "ฟื้นตัวจากความผิดหวังได้เร็ว รวมทั้งเรียนรู้จากข้อผิดพลาด"),
  q("competency", 9, "managingSelf", "Tries to learn continuously.", "พยายามเรียนรู้อย่างต่อเนื่อง"),
  q("competency", 10, "managingSelf", "Pursues feedback openly and nondefensively.", "ยอมรับฟังผลสะท้อนกลับอย่างเปิดใจและไม่มีการต่อต้าน"),
  q("competency", 11, "communication", "Organizes and presents ideas effectively.", "สร้างสรรค์และแสดงออกซึ่งความคิดอย่างมีประสิทธิผล"),
  q("competency", 12, "communication", "Detects and understands others' values, motives, and emotions.", "สังเกตและเข้าใจคุณค่า แรงจูงใจ และอารมณ์ของผู้อื่น"),
  q("competency", 13, "communication", "Presents written materials clearly and concisely.", "นำเสนอข้อเขียนอย่างชัดเจนและกระชับ"),
  q("competency", 14, "communication", "Listens actively and nonjudgmentally.", "ฟังอย่างตั้งใจและโดยปราศจากการตัดสินว่าถูกหรือผิด"),
  q("competency", 15, "communication", "Responds appropriately to positive and negative feedback.", "ตอบสนองอย่างเหมาะสมต่อผลสะท้อนกลับทั้งทางบวกและทางลบ"),
  q("competency", 16, "communication", "Is aware of and sensitive to nonverbal messages.", "ตระหนักและรับรู้ได้ถึงการแสดงออกด้วยภาษาท่าทาง"),
  q("competency", 17, "communication", "Holds people's attention when communicating.", "ดึงความสนใจของผู้ฟังไว้ได้เมื่อสื่อสาร"),
  q("competency", 18, "communication", "Shares information willingly.", "เต็มใจแบ่งปันข้อมูล"),
  q("competency", 19, "communication", "Expresses own needs, opinions, and preferences without offending others.", "แสดงออกซึ่งความต้องการ ความคิดเห็น และความชื่นชอบ โดยไม่ทำให้ผู้อื่นขุ่นเคือง"),
  q("competency", 20, "communication", "Uses a variety of computer-based electronic resources to communicate.", "ใช้อุปกรณ์อิเล็กทรอนิกส์ที่หลากหลายในการสื่อสาร"),
  q("competency", 21, "diversity", "Encourages the inclusion of those who are different from self.", "กระตุ้นให้เกิดการรวมตัวกันของบุคคลที่มีความแตกต่างไปจากตนเอง"),
  q("competency", 22, "diversity", "Seeks to learn from those with different characteristics and perspectives.", "ค้นคว้าเพื่อเรียนรู้จากผู้ที่มีคุณลักษณะและมุมมองที่แตกต่างกัน"),
  q("competency", 23, "diversity", "Embraces and demonstrates respect for people of other cultures and races.", "เข้าใจและแสดงออกถึงความเคารพต่อบุคคลที่มีวัฒนธรรมและเชื้อชาติที่หลากหลาย"),
  q("competency", 24, "diversity", "Shows sensitivity to the needs and concerns of others.", "ใส่ใจถึงความต้องการและความกังวลของผู้อื่น"),
  q("competency", 25, "diversity", "Seeks positive win-win or appropriate compromise solutions to conflicts based on diversity issues.", "ค้นหาแนวทางการแก้ปัญหาที่เหมาะสมหรือได้ประโยชน์ทั้งสองฝ่ายในการแก้ไขความขัดแย้งที่เกิดจากความแตกต่างหลากหลาย"),
  q("competency", 26, "diversity", "Embraces unique individual and group characteristics as potential sources of organizational strength.", "รวบรวมคุณลักษณะเฉพาะของบุคคลและของกลุ่ม เพื่อผนึกรวมศักยภาพที่เป็นจุดแข็งขององค์กร"),
  q("competency", 27, "diversity", "Is sensitive to differences among people and seeks ways to work with them.", "ใส่ใจต่อความแตกต่างระหว่างบุคคลและหาวิธีการทำงานร่วมกับคนเหล่านั้น"),
  q("competency", 28, "diversity", "Respects ideas, values, and traditions of others.", "เคารพในความคิด คุณค่า และจารีตของผู้อื่น"),
  q("competency", 29, "diversity", "Identifies opportunities to promote diversity.", "มองเห็นโอกาสในการส่งเสริมความหลากหลาย"),
  q("competency", 30, "diversity", "Invests personal effort in helping people with attributes different from self to succeed.", "ให้ความช่วยเหลือบุคลากรที่มีลักษณะแตกต่างจากตนเองจนกระทั่งเขาประสบความสำเร็จ"),
  q("competency", 31, "ethics", "Demonstrates dignity and respect for others in working relationships.", "แสดงออกถึงการให้เกียรติและความเคารพผู้อื่นในการทำงานร่วมกัน"),
  q("competency", 32, "ethics", "Is honest and open in communication, limited only by privacy, legal, and competitive considerations.", "มีความซื่อสัตย์และเปิดเผยในการสื่อสาร ยกเว้นถ้าเป็นข้อจำกัดเรื่องความเป็นส่วนตัว กฎหมาย หรือการแข่งขัน"),
  q("competency", 33, "ethics", "Assesses the right or wrong in own decisions and behaviors.", "ประเมินความถูกหรือผิดในการตัดสินใจและพฤติกรรมของตนเอง"),
  q("competency", 34, "ethics", "Adheres to professional and organizational codes of conduct.", "ปฏิบัติตามมาตรฐานวิชาชีพและจริยธรรมขององค์กร"),
  q("competency", 35, "ethics", "Consistently avoids pressure from others to engage in unethical conduct.", "หลีกเลี่ยงแรงกดดันจากคนอื่นที่จะทำให้เกิดพฤติกรรมที่ไม่ถูกต้องหรือไม่มีจริยธรรม"),
  q("competency", 36, "ethics", "Understands ethical principles and rules.", "เข้าใจกฎและหลักเกณฑ์ทางจริยธรรม"),
  q("competency", 37, "ethics", "Is seen by others as a person of integrity.", "เป็นคนดีมีศีลธรรมในสายตาคนอื่น"),
  q("competency", 38, "ethics", "Sets clear expectations of ethical behavior and regularly reinforces this expectation with others.", "กำหนดความคาดหวังอย่างชัดเจนต่อพฤติกรรมที่มีจริยธรรม และสนับสนุนความคาดหวังนี้ต่อบุคคลอื่นเป็นประจำ"),
  q("competency", 39, "ethics", "Is sensitive to the rights of others.", "ใส่ใจและให้ความเคารพต่อสิทธิของผู้อื่น"),
  q("competency", 40, "ethics", "Takes responsibility for own decisions and actions and does not place blame on others to escape responsibility.", "มีความรับผิดชอบต่อการตัดสินใจและการกระทำของตัวเอง ไม่โยนความผิดหรือโทษคนอื่นเพื่อให้ตนเองหลุดพ้นความรับผิดชอบนั้น"),
  q("competency", 41, "acrossCultures", "Seeks to understand and appreciate the characteristics that make a particular culture unique.", "พยายามทำความเข้าใจและเห็นคุณค่าของคุณลักษณะที่ทำให้วัฒนธรรมหนึ่ง ๆ มีความโดดเด่นเป็นเอกลักษณ์"),
  q("competency", 42, "acrossCultures", "Treats people from different cultures with respect.", "ปฏิบัติต่อบุคคลที่มาจากวัฒนธรรมที่แตกต่างกันด้วยความเคารพ"),
  q("competency", 43, "acrossCultures", "Considers managerial and other issues from a worldwide perspective; thinks globally and acts locally.", "พิจารณาประเด็นบริหารและประเด็นอื่น ๆ จากมุมมองทั่วโลก คิดระดับโลกและปรับใช้กับบริบทท้องถิ่น"),
  q("competency", 44, "acrossCultures", "Works effectively with members from different cultures.", "ทำงานอย่างมีประสิทธิผลกับสมาชิกที่มาจากวัฒนธรรมที่แตกต่างกัน"),
  q("competency", 45, "acrossCultures", "Likes to experience different cultures.", "ชอบที่จะเรียนรู้กับวัฒนธรรมที่แตกต่างกัน"),
  q("competency", 46, "acrossCultures", "Learns from those with different cultural backgrounds.", "เรียนรู้จากบุคคลต่าง ๆ ที่มีพื้นฐานทางวัฒนธรรมที่หลากหลาย"),
  q("competency", 47, "acrossCultures", "Knows which cultures have the expectation that individuals are to take care of themselves.", "รู้ว่าวัฒนธรรมใดมีความคาดหวังว่าบุคคลต้องดูแลตัวเอง"),
  q("competency", 48, "acrossCultures", "Possesses firsthand knowledge that different cultures manage risk and uncertainty with rules.", "มีความรู้โดยตรงว่าวัฒนธรรมที่แตกต่างกันจัดการความเสี่ยงและความไม่แน่นอนด้วยกฎอย่างไร"),
  q("competency", 49, "acrossCultures", "Knows how masculinity and femininity in different societies affect interpersonal relationships.", "รู้ว่าความเป็นชายและความเป็นหญิงในสังคมที่แตกต่างกันส่งผลต่อความสัมพันธ์ระหว่างบุคคลอย่างไร"),
  q("competency", 50, "acrossCultures", "Works effectively with people from different cultures who value unequal distribution of power in society.", "ทำงานอย่างมีประสิทธิผลกับบุคคลที่มาจากวัฒนธรรมที่แตกต่างกัน ซึ่งให้คุณค่ากับความไม่เท่าเทียมกันในการกระจายอำนาจในสังคม"),
  q("competency", 51, "teams", "Works effectively in team situations.", "ทำงานเป็นทีมได้อย่างมีประสิทธิผล"),
  q("competency", 52, "teams", "Encourages teams to celebrate accomplishments.", "กระตุ้นให้ทีมมีการฉลองความสำเร็จร่วมกัน"),
  q("competency", 53, "teams", "Demonstrates mutual and personal responsibility for achieving team goals.", "แสดงออกถึงความร่วมมือและความรับผิดชอบส่วนบุคคลเพื่อบรรลุเป้าหมายของทีม"),
  q("competency", 54, "teams", "Observes dynamics when working with groups and raises relevant issues for discussion.", "สังเกตพลวัตเมื่อทำงานกับกลุ่มและนำเสนอประเด็นที่เกี่ยวข้องในการอภิปราย"),
  q("competency", 55, "teams", "Promotes teamwork among groups and discourages we-versus-they thinking.", "สนับสนุนการทำงานเป็นทีมในกลุ่ม และพยายามหลีกเลี่ยงความคิดแบบเรา-เขา"),
  q("competency", 56, "teams", "Supports and praises others for reaching goals and accomplishing tasks.", "สนับสนุนและชื่นชมคนอื่นเมื่อเขาบรรลุเป้าหมายหรือทำงานได้สำเร็จ"),
  q("competency", 57, "teams", "Encourages and supports creativity in teams.", "กระตุ้นและสนับสนุนความคิดสร้างสรรค์ในทีม"),
  q("competency", 58, "teams", "Shares credit with others.", "แบ่งปันความสำเร็จกับบุคคลอื่น"),
  q("competency", 59, "teams", "Motivates team members to work toward common goals.", "จูงใจหรือโน้มน้าวสมาชิกในทีมให้ทำงานเพื่อไปถึงเป้าหมายร่วมกัน"),
  q("competency", 60, "teams", "Is able to use groupware and related information technologies to achieve team goals.", "สามารถใช้ชุดคำสั่งและข้อมูลสารสนเทศที่เกี่ยวข้องเพื่อบรรลุเป้าหมายของทีม"),
  q("competency", 61, "change", "Demonstrates the leadership skills to implement planned change.", "แสดงออกถึงทักษะการเป็นผู้นำในการปฏิบัติการตามแผนที่เปลี่ยนแปลง"),
  q("competency", 62, "change", "Understands how to diagnose pressures for and resistances to change.", "ทำความเข้าใจและวิเคราะห์ถึงแรงกดดันและแรงต่อต้านการเปลี่ยนแปลง"),
  q("competency", 63, "change", "Prepares people to manage change.", "จัดเตรียมบุคลากรในการบริหารการเปลี่ยนแปลง"),
  q("competency", 64, "change", "Learns, shares, and applies new knowledge to improve a team, department, or whole organization.", "เรียนรู้ แบ่งปัน และประยุกต์ความรู้ในการพัฒนาทีม ฝ่ายงาน และองค์กรทั้งหมด"),
  q("competency", 65, "change", "Knows how to diagnose a firm's culture.", "วิเคราะห์วัฒนธรรมองค์กรได้"),
  q("competency", 66, "change", "Uses a variety of technologies to achieve successful change.", "ใช้เทคโนโลยีที่หลากหลายเพื่อให้บรรลุความสำเร็จในการเปลี่ยนแปลง"),
  q("competency", 67, "change", "Understands how various organizational designs can be used to bring about successful organizational change.", "เข้าใจว่าการออกแบบองค์กรที่มีความหลากหลายสามารถใช้เพื่อสร้างความสำเร็จในการเปลี่ยนแปลงองค์กรได้อย่างไร"),
  q("competency", 68, "change", "Possesses a positive attitude toward considering changes and new ideas.", "มีทัศนคติเชิงบวกต่อการเปลี่ยนแปลงและไอเดียใหม่ ๆ"),
  q("competency", 69, "change", "Is able to negotiate and resolve conflicts that are often part of any significant change.", "สามารถต่อรองหรือแก้ไขความขัดแย้งซึ่งมักจะเป็นส่วนหนึ่งของการเปลี่ยนแปลงที่สำคัญ"),
  q("competency", 70, "change", "Understands how organizational culture influences organizational change.", "เข้าใจว่าวัฒนธรรมองค์กรส่งผลให้เกิดการเปลี่ยนแปลงภายในองค์กรอย่างไร")
];

export const eqScale = [
  { value: 1, label: "ไม่เห็นด้วยอย่างยิ่ง" },
  { value: 2, label: "ไม่เห็นด้วย" },
  { value: 3, label: "เห็นด้วย" },
  { value: 4, label: "เห็นด้วยอย่างยิ่ง" }
];

export const competencyScaleAnchors = {
  1: "ไม่มีประสบการณ์ที่เกี่ยวข้อง และยังไม่ได้เริ่มพัฒนา",
  2: "มีประสบการณ์ที่เกี่ยวข้องเล็กน้อย แต่ประสบการณ์ยังไม่ดี",
  3: "อ่อนมาก",
  4: "อ่อน",
  5: "ค่อนข้างขาดความสามารถหรือพฤติกรรมนี้",
  6: "เกือบเพียงพอ",
  7: "ปานกลาง",
  8: "ดี",
  9: "ดีมาก",
  10: "ยอดเยี่ยม"
} as const;
