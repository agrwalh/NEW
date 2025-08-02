
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeSymptomsAction } from '@/app/actions';
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';

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
                    <span>Potential Causes</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="h-6 w-6 text-primary" />
              Potential Causes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
                Based on the symptoms you provided, here are some potential causes. This is not a medical diagnosis. Please consult a healthcare professional for advice.
            </p>
            <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4">
               <pre className="whitespace-pre-wrap bg-transparent p-0 font-body text-foreground">{result.potentialCauses}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
