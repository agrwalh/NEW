import { NextRequest, NextResponse } from 'next/server';

// Cart item type
interface CartItem {
  product: {
    _id: string;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
}

// Mock cart storage (in production, this would be in database)
let mockCart: CartItem[] = [];

export async function GET() {
  try {
    // Calculate total price
    const totalPrice = mockCart.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    return NextResponse.json({
      success: true,
      cart: mockCart,
      totalPrice: totalPrice
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, action } = body;

    if (action === 'add') {
      // Add to cart
      const existingItem = mockCart.find(item => item.product._id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // In real app, you'd fetch product details from database
        const product = {
          _id: productId,
          name: 'Product Name', // This would come from database
          price: '10.00',
          image: 'https://placehold.co/400x400.png'
        };
        mockCart.push({ product, quantity });
      }
    } else if (action === 'update') {
      // Update quantity
      const item = mockCart.find(item => item.product._id === productId);
      if (item) {
        if (quantity <= 0) {
          mockCart = mockCart.filter(item => item.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    } else if (action === 'remove') {
      // Remove from cart
      mockCart = mockCart.filter(item => item.product._id !== productId);
    }

    const totalPrice = mockCart.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    return NextResponse.json({
      success: true,
      cart: mockCart,
      totalPrice: totalPrice
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
} 