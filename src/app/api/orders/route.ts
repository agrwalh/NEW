import { NextRequest, NextResponse } from 'next/server';

// Order type
interface Order {
  _id: string;
  user: string;
  products: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock order storage
let mockOrders: Order[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let orders = mockOrders;
    if (userId) {
      orders = mockOrders.filter(order => order.user === userId);
    }

    return NextResponse.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, products, totalAmount, deliveryAddress } = body;

    const newOrder: Order = {
      _id: 'order_' + Date.now(),
      user: userId,
      products: products,
      totalAmount: totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryAddress: deliveryAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockOrders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 