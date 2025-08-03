'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Smartphone, Building2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentProcess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    amount: 0,
    currency: 'INR'
  });

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') || 'INR';

    if (orderId && amount) {
      setOrderDetails({
        orderId,
        amount: parseFloat(amount),
        currency
      });
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed and will be delivered soon.",
      });
      
      // Redirect to success page
      router.push('/payment/success');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Complete Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">₹{orderDetails.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <Label className="text-base font-medium">Select Payment Method</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{method.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="username@upi"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <select
                    id="bank"
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wallet">Select Wallet</Label>
                  <select
                    id="wallet"
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Choose your wallet</option>
                    <option value="paytm">Paytm</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="gpay">Google Pay</option>
                    <option value="amazon">Amazon Pay</option>
                  </select>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing Payment...' : `Pay ₹${orderDetails.amount.toFixed(2)}`}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Your payment is secured with bank-level encryption
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 