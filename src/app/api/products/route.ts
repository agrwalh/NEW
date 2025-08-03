import { NextRequest, NextResponse } from 'next/server';

// Product type matching Quicksy structure
interface Product {
  _id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  description?: string;
  images?: Buffer[];
  image?: Buffer;
}

// Mock data for now - in production this would connect to MongoDB
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Pain Reliever (Ibuprofen)',
    price: '8.99',
    category: 'Pain Relief',
    stock: 50,
    description: 'Fast-acting pain relief for headaches, muscle pain, and inflammation.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '2',
    name: 'Allergy Relief (Loratadine)',
    price: '12.50',
    category: 'Allergy',
    stock: 30,
    description: '24-hour non-drowsy allergy relief for seasonal allergies.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '3',
    name: 'Cold & Flu Syrup',
    price: '10.25',
    category: 'Cold & Flu',
    stock: 25,
    description: 'Multi-symptom relief for cold and flu symptoms.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '4',
    name: 'Digital Thermometer',
    price: '15.00',
    category: 'Medical Devices',
    stock: 20,
    description: 'Accurate digital thermometer for quick temperature readings.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '5',
    name: 'Adhesive Bandages (Assorted)',
    price: '5.49',
    category: 'First Aid',
    stock: 100,
    description: 'Sterile adhesive bandages in various sizes for minor cuts.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '6',
    name: 'Vitamin C Gummies',
    price: '9.99',
    category: 'Vitamins',
    stock: 40,
    description: 'Delicious vitamin C gummies to support immune health.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '7',
    name: 'Antiseptic Wipes',
    price: '4.75',
    category: 'First Aid',
    stock: 60,
    description: 'Sterile antiseptic wipes for wound cleaning and disinfection.',
    image: Buffer.from('mock-image-data')
  },
  {
    _id: '8',
    name: 'Hand Sanitizer',
    price: '3.99',
    category: 'Personal Care',
    stock: 80,
    description: 'Alcohol-based hand sanitizer for effective hand hygiene.',
    image: Buffer.from('mock-image-data')
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredProducts = mockProducts;

    // Filter by category
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Convert to frontend format with proper image URLs
    const productsWithImages = filteredProducts.map(product => ({
      ...product,
      image: 'https://placehold.co/400x400.png', // Use placeholder for now
      images: [] // Empty array for now
    }));

    return NextResponse.json({
      success: true,
      products: productsWithImages
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 