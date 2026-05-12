import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { UserStory } from "./gemini";

export async function exportToDocx(story: UserStory, lang: 'en' | 'ar' = 'en') {
  const t = {
    en: {
      description: "1. Description",
      mainFlow: "2. Main Flow",
      otherFlows: "3. Secondary Flows",
      acceptance: "4. Acceptance Criteria",
      business: "5. Business Rules",
      messages: "6. System Messages",
      mandatory: "7. Mandatory Fields",
      optional: "8. Optional Fields"
    },
    ar: {
      description: "1. الوصف",
      mainFlow: "2. التدفق الرئيسي",
      otherFlows: "3. التدفقات الثانوية",
      acceptance: "4. معايير القبول",
      business: "5. قواعد العمل",
      messages: "6. رسائل النظام",
      mandatory: "7. الحقول الإلزامية",
      optional: "8. الحقول الاختيارية"
    }
  }[lang];

  const doc = new Document({
    sections: [
      {
        properties: {
          column: {
            space: 708,
          },
        },
        children: [
          new Paragraph({
            text: story.title[lang],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Spacer

          new Paragraph({ text: t.description, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: story.description[lang] }),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.mainFlow, heading: HeadingLevel.HEADING_2 }),
          ...story.mainFlow[lang].map((step, index) => new Paragraph({ text: `${index + 1}. ${step}` })),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.otherFlows, heading: HeadingLevel.HEADING_2 }),
          ...story.otherFlows[lang].map((step, index) => new Paragraph({ text: `${index + 1}. ${step}` })),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.acceptance, heading: HeadingLevel.HEADING_2 }),
          ...story.acceptanceCriteria[lang].map(ac => new Paragraph({ text: `• ${ac}`, bullet: { level: 0 } })),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.business, heading: HeadingLevel.HEADING_2 }),
          ...story.businessRules[lang].map(br => new Paragraph({ text: `• ${br}`, bullet: { level: 0 } })),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.messages, heading: HeadingLevel.HEADING_2 }),
          ...story.systemMessages.flatMap(msg => [
            new Paragraph({ text: `• EN: ${msg.en}`, bullet: { level: 0 } }),
            new Paragraph({ text: `  AR: ${msg.ar}` })
          ]),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.mandatory, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: story.mandatoryFields.join(", ") }),

          new Paragraph({ text: "" }),
          new Paragraph({ text: t.optional, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: story.optionalFields.join(", ") }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${story.title[lang].replace(/\s+/g, "_")}_User_Story.docx`);
}
