import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    // Mock Razorpay order creation with proper payment options
    const mockOrder = {
      id: 'order_' + Date.now(),
      entity: 'order',
      amount: amount * 100, // Razorpay expects amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: currency,
      receipt: receipt || 'receipt_' + Date.now(),
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Date.now(),
      // Add payment options for frontend
      payment_options: {
        card: true,
        netbanking: true,
        upi: true,
        wallet: true,
        paylater: true
      },
      // Mock payment URL (in production, this would be Razorpay's payment URL)
      payment_url: `/payment/process?order_id=order_${Date.now()}&amount=${amount}&currency=${currency}`
    };

    return NextResponse.json({
      success: true,
      order: mockOrder
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
} 