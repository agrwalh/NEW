
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileText, Link as LinkIcon, Loader2 } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { summarizeTopicAction } from '@/app/actions';
import type { MedicalSummarizerOutput } from '@/ai/flows/medical-summarizer';
import { Separator } from '../ui/separator';

const FormSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
});

export default function MedicalSummarizer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<MedicalSummarizerOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    const { data: resultData, error } = await summarizeTopicAction(data.topic);
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
          <CardTitle className="font-headline">Summarize a Medical Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Type 2 Diabetes'" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a medical condition, treatment, or term to summarize.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Summarize Topic
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary"/>
                    <span>Summary</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="h-6 w-6 text-primary" />
              Summary for "{form.getValues('topic')}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="prose prose-sm max-w-none text-foreground">{result.summary}</p>

            <Separator className="my-6" />

            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold font-headline">
              <LinkIcon className="h-5 w-5 text-primary" />
              Sources
            </h3>
            <ul className="space-y-2">
                {result.sourceLinks.map((link, index) => (
                    <li key={index}>
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
