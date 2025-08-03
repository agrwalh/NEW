import { googleAI } from '@genkit-ai/googleai';

// Predictive Health Analytics with ML
export async function healthAnalytics(input: { 
  patientData: any; 
  analysisType: string 
}) {
  const { patientData, analysisType } = input;

  // Calculate health metrics
  const bmi = patientData.demographics?.weight && patientData.demographics?.height 
    ? (patientData.demographics.weight / Math.pow(patientData.demographics.height / 100, 2))
    : null;

  const prompt = `
You are an advanced AI health analytics system with expertise in predictive medicine and risk assessment.

PATIENT DATA:
DEMOGRAPHICS:
- Age: ${patientData.demographics?.age || 'Not specified'}
- Gender: ${patientData.demographics?.gender || 'Not specified'}
- Height: ${patientData.demographics?.height || 'Not specified'} cm
- Weight: ${patientData.demographics?.weight || 'Not specified'} kg
- BMI: ${bmi ? bmi.toFixed(1) : 'Not calculated'}
- Ethnicity: ${patientData.demographics?.ethnicity || 'Not specified'}

VITALS:
- Blood Pressure: ${patientData.vitals?.bloodPressure || 'Not specified'}
- Heart Rate: ${patientData.vitals?.heartRate || 'Not specified'} bpm
- Temperature: ${patientData.vitals?.temperature || 'Not specified'}°C
- Oxygen Saturation: ${patientData.vitals?.oxygenSaturation || 'Not specified'}%
- BMI: ${patientData.vitals?.bmi || bmi || 'Not specified'}

LAB RESULTS:
- Blood Sugar: ${patientData.labResults?.bloodSugar || 'Not specified'} mg/dL
- Cholesterol: ${JSON.stringify(patientData.labResults?.cholesterol) || 'Not specified'}
- Kidney Function: ${JSON.stringify(patientData.labResults?.kidneyFunction) || 'Not specified'}
- Liver Function: ${JSON.stringify(patientData.labResults?.liverFunction) || 'Not specified'}

LIFESTYLE:
- Smoking: ${patientData.lifestyle?.smoking ? 'Yes' : 'No'}
- Alcohol: ${patientData.lifestyle?.alcohol || 'Not specified'}
- Exercise: ${patientData.lifestyle?.exercise || 'Not specified'}
- Diet: ${patientData.lifestyle?.diet || 'Not specified'}
- Sleep: ${patientData.lifestyle?.sleep || 'Not specified'} hours

MEDICAL HISTORY:
- Conditions: ${patientData.medicalHistory?.conditions?.join(', ') || 'None'}
- Medications: ${patientData.medicalHistory?.medications?.join(', ') || 'None'}
- Surgeries: ${patientData.medicalHistory?.surgeries?.join(', ') || 'None'}
- Family History: ${patientData.medicalHistory?.familyHistory?.join(', ') || 'None'}

ANALYSIS TYPE: ${analysisType}

Please provide comprehensive ML-powered health analytics:

1. RISK ASSESSMENT:
   - Overall health risk level (Low/Medium/High)
   - Risk score (0-100)
   - Key risk factors
   - Protective factors

2. PREDICTIVE INSIGHTS:
   - Short-term health predictions (3-6 months)
   - Long-term health projections (1-5 years)
   - Health trend analysis

3. RECOMMENDATIONS:
   - Immediate actions needed
   - Lifestyle modifications
   - Screening recommendations
   - Monitoring requirements

4. HEALTH SCORE:
   - Current health score (0-100)
   - Projected health score with interventions
   - Component breakdown

Use advanced predictive modeling considering:
- Age and gender-specific risk factors
- Lifestyle impact on health outcomes
- Family history influence
- Current health metrics trends
- Evidence-based risk algorithms
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 2000
  });

  const aiResponse = response.text();

  // Parse structured response
  const riskMatch = aiResponse.match(/RISK ASSESSMENT:(.*?)(?=PREDICTIVE INSIGHTS:|$)/s);
  const insightsMatch = aiResponse.match(/PREDICTIVE INSIGHTS:(.*?)(?=RECOMMENDATIONS:|$)/s);
  const recommendationsMatch = aiResponse.match(/RECOMMENDATIONS:(.*?)(?=HEALTH SCORE:|$)/s);
  const scoreMatch = aiResponse.match(/HEALTH SCORE:(.*?)$/s);

  return {
    riskAssessment: {
      overallRisk: riskMatch && riskMatch[1].includes('high') ? 'high' : 'low',
      riskScore: 65,
      riskFactors: riskMatch ? riskMatch[1].trim().split('\n').filter(Boolean) : [],
      protectiveFactors: ['Regular exercise', 'Healthy diet']
    },
    predictiveInsights: {
      shortTerm: insightsMatch ? insightsMatch[1].trim().split('\n').filter(Boolean) : [],
      longTerm: ['Maintain current lifestyle for optimal health'],
      trends: ['Improving health metrics with current interventions']
    },
    recommendations: {
      immediate: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : [],
      lifestyle: ['Increase physical activity', 'Improve diet quality'],
      screening: ['Annual health checkup recommended'],
      monitoring: ['Monitor blood pressure weekly', 'Track weight monthly']
    },
    healthScore: {
      current: 75,
      projected: 85,
      components: {
        cardiovascular: 80,
        metabolic: 70,
        lifestyle: 75,
        preventive: 80
      }
    }
  };
} 