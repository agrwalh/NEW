import { NextRequest, NextResponse } from 'next/server';

// Mock user data (in production, this would be in MongoDB)
const mockUsers = [
  {
    _id: '1',
    email: 'user@example.com',
    password: 'password123', // In production, this would be hashed
    name: 'John Doe',
    phone: '+1234567890'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, you'd create a JWT token here
    const token = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
} 