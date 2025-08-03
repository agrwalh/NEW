
'use server';

import { symptomAnalyzer } from '@/ai/flows/symptom-analyzer';
import { medicalSummarizer } from '@/ai/flows/medical-summarizer';
import { doctorAgent } from '@/ai/flows/doctor-agent';
import { skinLesionAnalyzer } from '@/ai/flows/skin-lesion-analyzer';
import { prescriptionGenerator } from '@/ai/flows/prescription-generator';
import { medicineInfo } from '@/ai/flows/medicine-info';
import { mentalHealthAgent } from '@/ai/flows/mental-health-agent';

export async function analyzeSymptomsAction(symptoms: string): Promise<{ data?: any; error?: string }> {
  if (!symptoms || symptoms.trim().length < 10) {
    return { error: 'Please describe your symptoms in at least 10 characters.' };
  }
  try {
    const result = await symptomAnalyzer({ symptoms });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while analyzing symptoms. Please try again later.' };
  }
}

export async function summarizeTopicAction(topic: string): Promise<{ data?: any; error?: string }> {
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

export async function talkToDoctorAction(userMessage: string, userProfile?: any, conversationHistory?: any[]): Promise<{ data?: any; error?: string }> {
  if (!userMessage || userMessage.trim().length === 0) {
    return { error: 'Please say something to the doctor.' };
  }
  try {
    const result = await doctorAgent({ userMessage, userProfile, conversationHistory });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while talking to the doctor. Please try again later.' };
  }
}

export async function analyzeSkinLesionAction(image: string, patientInfo?: any): Promise<{ data?: any; error?: string }> {
  if (!image) {
    return { error: 'Please upload an image.' };
  }
  try {
    const result = await skinLesionAnalyzer({ image, patientInfo });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while analyzing the image. Please try again later.' };
  }
}

export async function generatePrescriptionAction(input: any): Promise<{ data?: any; error?: string }> {
  try {
    const result = await prescriptionGenerator(input);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating the prescription. Please try again later.' };
  }
}

export async function getMedicineInfoAction(medicineName: string, patientProfile?: any, query?: string): Promise<{ data?: any; error?: string }> {
  if (!medicineName || medicineName.trim().length < 2) {
    return { error: 'Please enter a medicine name with at least 2 characters.' };
  }
  try {
    const result = await medicineInfo({ medicineName, patientProfile, query });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while fetching medicine information. Please try again later.' };
  }
}

export async function talkToCompanionAction(prompt: string, history: string[]): Promise<{ data?: any; error?: string }> {
  if (!prompt || prompt.trim().length === 0) {
    return { error: 'Please say something.' };
  }
  try {
    const result = await mentalHealthAgent({ prompt, history });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
