
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClipboardType, Loader2, User, HeartPulse, ShieldAlert, Download, ShoppingCart } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
import { generatePrescriptionAction } from '@/app/actions';
import type { PrescriptionGeneratorOutput } from '@/ai/flows/prescription-generator';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(0, { message: 'Age must be a positive number.' }),
  gender: z.enum(['Male', 'Female', 'Other']),
  symptoms: z.string().min(10, {
    message: 'Symptoms must be at least 10 characters.',
  }),
});

export default function PrescriptionGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<PrescriptionGeneratorOutput | null>(null);
  const prescriptionRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        name: '',
        age: '' as any,
        gender: undefined,
        symptoms: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    const { data: resultData, error } = await generatePrescriptionAction(data);
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

  const handleDownloadPdf = () => {
    const input = prescriptionRef.current;
    if (input) {
        // Temporarily remove download button from capture
        const downloadButton = input.querySelector('#download-button');
        const originalDisplay = downloadButton?.parentElement?.style.display;
        if(downloadButton?.parentElement) {
            downloadButton.parentElement.style.display = 'none';
        }
        
        html2canvas(input, { scale: 2, backgroundColor: null }).then((canvas) => {
            // Restore download button
            if(downloadButton?.parentElement && originalDisplay) {
                downloadButton.parentElement.style.display = originalDisplay;
            }

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
            const imgWidth = (canvasWidth * ratio) * 0.95; // add some padding
            const imgHeight = (canvasHeight * ratio) * 0.95;
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`prescription-${result?.patientName?.replace(/\s/g, '_') || 'sample'}.pdf`);
        });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generate a Sample Prescription</CardTitle>
          <CardDescription>
            Enter patient details and symptoms to receive an AI-generated sample prescription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'John Doe'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Persistent cough for one week, slight fever, and body aches.'"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Prescription
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardType className="h-6 w-6 text-primary"/>
                    <span>Generating Prescription...</span>
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
          <div ref={prescriptionRef}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3 font-headline">
                <div className="flex items-center gap-3">
                  <ClipboardType className="h-7 w-7 text-primary" />
                  <span>Sample Prescription</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                  <div className="flex justify-between rounded-lg border p-4">
                      <div>
                          <h3 className="font-bold">{result.patientName}</h3>
                          <p className="text-sm text-muted-foreground">Age: {result.age}</p>
                          <p className="text-sm text-muted-foreground">Gender: {result.gender}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-sm font-medium">Dr. AI Assistant</p>
                          <p className="text-sm text-muted-foreground">MediChat Digital Clinic</p>
                          <p className="text-sm text-muted-foreground">Date: {result.date}</p>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                          <HeartPulse className="h-5 w-5 text-primary" />
                          Diagnosis
                      </h3>
                      <p className="text-sm text-foreground">{result.diagnosis}</p>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                      <h3 className="font-semibold">Rx (Medication)</h3>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Medicine</TableHead>
                                  <TableHead>Dosage</TableHead>
                                  <TableHead>Frequency</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {result.medicines.map((med, index) => (
                                  <TableRow key={index}>
                                      <TableCell className="font-medium">{med.name}</TableCell>
                                      <TableCell>{med.dosage}</TableCell>
                                      <TableCell>{med.frequency}</TableCell>
                                      <TableCell>{med.duration}</TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(med.name)}`, '_blank')}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Buy Now
                                        </Button>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                      <h3 className="font-semibold">Precautions & Advice</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                         {result.precautions.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                  </div>

                  <Separator />

                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                      <h4 className="font-bold flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5"/>
                          Important Disclaimer
                      </h4>
                      <p className="text-sm mt-2">{result.disclaimer}</p>
                  </div>
              </div>
            </CardContent>
          </div>
          <CardContent className="pt-6">
            <Button id="download-button" onClick={handleDownloadPdf} className="w-full bg-accent hover:bg-accent/90">
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
