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

const getMedicalSummary = ai.defineTool(
  {
    name: 'getMedicalSummary',
    description: 'Returns a summary of a given medical topic and links to source documents.',
    inputSchema: z.object({
      topic: z.string().describe('The medical topic to summarize.'),
    }),
    outputSchema: z.object({
      summary: z.string().describe('A concise summary of the medical topic.'),
      sourceLinks: z.array(z.string()).describe('Links to the original source documents.'),
    }),
  },
  async (input) => {
    // Placeholder for API call and data retrieval. Replace with actual implementation.
    // Simulate an API call to an external medical information source.
    const summary = `This is a simulated summary of the medical topic: ${input.topic}. Replace with actual data.`;
    const sourceLinks = [
      'https://www.example.com/source1',
      'https://www.example.com/source2',
    ];

    return {summary, sourceLinks};
  }
);

const summarizeMedicalTopicPrompt = ai.definePrompt({
  name: 'summarizeMedicalTopicPrompt',
  tools: [getMedicalSummary],
  input: {schema: MedicalSummarizerInputSchema},
  output: {schema: MedicalSummarizerOutputSchema},
  prompt: `Summarize the following medical topic and provide links to source documents:

Topic: {{{topic}}}

Use the getMedicalSummary tool to retrieve the summary and source links.`,
});

const medicalSummarizerFlow = ai.defineFlow(
  {
    name: 'medicalSummarizerFlow',
    inputSchema: MedicalSummarizerInputSchema,
    outputSchema: MedicalSummarizerOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalTopicPrompt(input);
    return output!;
  }
);
