
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Plus, Minus, X, User, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Product type definition
interface Product {
  _id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image?: string;
  category: string;
  stock: number;
  description?: string;
}

// Cart item type
interface CartItem {
  product: Product;
  quantity: number;
}

// User type
interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
}

const categories = ['All', 'Pain Relief', 'Allergy', 'Cold & Flu', 'Medical Devices', 'First Aid', 'Vitamins', 'Personal Care'];

export default function Pharmacy() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Auth form state
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load cart from API
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Add to cart
  const addToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          action: 'add'
        })
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
          action: newQuantity <= 0 ? 'remove' : 'update'
        })
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        if (newQuantity <= 0) {
          toast({
            title: "Removed from cart",
            description: "Item has been removed from your cart.",
          });
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    await updateQuantity(productId, 0);
  };

  // Handle authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setIsAuthOpen(false);
        setAuthForm({ email: '', password: '', name: '', phone: '' });
        toast({
          title: isLogin ? "Login successful" : "Registration successful",
          description: `Welcome, ${data.user.name}!`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In production, you'd verify the token with the backend
      setUser({ _id: '1', email: 'user@example.com', name: 'John Doe', phone: '+1234567890' });
    }
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Checkout function
  const handleCheckout = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          products: cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: parseFloat(item.product.price)
          })),
          totalAmount: cartTotal,
          deliveryAddress: {
            street: '123 Main St',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            phone: user.phone
          }
        })
      });

      const orderData = await orderResponse.json();
      
      if (orderData.success) {
        // Create payment order
        const paymentResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: cartTotal,
            currency: 'INR',
            receipt: orderData.order._id
          })
        });

        const paymentData = await paymentResponse.json();
        
                 if (paymentData.success) {
           toast({
             title: "Order created",
             description: "Redirecting to payment...",
           });
           // Redirect to payment page
           window.location.href = paymentData.order.payment_url;
           setIsCartOpen(false);
           setCart([]);
         }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Checkout failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Pharmacy & Wellness</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Browse our curated selection of over-the-counter medicines and health products to support your well-being.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          {/* User Authentication */}
          <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                {user ? <User className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                {user ? user.name : 'Login'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="Phone"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                      required
                    />
                  </>
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  required
                />
                <Button type="submit" className="w-full">
                  {isLogin ? 'Login' : 'Register'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full"
                >
                  {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {user && (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
          
          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogTrigger asChild>
              <Button className="relative">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {cart.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                     <Image
                             src={item.product.image || 'https://placehold.co/400x400.png'}
                             alt={item.product.name}
                             width={50}
                             height={50}
                             className="rounded-md object-cover"
                           />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">${item.product.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.product._id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button onClick={handleCheckout} className="w-full">
                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="group flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-square w-full">
                                 <Image
                   src={product.image || 'https://placehold.co/400x400.png'}
                   alt={product.name}
                   fill
                   className="object-cover transition-transform duration-300 group-hover:scale-105"
                 />
                <Badge className="absolute top-3 right-3" variant="secondary">
                  {product.category}
                </Badge>
                {product.originalPrice && (
                  <Badge className="absolute top-3 left-3" variant="destructive">
                    {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <CardContent className="flex flex-grow flex-col p-4">
                <h3 className="font-headline text-lg font-semibold flex-grow">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-baseline justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">${product.originalPrice}</p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
