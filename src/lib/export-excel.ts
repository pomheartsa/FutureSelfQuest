import type { Row, Worksheet } from "exceljs";
import {
  chapters,
  competencyScaleAnchors,
  eqScale,
  questions,
  type ChapterId,
  type Question
} from "./assessment";
import type { AnswerMap, CategoryScore, ProfileResult } from "./scoring";

type ExportPartWorkbookOptions = {
  playerName: string;
  chapterId: ChapterId;
  answers: AnswerMap;
  profile: ProfileResult;
};

const colors = {
  navy: "24324B",
  blue: "2F6FB6",
  teal: "168E8A",
  amber: "E0A93D",
  paleBlue: "EAF3FF",
  paleGray: "F6F9FC",
  border: "CDDDF0",
  white: "FFFFFF",
  muted: "61799B"
};

const partAccent: Record<ChapterId, string> = {
  eq: colors.blue,
  bigFive: colors.teal,
  competency: colors.amber
};

const partSlug: Record<ChapterId, string> = {
  eq: "EQ",
  bigFive: "BIG-5",
  competency: "PRO"
};

function safePlayerName(playerName: string) {
  return (playerName || "Player One")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "Player-One";
}

function answerLabel(question: Question, answer: number | undefined) {
  if (answer === undefined) return "";

  if (question.kind === "eq") {
    return eqScale.find((option) => option.value === answer)?.label ?? "";
  }

  if (question.kind === "competency") {
    return competencyScaleAnchors[answer as keyof typeof competencyScaleAnchors] ?? "";
  }

  if (answer === 5) return `${question.leftTh || question.left} (${question.left})`;
  if (answer === 4) return `เอนฝั่งซ้าย: ${question.leftTh || question.left} (${question.left})`;
  if (answer === 3) return "พอ ๆ กัน / กึ่งกลาง";
  if (answer === 2) return `เอนฝั่งขวา: ${question.rightTh || question.right} (${question.right})`;
  if (answer === 1) return `${question.rightTh || question.right} (${question.right})`;
  return "";
}

function styleTitle(worksheet: Worksheet, columnCount: number, accent: string) {
  worksheet.mergeCells(1, 1, 1, columnCount);
  const title = worksheet.getCell(1, 1);
  title.font = { name: "Aptos Display", size: 18, bold: true, color: { argb: colors.white } };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: accent } };
  title.alignment = { vertical: "middle", horizontal: "left" };
  worksheet.getRow(1).height = 34;
}

function styleMetadata(worksheet: Worksheet, columnCount: number) {
  for (let rowNumber = 2; rowNumber <= 4; rowNumber += 1) {
    worksheet.mergeCells(rowNumber, 2, rowNumber, columnCount);
    worksheet.getCell(rowNumber, 1).font = { bold: true, color: { argb: colors.muted } };
    worksheet.getCell(rowNumber, 2).font = { bold: true, color: { argb: colors.navy } };
  }
}

function styleHeader(row: Row, accent: string) {
  row.height = 32;
  row.eachCell((cell) => {
    cell.font = { name: "Aptos", size: 10, bold: true, color: { argb: colors.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: accent } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
}

function styleDataRows(
  worksheet: Worksheet,
  startRow: number,
  endRow: number,
  options: { rowHeight?: number; leftAlignedColumns?: number[] } = {}
) {
  const rowHeight = options.rowHeight ?? 66;
  const leftAlignedColumns = options.leftAlignedColumns ?? [1, 2, 3, 4, 5, 6];

  for (let rowNumber = startRow; rowNumber <= endRow; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    row.height = rowHeight;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.font = { name: "Aptos", size: 10, color: { argb: colors.navy } };
      cell.alignment = {
        vertical: "top",
        horizontal: leftAlignedColumns.includes(columnNumber) ? "left" : "center",
        wrapText: true
      };
      cell.border = { bottom: { style: "thin", color: { argb: colors.border } } };
      if (rowNumber % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.paleGray } };
      }
    });
  }
}

