// Medical summarizer flow
'use server';
/**
 * @fileOverview Summarizes medical topics using external API and provides source links.
 *
 * - medicalSummarizer - A function that summarizes medical topics.
 * - MedicalSummarizerInput - The input type for the medicalSummarizer function.
 * - MedicalSummarizerOutput - The return type for the medicalSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalSummarizerInputSchema = z.object({
  topic: z.string().describe('The medical topic to summarize.'),
});
export type MedicalSummarizerInput = z.infer<typeof MedicalSummarizerInputSchema>;

const MedicalSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the medical topic.'),
  sourceLinks: z.array(z.string()).describe('Links to the original source documents.'),
});
export type MedicalSummarizerOutput = z.infer<typeof MedicalSummarizerOutputSchema>;

export async function medicalSummarizer(input: MedicalSummarizerInput): Promise<MedicalSummarizerOutput> {
  return medicalSummarizerFlow(input);
}

const summarizeMedicalTopicPrompt = ai.definePrompt({
  name: 'summarizeMedicalTopicPrompt',
  input: {schema: MedicalSummarizerInputSchema},
  output: {schema: MedicalSummarizerOutputSchema},
  prompt: `You are a helpful medical research assistant. Summarize the following medical topic and provide at least 2 links to reputable source documents.

Topic: {{{topic}}}`,
});

const medicalSummarizerFlow = ai.defineFlow(
  {
    name: 'medicalSummarizerFlow',
    inputSchema: MedicalSummarizerInputSchema,
    outputSchema: MedicalSummarizerOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalTopicPrompt(input);
    if (!output) {
        throw new Error("Unable to generate summary");
    }
    // Handle cases where no links are returned
    if (!output.sourceLinks || output.sourceLinks.length === 0) {
      return {
        ...output,
        sourceLinks: [
          'https://www.mayoclinic.org/search/search-results?q=' + encodeURIComponent(input.topic),
          'https://medlineplus.gov/search.html?query=' + encodeURIComponent(input.topic),
        ]
      }
    }
    return output;
  }
);
