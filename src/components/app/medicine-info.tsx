
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Pill, Loader2, FileText, AlertTriangle } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getMedicineInfoAction } from '@/app/actions';
import type { MedicineInfoOutput } from '@/ai/flows/medicine-info';
import { Separator } from '../ui/separator';

const FormSchema = z.object({
  medicineName: z.string().min(2, {
    message: 'Medicine name must be at least 2 characters.',
  }),
});

export default function MedicineInfo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<MedicineInfoOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      medicineName: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    const { data: resultData, error } = await getMedicineInfoAction(data.medicineName);
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
          <CardTitle className="font-headline">Get Medicine Information</CardTitle>
          <CardDescription>
            Enter the name of a medication to get its details, including usage, dosage, side effects, and precautions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="medicineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Paracetamol' or 'Ibuprofen'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Info
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Pill className="h-6 w-6 text-primary"/>
                    <span>Fetching Information...</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="h-6 w-6 text-primary" />
              Information for "{form.getValues('medicineName')}"
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-lg">Usage</h3>
              <p className="prose prose-sm max-w-none text-muted-foreground">{result.usage}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-lg">Dosage</h3>
              <p className="prose prose-sm max-w-none text-muted-foreground">{result.dosage}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-lg">Side Effects</h3>
              <p className="prose prose-sm max-w-none text-muted-foreground">{result.sideEffects}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 text-lg">Precautions</h3>
              <p className="prose prose-sm max-w-none text-muted-foreground">{result.precautions}</p>
            </div>
            <Separator />
             <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <h4 className="font-bold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/>
                    Disclaimer
                </h4>
                <p className="text-sm mt-2">{result.disclaimer}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