function responseHeaders(chapterId: ChapterId) {
  const headers = [
    "ข้อ",
    "รหัสคำถาม",
    "หมวดหมู่ (ไทย)",
    "Category (EN)",
    "คำถาม (ไทย)",
    "Question (EN)"
  ];

  if (chapterId === "bigFive") {
    headers.push("ฝั่ง 5 (ไทย)", "Side 5 (EN)", "ฝั่ง 1 (ไทย)", "Side 1 (EN)");
  }

  headers.push(
    "คะแนนคำตอบ",
    "ความหมายคำตอบ",
    "คะแนนดิบหมวด",
    "คะแนนเต็มหมวด",
    "Norm",
    "Power (0-100)",
    "ระดับ"
  );

  return headers;
}

function responseRow(question: Question, answers: AnswerMap, score?: CategoryScore) {
  const row: Array<string | number | undefined> = [
    question.item,
    question.id,
    score?.labelTh,
    score?.label,
    question.promptTh,
    question.prompt
  ];

  if (question.kind === "bigFive") {
    row.push(question.leftTh, question.left, question.rightTh, question.right);
  }

  const answer = answers[question.id];
  row.push(
    answer,
    answerLabel(question, answer),
    score?.raw,
    score?.max,
    score?.normScore,
    score?.percent,
    score?.levelLabel
  );

  return row;
}

function setResponseColumnWidths(worksheet: Worksheet, chapterId: ChapterId) {
  const widths = chapterId === "bigFive"
    ? [7, 16, 24, 22, 34, 34, 24, 24, 24, 24, 14, 34, 16, 16, 12, 16, 18]
    : [7, 16, 24, 22, 48, 48, 14, 34, 16, 16, 12, 16, 18];

  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
}

function addResponseSheet(
  workbook: import("exceljs").Workbook,
  chapterId: ChapterId,
  playerName: string,
  answers: AnswerMap,
  scores: CategoryScore[]
) {
  const chapter = chapters.find((item) => item.id === chapterId);
  if (!chapter) throw new Error(`Unknown chapter: ${chapterId}`);

  const partQuestions = questions.filter((question) => question.chapterId === chapterId);
  const scoreByKey = new Map(scores.map((score) => [score.key, score]));
  const headers = responseHeaders(chapterId);
  const worksheet = workbook.addWorksheet("คำตอบรายข้อ", {
    views: [{ state: "frozen", ySplit: 6, showGridLines: false }]
  });

  worksheet.addRow([`Future Self Quest - ${chapter.short} คำตอบรายข้อ`]);
  worksheet.addRow(["ผู้ทำแบบประเมิน", playerName || "Player One"]);
  worksheet.addRow(["ส่วนแบบประเมิน", `${chapter.short} - ${chapter.titleTh}`]);
  worksheet.addRow(["ช่วงคะแนน", chapter.scale]);
  worksheet.addRow([]);
  worksheet.addRow(headers);

  partQuestions.forEach((question) => {
    worksheet.addRow(responseRow(question, answers, scoreByKey.get(question.category)));
  });

  styleTitle(worksheet, headers.length, partAccent[chapterId]);
  styleMetadata(worksheet, headers.length);
  styleHeader(worksheet.getRow(6), partAccent[chapterId]);
  styleDataRows(worksheet, 7, 6 + partQuestions.length);
  setResponseColumnWidths(worksheet, chapterId);
  worksheet.autoFilter = {
    from: { row: 6, column: 1 },
    to: { row: 6 + partQuestions.length, column: headers.length }
  };
}

