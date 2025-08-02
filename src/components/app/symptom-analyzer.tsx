
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Lightbulb, Loader2, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeSymptomsAction } from '@/app/actions';
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const FormSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

export default function SymptomAnalyzer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SymptomAnalyzerOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    const { data: resultData, error } = await analyzeSymptomsAction(data.symptoms);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
      return;
    }
    setResult(resultData || null);
  }

  const getUrgencyBadgeVariant = (urgency: SymptomAnalyzerOutput['urgency']) => {
    switch (urgency) {
      case 'Low':
        return 'default';
      case 'Medium':
        return 'secondary';
      case 'High':
        return 'destructive';
      case 'Immediate':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analyze Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a sore throat, headache, and a slight fever.'"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the more accurate the analysis will be.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary"/>
                    <span>Analyzing Potential Causes...</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 font-headline">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                <span>Analysis Report</span>
              </div>
              <Badge variant={getUrgencyBadgeVariant(result.urgency)}>Urgency: {result.urgency}</Badge>
            </CardTitle>
            <CardDescription className="flex items-start gap-2 pt-2 text-sm">
                <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{result.disclaimer}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.analysis.map((item, index) => (
                <Card key={index} className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-start font-headline">
                            {item.condition}
                            <Badge variant={item.severity === 'Critical' || item.severity === 'Severe' ? 'destructive' : 'secondary'} className="capitalize">{item.severity}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-1">Description</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-1">Next Steps</h3>
                            <p className="text-sm text-muted-foreground">{item.nextSteps}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
