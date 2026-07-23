/**
 * Google Gemini AI integration for question review
 *
 * Required environment variable:
 *   GOOGLE_API_KEY → from https://aistudio.google.com/app/apikey (free)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIReviewResult {
  grammarIssues: string[];
  spellingIssues: string[];
  writingIssues: string[];
  correctAnswerCheck: string;
  overallSuggestion: string;
  isApproved: boolean;
}

const REVIEW_PROMPT = `
You are an expert English teacher and quiz editor. Review the following quiz question for a secondary school English festival on the topic "Violence Is Never The Answer".

Analyze:
1. Grammar correctness of the question and all options
2. Spelling errors in the question and all options
3. Writing clarity and academic appropriateness
4. Whether the marked correct answer (option {CORRECT}) actually makes sense as THE correct answer given the question text

Respond ONLY with a valid JSON object in this exact format:
{
  "grammarIssues": ["issue 1", "issue 2"],
  "spellingIssues": ["issue 1"],
  "writingIssues": ["issue 1"],
  "correctAnswerCheck": "Brief assessment of whether the correct answer is appropriate",
  "overallSuggestion": "One concise overall suggestion or 'The question looks good.' if no changes needed.",
  "isApproved": true
}

Set "isApproved" to false if there are any grammar, spelling, or writing issues, or if the correct answer seems wrong.
Set "isApproved" to true only if everything looks correct.

QUESTION:
{QUESTION}

OPTION A: {OPTION_A}
OPTION B: {OPTION_B}
OPTION C: {OPTION_C}
OPTION D: {OPTION_D}
MARKED CORRECT: Option {CORRECT}
`;

/**
 * Reviews a quiz question using Google Gemini AI.
 * Returns structured feedback on grammar, spelling, and answer validity.
 */
export async function reviewQuestionWithAI(params: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}): Promise<AIReviewResult> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      grammarIssues: [],
      spellingIssues: [],
      writingIssues: [],
      correctAnswerCheck: "AI review unavailable – GOOGLE_API_KEY not configured.",
      overallSuggestion: "Please configure the GOOGLE_API_KEY environment variable to enable AI review.",
      isApproved: true,
    };
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = REVIEW_PROMPT
    .replace("{QUESTION}", params.question)
    .replace("{OPTION_A}", params.optionA)
    .replace("{OPTION_B}", params.optionB)
    .replace("{OPTION_C}", params.optionC)
    .replace("{OPTION_D}", params.optionD)
    .replace(/{CORRECT}/g, params.correctOption);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response (Gemini sometimes adds markdown fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    return JSON.parse(jsonMatch[0]) as AIReviewResult;
  } catch (error) {
    console.error("AI review error:", error);
    return {
      grammarIssues: [],
      spellingIssues: [],
      writingIssues: [],
      correctAnswerCheck: "Could not complete AI review.",
      overallSuggestion: "An error occurred during AI review. You can still save the question manually.",
      isApproved: true,
    };
  }
}
