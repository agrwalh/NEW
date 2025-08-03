import { NextRequest, NextResponse } from 'next/server';

// Mock user storage (in production, this would be in MongoDB)
let mockUsers = [
  {
    _id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1234567890'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      _id: (mockUsers.length + 1).toString(),
      email,
      password, // In production, this would be hashed with bcrypt
      name,
      phone
    };

    mockUsers.push(newUser);

    // In production, you'd create a JWT token here
    const token = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
} 