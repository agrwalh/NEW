'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const router = useRouter();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState({
    orderId: 'order_' + Date.now(),
    amount: 0,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
  });

  useEffect(() => {
    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your order has been confirmed and will be delivered soon.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span className="font-mono text-sm">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Delivery:</span>
                  <span>{orderDetails.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Your order will be processed and shipped within 24 hours</span>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/pharmacy')}
                className="w-full"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Back to Pharmacy
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              You will receive an email confirmation with order details shortly.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 