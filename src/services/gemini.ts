import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface BilingualContent {
  en: string;
  ar: string;
}

export interface BilingualList {
  en: string[];
  ar: string[];
}

export interface UserStory {
  title: BilingualContent;
  description: BilingualContent;
  mainFlow: BilingualList;
  otherFlows: BilingualList;
  acceptanceCriteria: BilingualList;
  mandatoryFields: string[]; // Field names usually stay tech-neutral or English in specs, but I'll provide translations if helpful.
  optionalFields: string[];
  businessRules: BilingualList;
  systemMessages: {
    en: string;
    ar: string;
  }[];
  complexity: 'Low' | 'Medium' | 'High';
}

export async function generateUserStory(title: string): Promise<UserStory> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write an extremely professional, comprehensive, and production-ready user story for the following title: "${title}". 
    
    You MUST provide the content in both English and Arabic.
    
    CRITICAL REQUIREMENTS:
    1. THE STORY: Use the standard "As a [persona], I want [action], so that [value]" format.
    2. PREDICT SCENARIOS: Deeply analyze the title. Include not just the happy path, but also edge cases, error scenarios, and alternate paths. For actions like "Delete Account", ensure you include data retention, confirmation steps, and impacts on related data.
    3. MAIN FLOW: Provide a detailed, step-by-step sequential flow of the primary transaction/action.
    4. OTHER FLOWS: List at least 2-3 alternate or error flows (e.g., "User cancels mid-way", "Network error occurs", "Session timeouts").
    5. ACCEPTANCE CRITERIA: Write clear, testable, and exhaustive criteria using the Gherkin-style logic (Given/When/Then) where applicable.
    6. BUSINESS RULES: Include strict logic, constraints, and validation rules (e.g., "Username must be unique", "Prices cannot be negative", "Only users with 'Admin' role can approve").
    7. FIELDS: Identify ONLY the necessary data points. Avoid unnecessary fields. If a section (Mandatory or Optional) truly has no fields, return ["No fields"].
    8. SYSTEM MESSAGES: Predict all system-generated feedback, including Success, Warning, Error (validation, system, permissions), and Confirmation messages.
    9. ARABIC CONTENT: Ensure the Arabic translation is perfectly natural for a technical product manager, avoiding literal translations and using industry-standard Arabic UX terminology.
    
    Format the response as a JSON object with the following structure:
    - title: { en: "English title", ar: "Arabic title" }
    - description: { en: "As a... I want... So that...", ar: "بصفتي... أريد... بحيث..." }
    - mainFlow: { en: ["step 1", "step 2"], ar: ["الخطوة 1", "الخطوة 2"] }
    - otherFlows: { en: ["step 1"], ar: ["الخطوة 1"] }
    - acceptanceCriteria: { en: ["criteria 1"], ar: ["معيار 1"] }
    - businessRules: { en: ["rule 1"], ar: ["قاعدة 1"] }
    - mandatoryFields: ["Field Name 1", "Field Name 2"]
    - optionalFields: ["Field Name 1"]
    - systemMessages: [{ en: "Success message", ar: "رسالة النجاح" }]
    - complexity: "Low" | "Medium" | "High"
    
    Ensure the Arabic translation is professional and uses correct technical terminology.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.OBJECT,
            properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
            required: ["en", "ar"]
          },
          description: {
            type: Type.OBJECT,
            properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
            required: ["en", "ar"]
          },
          mainFlow: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.ARRAY, items: { type: Type.STRING } },
              ar: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["en", "ar"]
          },
          otherFlows: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.ARRAY, items: { type: Type.STRING } },
              ar: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["en", "ar"]
          },
          acceptanceCriteria: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.ARRAY, items: { type: Type.STRING } },
              ar: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["en", "ar"]
          },
          businessRules: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.ARRAY, items: { type: Type.STRING } },
              ar: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["en", "ar"]
          },
          mandatoryFields: { type: Type.ARRAY, items: { type: Type.STRING } },
          optionalFields: { type: Type.ARRAY, items: { type: Type.STRING } },
          systemMessages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                ar: { type: Type.STRING }
              },
              required: ["en", "ar"]
            }
          },
          complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        },
        required: ["title", "description", "mainFlow", "otherFlows", "acceptanceCriteria", "businessRules", "mandatoryFields", "optionalFields", "systemMessages", "complexity"]
      }
    }
  });

  const storyData = JSON.parse(response.text);
  return storyData;
}