function addSummarySheet(
  workbook: import("exceljs").Workbook,
  chapterId: ChapterId,
  playerName: string,
  scores: CategoryScore[]
) {
  const chapter = chapters.find((item) => item.id === chapterId);
  if (!chapter) throw new Error(`Unknown chapter: ${chapterId}`);

  const headers = [
    "หมวดหมู่ (ไทย)",
    "Category (EN)",
    "คะแนนดิบ",
    "คะแนนเต็ม",
    "Norm",
    "Power (0-100)",
    "ระดับ",
    "คำอธิบาย"
  ];
  const worksheet = workbook.addWorksheet("สรุปคะแนน", {
    views: [{ state: "frozen", ySplit: 6, showGridLines: false }]
  });

  worksheet.addRow([`Future Self Quest - ${chapter.short} สรุปคะแนน`]);
  worksheet.addRow(["ผู้ทำแบบประเมิน", playerName || "Player One"]);
  worksheet.addRow(["ส่วนแบบประเมิน", `${chapter.short} - ${chapter.titleTh}`]);
  worksheet.addRow(["ช่วงคะแนน", chapter.scale]);
  worksheet.addRow([]);
  worksheet.addRow(headers);

  scores.forEach((score) => {
    worksheet.addRow([
      score.labelTh,
      score.label,
      score.raw,
      score.max,
      score.normScore,
      score.percent,
      score.levelLabel,
      score.note
    ]);
  });

  const dataStartRow = 7;
  const dataEndRow = dataStartRow + scores.length - 1;
  const totalRowNumber = dataEndRow + 2;
  const rawTotal = scores.reduce((sum, score) => sum + score.raw, 0);
  const maxTotal = scores.reduce((sum, score) => sum + score.max, 0);
  const averagePower = Math.round(
    scores.reduce((sum, score) => sum + score.percent, 0) / Math.max(scores.length, 1)
  );

  worksheet.getCell(totalRowNumber, 1).value = "สรุปรวม Part";
  worksheet.getCell(totalRowNumber, 3).value = {
    formula: `SUM(C${dataStartRow}:C${dataEndRow})`,
    result: rawTotal
  };
  worksheet.getCell(totalRowNumber, 4).value = {
    formula: `SUM(D${dataStartRow}:D${dataEndRow})`,
    result: maxTotal
  };
  worksheet.getCell(totalRowNumber, 6).value = {
    formula: `ROUND(AVERAGE(F${dataStartRow}:F${dataEndRow}),0)`,
    result: averagePower
  };

  styleTitle(worksheet, headers.length, partAccent[chapterId]);
  styleMetadata(worksheet, headers.length);
  styleHeader(worksheet.getRow(6), partAccent[chapterId]);
  styleDataRows(worksheet, dataStartRow, dataEndRow, {
    rowHeight: 42,
    leftAlignedColumns: [1, 2, 8]
  });

  const totalRow = worksheet.getRow(totalRowNumber);
  totalRow.height = 30;
  for (let columnNumber = 1; columnNumber <= headers.length; columnNumber += 1) {
    const cell = totalRow.getCell(columnNumber);
    cell.font = { name: "Aptos", size: 11, bold: true, color: { argb: colors.navy } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.paleBlue } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  }

  [28, 24, 14, 14, 12, 16, 18, 54].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
  worksheet.autoFilter = {
    from: { row: 6, column: 1 },
    to: { row: dataEndRow, column: headers.length }
  };
}

function downloadWorkbook(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function exportPartWorkbook({
  playerName,
  chapterId,
  answers,
  profile
}: ExportPartWorkbookOptions) {
  const chapterScores = profile.categoryScores.filter((score) => {
    const categoryQuestions = questions.filter((question) => question.category === score.key);
    return categoryQuestions.some((question) => question.chapterId === chapterId);
  });

  const excelJsModule = await import("exceljs");
  const workbook = new excelJsModule.default.Workbook();
  workbook.creator = "Future Self Quest";
  workbook.subject = `${partSlug[chapterId]} assessment scores`;
  workbook.calcProperties.fullCalcOnLoad = true;

  addResponseSheet(workbook, chapterId, playerName, answers, chapterScores);
  addSummarySheet(workbook, chapterId, playerName, chapterScores);

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `Future-Self-Quest-${safePlayerName(playerName)}-${partSlug[chapterId]}.xlsx`;
  downloadWorkbook(buffer, filename);
}
