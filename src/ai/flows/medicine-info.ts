
'use server';
/**
 * @fileOverview Provides detailed information about a specific medication.
 *
 * - getMedicineInfo - A function that handles the medicine information retrieval process.
 * - MedicineInfoInput - The input type for the getMedicineInfo function.
 * - MedicineInfoOutput - The return type for the getMedicineInfo function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Advanced Medicine Information with ML Recommendations
export async function medicineInfo(input: { 
  medicineName: string; 
  patientProfile?: any; 
  query: string 
}) {
  const { medicineName, patientProfile, query } = input;

  // Calculate BMI for dosing adjustments
  const bmi = patientProfile?.weight && patientProfile?.height 
    ? (patientProfile.weight / Math.pow(patientProfile.height / 100, 2)).toFixed(1)
    : null;

  const prompt = `
You are an advanced AI pharmacist with expertise in clinical pharmacology and personalized medicine.

MEDICINE: ${medicineName}
PATIENT PROFILE:
- Age: ${patientProfile?.age || 'Not specified'}
- Weight: ${patientProfile?.weight || 'Not specified'} kg
- Height: ${patientProfile?.height || 'Not specified'} cm
- BMI: ${bmi || 'Not calculated'}
- Gender: ${patientProfile?.gender || 'Not specified'}
- Medical Conditions: ${patientProfile?.medicalConditions?.join(', ') || 'None'}
- Current Medications: ${patientProfile?.currentMedications?.join(', ') || 'None'}
- Allergies: ${patientProfile?.allergies?.join(', ') || 'None'}
- Kidney Function: ${patientProfile?.kidneyFunction || 'Normal'}
- Liver Function: ${patientProfile?.liverFunction || 'Normal'}

QUERY: ${query}

Please provide comprehensive analysis including:

1. MEDICINE INFORMATION:
   - Generic name and drug class
   - Mechanism of action
   - Indications and contraindications
   - Common side effects

2. PERSONALIZED DOSING:
   - Recommended dose based on patient profile
   - Frequency and duration
   - Dose adjustments for age, weight, organ function
   - Required monitoring

3. DRUG INTERACTIONS:
   - Analysis of current medications
   - Severity of interactions
   - Recommendations for management

4. SAFETY ASSESSMENT:
   - Risk level for this patient
   - Specific warnings and precautions
   - Contraindications based on patient profile

Use evidence-based medicine and consider:
- Age-related pharmacokinetic changes
- Weight-based dosing adjustments
- Organ function modifications
- Drug-drug interactions
- Patient-specific risk factors
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 2000
  });

  const aiResponse = response.text();

  // Parse structured response
  const medicineMatch = aiResponse.match(/MEDICINE INFORMATION:(.*?)(?=PERSONALIZED DOSING:|$)/s);
  const dosingMatch = aiResponse.match(/PERSONALIZED DOSING:(.*?)(?=DRUG INTERACTIONS:|$)/s);
  const interactionsMatch = aiResponse.match(/DRUG INTERACTIONS:(.*?)(?=SAFETY ASSESSMENT:|$)/s);
  const safetyMatch = aiResponse.match(/SAFETY ASSESSMENT:(.*?)$/s);

  return {
    medicineInfo: {
      name: medicineName,
      genericName: 'Generic name based on analysis',
      drugClass: 'Drug class from analysis',
      mechanism: 'Mechanism of action',
      indications: medicineMatch ? medicineMatch[1].trim().split('\n').filter(Boolean) : [],
      contraindications: [],
      sideEffects: []
    },
    personalizedDosing: {
      recommendedDose: dosingMatch ? 'Dose from analysis' : 'Standard dose',
      frequency: 'As prescribed',
      duration: 'As needed',
      adjustments: dosingMatch ? dosingMatch[1].trim().split('\n').filter(Boolean) : [],
      monitoring: ['Regular follow-up required']
    },
    drugInteractions: {
      severity: interactionsMatch && interactionsMatch[1].includes('severe') ? 'high' : 'low',
      interactions: interactionsMatch ? interactionsMatch[1].trim().split('\n').filter(Boolean) : [],
      recommendations: ['Monitor for adverse effects']
    },
    safetyAssessment: {
      riskLevel: safetyMatch && safetyMatch[1].includes('high') ? 'high' : 'low',
      warnings: safetyMatch ? safetyMatch[1].trim().split('\n').filter(Boolean) : [],
      precautions: ['Follow doctor\'s instructions carefully']
    }
  };
}
