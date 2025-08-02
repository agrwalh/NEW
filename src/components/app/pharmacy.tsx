
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    name: 'Pain Reliever (Ibuprofen)',
    price: '$8.99',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'medicine pills',
    category: 'Pain Relief',
  },
  {
    name: 'Allergy Relief (Loratadine)',
    price: '$12.50',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'allergy medicine',
    category: 'Allergy',
  },
  {
    name: 'Cold & Flu Syrup',
    price: '$10.25',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'cough syrup',
    category: 'Cold & Flu',
  },
  {
    name: 'Digital Thermometer',
    price: '$15.00',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'digital thermometer',
    category: 'Medical Devices',
  },
  {
    name: 'Adhesive Bandages (Assorted)',
    price: '$5.49',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'adhesive bandages',
    category: 'First Aid',
  },
  {
    name: 'Vitamin C Gummies',
    price: '$9.99',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'vitamin gummies',
    category: 'Vitamins',
  },
    {
    name: 'Antiseptic Wipes',
    price: '$4.75',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'antiseptic wipes',
    category: 'First Aid',
  },
  {
    name: 'Hand Sanitizer',
    price: '$3.99',
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'hand sanitizer',
    category: 'Personal Care',
  },
];

export default function Pharmacy() {
  return (
    <div className="space-y-8">
       <div className="text-center">
            <h1 className="text-3xl font-bold font-headline md:text-4xl">Pharmacy & Wellness</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Browse our curated selection of over-the-counter medicines and health products to support your well-being.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <Card key={product.name} className="group flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square w-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            data-ai-hint={product.dataAiHint}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                         <Badge className="absolute top-3 right-3" variant="secondary">{product.category}</Badge>
                    </div>
                    <CardContent className="flex flex-grow flex-col p-4">
                        <h3 className="font-headline text-lg font-semibold flex-grow">{product.name}</h3>
                        <div className="flex items-baseline justify-between mt-4">
                          <p className="text-2xl font-bold text-primary">{product.price}</p>
                          <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => alert('This is a demo. No actual purchase will be made.')}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add to Cart
                          </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
