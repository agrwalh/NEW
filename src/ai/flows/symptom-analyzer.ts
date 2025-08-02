'use server';

/**
 * @fileOverview An AI agent that analyzes symptoms and provides potential causes with detailed analysis.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - SymptomAnalyzerInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalyzerOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalyzerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A list of symptoms the user is experiencing.'),
});
export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;

const SymptomAnalysisSchema = z.object({
    condition: z.string().describe("A potential condition explaining the symptoms."),
    description: z.string().describe("A brief description of this condition."),
    severity: z.enum(["Mild", "Moderate", "Severe", "Critical"]).describe("The potential severity of the condition."),
    nextSteps: z.string().describe("Recommended next steps for the user (e.g., 'Rest and drink fluids', 'Consult a doctor within a few days', 'Seek immediate medical attention')."),
});

const SymptomAnalyzerOutputSchema = z.object({
  analysis: z.array(SymptomAnalysisSchema).describe("A list of potential conditions and their analysis. Provide at least 2-3 potential causes."),
  urgency: z.enum(["Low", "Medium", "High", "Immediate"]).describe("An overall assessment of urgency for seeking medical attention based on the most severe potential condition."),
  disclaimer: z.string().describe("A disclaimer that this is not a medical diagnosis and a healthcare professional should be consulted."),
});
export type SymptomAnalyzerOutput = z.infer<typeof SymptomAnalyzerOutputSchema>;

export async function analyzeSymptoms(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are a medical expert specializing in symptom analysis. Your role is to provide a preliminary analysis based on user-provided symptoms. You are not a medical professional and your analysis is not a diagnosis.

Analyze the provided symptoms and generate a list of 2-3 potential conditions. For each condition, provide a brief description, an assessment of its potential severity, and clear, actionable next steps. Also provide an overall urgency assessment.

IMPORTANT: Your response must always begin with a clear disclaimer that this is not a medical diagnosis and a healthcare professional should be consulted for any health concerns.

Symptoms: {{{symptoms}}}
`,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalyzerInputSchema,
    outputSchema: SymptomAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Symptom analysis failed to generate a response.");
    }
    return output;
  }
);
