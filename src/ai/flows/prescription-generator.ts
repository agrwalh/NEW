
'use server';
/**
 * @fileOverview An AI agent that generates a sample medical prescription based on symptoms.
 *
 * - generatePrescription - A function that handles the prescription generation process.
 * - PrescriptionGeneratorInput - The input type for the generatePrescription function.
 * - PrescriptionGeneratorOutput - The return type for the generatePrescription function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Prescription Generator with ML capabilities
export async function prescriptionGenerator(input: {
  name: string;
  age: number;
  gender: string;
  symptoms: string;
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
}) {
  const { name, age, gender, symptoms, medicalHistory, allergies, currentMedications } = input;

  const prompt = `
You are an advanced AI medical assistant with expertise in prescription generation and medication management.

PATIENT INFORMATION:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptoms}
- Medical History: ${medicalHistory?.join(', ') || 'None'}
- Allergies: ${allergies?.join(', ') || 'None'}
- Current Medications: ${currentMedications?.join(', ') || 'None'}

Please provide comprehensive prescription analysis including:

1. DIAGNOSIS:
   - Likely diagnosis based on symptoms
   - Differential diagnosis considerations
   - Severity assessment

2. MEDICATIONS:
   - Appropriate medications with dosages
   - Frequency and duration
   - Special instructions
   - Drug interaction considerations

3. PRECAUTIONS:
   - Lifestyle recommendations
   - Monitoring requirements
   - Warning signs to watch for

4. FOLLOW-UP:
   - When to see a doctor
   - Monitoring schedule
   - Emergency situations

IMPORTANT: Include a strong disclaimer that this is AI-generated and requires medical consultation.
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 2000
  });

  const aiResponse = response.text();

  // Parse structured response
  const diagnosisMatch = aiResponse.match(/DIAGNOSIS:(.*?)(?=MEDICATIONS:|$)/s);
  const medicationsMatch = aiResponse.match(/MEDICATIONS:(.*?)(?=PRECAUTIONS:|$)/s);
  const precautionsMatch = aiResponse.match(/PRECAUTIONS:(.*?)(?=FOLLOW-UP:|$)/s);
  const followUpMatch = aiResponse.match(/FOLLOW-UP:(.*?)$/s);

  return {
    patientName: name,
    age: age,
    gender: gender,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    diagnosis: diagnosisMatch ? diagnosisMatch[1].trim() : 'Based on symptoms analysis',
    medicines: [
      {
        name: 'Sample Medication',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        instructions: 'Take with food'
      }
    ],
    precautions: precautionsMatch ? precautionsMatch[1].trim().split('\n').filter(Boolean) : [],
    followUp: followUpMatch ? followUpMatch[1].trim() : 'Schedule follow-up within 1 week',
    disclaimer: 'This is an AI-generated sample prescription and should not be used without consulting a qualified healthcare professional.'
  };
}
