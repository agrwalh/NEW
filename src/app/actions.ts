
'use server';

import { analyzeSymptoms } from '@/ai/flows/symptom-analyzer';
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';
import { medicalSummarizer } from '@/ai/flows/medical-summarizer';
import type { MedicalSummarizerOutput } from '@/ai/flows/medical-summarizer';

export async function analyzeSymptomsAction(symptoms: string): Promise<{ data?: SymptomAnalyzerOutput; error?: string }> {
  if (!symptoms || symptoms.trim().length < 10) {
    return { error: 'Please describe your symptoms in at least 10 characters.' };
  }
  try {
    const result = await analyzeSymptoms({ symptoms });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while analyzing symptoms. Please try again later.' };
  }
}


export async function summarizeTopicAction(topic: string): Promise<{ data?: MedicalSummarizerOutput; error?: string }> {
  if (!topic || topic.trim().length < 3) {
    return { error: 'Please enter a topic with at least 3 characters.' };
  }
  try {
    const result = await medicalSummarizer({ topic });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while summarizing the topic. Please try again later.' };
  }
}
