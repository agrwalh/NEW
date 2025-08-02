
'use server';

import { analyzeSymptoms } from '@/ai/flows/symptom-analyzer';
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';
import { medicalSummarizer } from '@/ai/flows/medical-summarizer';
import type { MedicalSummarizerOutput } from '@/ai/flows/medical-summarizer';
import { talkToDoctor } from '@/ai/flows/doctor-agent';
import type { DoctorAgentOutput } from '@/ai/flows/doctor-agent';
import { analyzeSkinLesion } from '@/ai/flows/skin-lesion-analyzer';
import type { SkinLesionAnalyzerOutput } from '@/ai/flows/skin-lesion-analyzer';
import { generatePrescription } from '@/ai/flows/prescription-generator';
import type { PrescriptionGeneratorInput, PrescriptionGeneratorOutput } from '@/ai/flows/prescription-generator';


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

export async function talkToDoctorAction(prompt: string): Promise<{ data?: DoctorAgentOutput; error?: string }> {
  if (!prompt || prompt.trim().length === 0) {
    return { error: 'Please say something to the doctor.' };
  }
  try {
    const result = await talkToDoctor({ prompt });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while talking to the doctor. Please try again later.' };
  }
}

export async function analyzeSkinLesionAction(photoDataUri: string): Promise<{ data?: SkinLesionAnalyzerOutput; error?: string }> {
  if (!photoDataUri) {
    return { error: 'Please upload an image.' };
  }
  try {
    const result = await analyzeSkinLesion({ photoDataUri });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while analyzing the image. Please try again later.' };
  }
}

export async function generatePrescriptionAction(input: PrescriptionGeneratorInput): Promise<{ data?: PrescriptionGeneratorOutput; error?: string }> {
  try {
    const result = await generatePrescription(input);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating the prescription. Please try again later.' };
  }
}
