
import { config } from 'dotenv';
config();

import '@/ai/flows/symptom-analyzer.ts';
import '@/ai/flows/medical-summarizer.ts';
import '@/ai/flows/doctor-agent.ts';
import '@/ai/flows/skin-lesion-analyzer.ts';
