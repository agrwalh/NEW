'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Heart,
  Pill,
  Microscope,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthMetrics {
  cardiovascular: number;
  metabolic: number;
  lifestyle: number;
  preventive: number;
}

interface RiskAssessment {
  overallRisk: string;
  riskScore: number;
  riskFactors: string[];
  protectiveFactors: string[];
}

interface PredictiveInsights {
  shortTerm: string[];
  longTerm: string[];
  trends: string[];
}

export default function AIAnalyticsDashboard() {
  const [healthScore, setHealthScore] = useState(75);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment>({
    overallRisk: 'low',
    riskScore: 25,
    riskFactors: ['Sedentary lifestyle', 'High stress levels'],
    protectiveFactors: ['Regular exercise', 'Healthy diet']
  });
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights>({
    shortTerm: ['Blood pressure may improve with lifestyle changes'],
    longTerm: ['Reduced risk of cardiovascular disease with current interventions'],
    trends: ['Improving health metrics over time']
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const healthMetrics: HealthMetrics = {
    cardiovascular: 80,
    metabolic: 70,
    lifestyle: 75,
    preventive: 80
  };

  const aiFeatures = [
    {
      name: 'AI Doctor',
      description: 'Advanced conversational AI for medical consultation',
      icon: Brain,
      status: 'active',
      accuracy: 94,
      features: ['Symptom Analysis', 'Diagnosis Support', 'Treatment Recommendations']
    },
    {
      name: 'Skin Lesion Analyzer',
      description: 'Computer vision for dermatological analysis',
      icon: Eye,
      status: 'active',
      accuracy: 89,
      features: ['ABCDE Analysis', 'Risk Assessment', 'Biopsy Recommendations']
    },
    {
      name: 'Medicine Information',
      description: 'ML-powered drug interaction and dosing analysis',
      icon: Pill,
      status: 'active',
      accuracy: 92,
      features: ['Drug Interactions', 'Personalized Dosing', 'Safety Assessment']
    },
    {
      name: 'Health Analytics',
      description: 'Predictive health insights and risk assessment',
      icon: BarChart3,
      status: 'active',
      accuracy: 87,
      features: ['Risk Prediction', 'Health Trends', 'Preventive Recommendations']
    },
    {
      name: 'Mental Health Companion',
      description: 'AI-powered mental health support and analysis',
      icon: Heart,
      status: 'active',
      accuracy: 91,
      features: ['Mood Analysis', 'Stress Assessment', 'Coping Strategies']
    },
    {
      name: 'Medical Summarizer',
      description: 'AI-powered medical document analysis',
      icon: Microscope,
      status: 'active',
      accuracy: 96,
      features: ['Document Analysis', 'Key Information Extraction', 'Summary Generation']
    }
  ];

  const runHealthAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update with new insights
      setHealthScore(82);
      setRiskAssessment({
        overallRisk: 'low',
        riskScore: 18,
        riskFactors: ['Minor stress levels'],
        protectiveFactors: ['Excellent exercise routine', 'Balanced diet', 'Good sleep']
      });
      
      toast({
        title: "Analysis Complete",
        description: "New health insights have been generated using AI.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete health analysis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline md:text-4xl">AI Health Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Advanced machine learning insights for comprehensive health monitoring and predictive analytics.
        </p>
      </div>

      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Overall Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{healthScore}/100</div>
              <Progress value={healthScore} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cardiovascular</span>
                <div className="flex items-center gap-2">
                  <Progress value={healthMetrics.cardiovascular} className="w-20" />
                  <span className="text-sm font-medium">{healthMetrics.cardiovascular}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Metabolic</span>
                <div className="flex items-center gap-2">
                  <Progress value={healthMetrics.metabolic} className="w-20" />
                  <span className="text-sm font-medium">{healthMetrics.metabolic}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Lifestyle</span>
                <div className="flex items-center gap-2">
                  <Progress value={healthMetrics.lifestyle} className="w-20" />
                  <span className="text-sm font-medium">{healthMetrics.lifestyle}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Preventive</span>
                <div className="flex items-center gap-2">
                  <Progress value={healthMetrics.preventive} className="w-20" />
                  <span className="text-sm font-medium">{healthMetrics.preventive}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Risk</span>
                <Badge variant={riskAssessment.overallRisk === 'high' ? 'destructive' : 'secondary'}>
                  {riskAssessment.overallRisk.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Risk Score</span>
                <span className="font-bold">{riskAssessment.riskScore}/100</span>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Factors</h4>
                <div className="space-y-1">
                  {riskAssessment.riskFactors.map((factor, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Protective Factors</h4>
                <div className="space-y-1">
                  {riskAssessment.protectiveFactors.map((factor, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Short-term (3-6 months)</h4>
                <div className="space-y-1">
                  {predictiveInsights.shortTerm.map((insight, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {insight}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Long-term (1-5 years)</h4>
                <div className="space-y-1">
                  {predictiveInsights.longTerm.map((insight, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {insight}
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={runHealthAnalysis} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Running AI Analysis...' : 'Run New Analysis'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI/ML Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{feature.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {feature.accuracy}% Accuracy
                          </Badge>
                          <Badge variant={feature.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          {feature.features.map((feat, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {feat}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 