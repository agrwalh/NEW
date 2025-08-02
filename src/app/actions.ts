
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
import { getMedicineInfo } from '@/ai/flows/medicine-info';
import type { MedicineInfoOutput } from '@/ai/flows/medicine-info';
import { talkToCompanion } from '@/ai/flows/mental-health-agent';
import type { MentalHealthAgentOutput } from '@/ai/flows/mental-health-agent';


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

export async function getMedicineInfoAction(medicineName: string): Promise<{ data?: MedicineInfoOutput; error?: string }> {
  if (!medicineName || medicineName.trim().length < 2) {
    return { error: 'Please enter a medicine name with at least 2 characters.' };
  }
  try {
    const result = await getMedicineInfo({ medicineName });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while fetching medicine information. Please try again later.' };
  }
}

export async function talkToCompanionAction(prompt: string, history: string[]): Promise<{ data?: MentalHealthAgentOutput; error?: string }> {
  if (!prompt || prompt.trim().length === 0) {
    return { error: 'Please say something.' };
  }
  try {
    const result = await talkToCompanion({ prompt, history });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
