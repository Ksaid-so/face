'use client';

import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  Camera,
  CreditCard,
  DollarSign,
  Smartphone,
  Building2,
  Receipt,
  X,
  Barcode,
  Download
} from 'lucide-react';
import { receiptGenerator, type ReceiptData } from '@/lib/receiptGenerator';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  setDiscount, 
  setTax, 
  setPaymentMethod, 
  setCustomerInfo,
  setScanning,
  clearCart,
  selectSubtotal,
  selectTotal
} from '@/features/pos/posSlice';
import { addSale } from '@/features/sales/salesSlice';
import type { RootState } from '@/lib/store';

export default function POSPage() {
  const dispatch = useDispatch();
  const { items, discount, tax, paymentMethod, customerInfo, isScanning } = useSelector((state: RootState) => state.pos);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Mock products data
  const products = [
    { id: '1', name: 'Wireless Mouse', price: 29.99, barcode: '1234567890123', stock: 45 },
    { id: '2', name: 'USB Cable', price: 12.99, barcode: '1234567890124', stock: 8 },
    { id: '3', name: 'Keyboard', price: 79.99, barcode: '1234567890125', stock: 23 },
    { id: '4', name: 'Monitor', price: 299.99, barcode: '1234567890126', stock: 12 },
    { id: '5', name: 'Laptop Stand', price: 49.99, barcode: '1234567890127', stock: 15 },
    { id: '6', name: 'Webcam HD', price: 59.99, barcode: '1234567890128', stock: 8 },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  const subtotal = useSelector(selectSubtotal);
  const total = useSelector(selectTotal);

  const handleAddToCart = (product: any) => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    }));
  };

  const handleBarcodeScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      handleAddToCart(product);
      setSearchQuery('');
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleCheckout = () => {
    // Generate receipt data
    const receiptData: ReceiptData = {
      storeInfo: {
        name: 'Inventory Pro Store',
        address: '123 Main St, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'store@inventorypro.com',
      },
      receiptInfo: {
        invoiceNo: `INV-${Date.now()}`,
        date: new Date().toISOString(),
        cashier: 'Current User', // This would come from the auth state
        paymentMethod: paymentMethod,
      },
      customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      discount,
      tax,
      total,
    };

    // Create sale object for Redux store
    const newSale = {
      id: Date.now().toString(),
      invoiceNumber: receiptData.receiptInfo.invoiceNo,
      date: new Date().toISOString(),
      customer: customerInfo.name || 'Walk-in Customer',
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'COMPLETED' as const,
      staff: {
        name: 'Current User',
        email: 'user@inventorypro.com'
      },
      customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
      createdAt: new Date().toISOString(),
    };

    // Add sale to Redux store
    dispatch(addSale(newSale));

    // Generate and download receipt
    receiptGenerator.downloadReceipt(receiptData);

    // Here you would typically process the payment and create the sale
    console.log('Processing checkout:', { items, discount, tax, paymentMethod, customerInfo, total });
    alert(`Sale completed! Total: $${total.toFixed(2)}\nReceipt downloaded successfully!`);
    dispatch(clearCart());
    setIsCheckoutOpen(false);
  };

  const handleGenerateReceipt = () => {
    const receiptData: ReceiptData = {
      storeInfo: {
        name: 'Inventory Pro Store',
        address: '123 Main St, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'store@inventorypro.com',
      },
      receiptInfo: {
        invoiceNo: `INV-${Date.now()}`,
        date: new Date().toISOString(),
        cashier: 'Current User',
        paymentMethod: paymentMethod,
      },
      customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      discount,
      tax,
      total,
    };

    receiptGenerator.downloadReceipt(receiptData);
  };

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: DollarSign },
    { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
    { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
    { value: 'MOBILE_PAYMENT', label: 'Mobile Payment', icon: Smartphone },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
            <p className="text-muted-foreground">
              Process sales and manage transactions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => dispatch(setScanning(!isScanning))}>
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
            <Button 
              variant="outline" 
              disabled={items.length === 0}
              onClick={() => dispatch(clearCart())}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
            {items.length > 0 && (
              <Button variant="outline" onClick={handleGenerateReceipt}>
                <Download className="h-4 w-4 mr-2" />
                Generate Receipt
              </Button>
            )}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
              <DialogTrigger asChild>
                <Button disabled={items.length === 0}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Checkout (${total.toFixed(2)})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                  <DialogDescription>
                    Complete the sale by selecting payment method.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">
                      Customer
                    </Label>
                    <Input 
                      id="customer" 
                      placeholder="Customer name"
                      value={customerInfo.name || ''}
                      onChange={(e) => dispatch(setCustomerInfo({ name: e.target.value }))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="customer@email.com"
                      value={customerInfo.email || ''}
                      onChange={(e) => dispatch(setCustomerInfo({ email: e.target.value }))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Payment</Label>
                    <Select value={paymentMethod} onValueChange={(value) => dispatch(setPaymentMethod(value as any))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              <method.icon className="h-4 w-4" />
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="discount" className="text-right">
                      Discount
                    </Label>
                    <Input 
                      id="discount" 
                      type="number"
                      placeholder="0.00"
                      value={discount}
                      onChange={(e) => dispatch(setDiscount(parseFloat(e.target.value) || 0))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tax" className="text-right">
                      Tax
                    </Label>
                    <Input 
                      id="tax" 
                      type="number"
                      placeholder="0.00"
                      value={tax}
                      onChange={(e) => dispatch(setTax(parseFloat(e.target.value) || 0))}
                      className="col-span-3" 
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCheckout}>
                    Complete Sale
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barcode Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" />
                  Barcode Scanner
                </CardTitle>
                <CardDescription>
                  Scan or enter barcode to add products to cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    ref={barcodeInputRef}
                    placeholder="Enter barcode or scan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeScan(searchQuery);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={() => handleBarcodeScan(searchQuery)}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Click on a product to add it to the cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                            {product.stock}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground font-mono">
                            {product.barcode}
                          </p>
                          <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between py-2">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => dispatch(removeItem(item.productId))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}