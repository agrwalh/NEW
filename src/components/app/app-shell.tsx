
'use client';

import * as React from 'react';
import {
  HeartPulse,
  Stethoscope,
  FileText,
  BookOpen,
  MessageCircle,
  ScanSearch,
  ClipboardType,
  Pill,
  ShoppingCart,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import SymptomAnalyzer from '@/components/app/symptom-analyzer';
import MedicalSummarizer from '@/components/app/medical-summarizer';
import HealthResources from '@/components/app/health-resources';
import AiDoctor from '@/components/app/ai-doctor';
import SkinLesionAnalyzer from './skin-lesion-analyzer';
import PrescriptionGenerator from './prescription-generator';
import MedicineInfo from './medicine-info';
import Pharmacy from './pharmacy';

type View = 'symptoms' | 'summarizer' | 'resources' | 'ai-doctor' | 'skin-lesion' | 'prescription' | 'medicine-info' | 'pharmacy';

export function AppShell() {
  const [activeView, setActiveView] = React.useState<View>('pharmacy');

  const renderContent = () => {
    switch (activeView) {
      case 'symptoms':
        return <SymptomAnalyzer />;
      case 'summarizer':
        return <MedicalSummarizer />;
      case 'resources':
        return <HealthResources />;
      case 'ai-doctor':
        return <AiDoctor />;
      case 'skin-lesion':
        return <SkinLesionAnalyzer />;
      case 'prescription':
        return <PrescriptionGenerator />;
      case 'medicine-info':
        return <MedicineInfo />;
      case 'pharmacy':
        return <Pharmacy />;
      default:
        return <SymptomAnalyzer />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-headline font-semibold">MediChat</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('symptoms')}
                isActive={activeView === 'symptoms'}
                tooltip="Symptom Analyzer"
              >
                <Stethoscope />
                <span>Symptom Analyzer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('summarizer')}
                isActive={activeView === 'summarizer'}
                tooltip="Medical Summarizer"
              >
                <FileText />
                <span>Medical Summarizer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('skin-lesion')}
                isActive={activeView === 'skin-lesion'}
                tooltip="Skin Lesion Analyzer"
              >
                <ScanSearch />
                <span>Skin Lesion Analyzer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('prescription')}
                isActive={activeView === 'prescription'}
                tooltip="Prescription Generator"
              >
                <ClipboardType />
                <span>Prescription Generator</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('medicine-info')}
                isActive={activeView === 'medicine-info'}
                tooltip="Medicine Info"
              >
                <Pill />
                <span>Medicine Info</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('pharmacy')}
                isActive={activeView === 'pharmacy'}
                tooltip="Pharmacy"
              >
                <ShoppingCart />
                <span>Pharmacy</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('resources')}
                isActive={activeView === 'resources'}
                tooltip="Health Resources"
              >
                <BookOpen />
                <span>Health Resources</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('ai-doctor')}
                isActive={activeView === 'ai-doctor'}
                tooltip="AI Doctor"
              >
                <MessageCircle />
                <span>AI Doctor</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:h-16">
           <SidebarTrigger className="md:hidden"/>
           <div className="hidden items-center gap-2 md:flex">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary md:hidden">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold font-headline">
              {activeView === 'symptoms' && 'Symptom Analyzer'}
              {activeView === 'summarizer' && 'Medical Summarizer'}
              {activeView === 'skin-lesion' && 'Skin Lesion Analyzer'}
              {activeView === 'prescription' && 'Prescription Generator'}
              {activeView === 'medicine-info' && 'Medicine Information'}
              {activeView === 'pharmacy' && 'Pharmacy'}
              {activeView === 'resources' && 'Health Resources'}
              {activeView === 'ai-doctor' && 'AI Doctor'}
            </h1>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
