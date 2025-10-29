'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiSlice } from '@/features/api/apiSlice';
import type { RootState } from '@/lib/store';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Mock data for now - will be replaced with actual API calls
  const stats = [
    {
      title: 'Total Products',
      value: '1,234',
      change: '+12%',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Today\'s Sales',
      value: '$2,456',
      change: '+8%',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: '45',
      change: '+3',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
  ];

  const recentSales = [
    { id: '1', invoice: 'INV-001', customer: 'John Doe', amount: '$156.00', status: 'completed' },
    { id: '2', invoice: 'INV-002', customer: 'Jane Smith', amount: '$89.50', status: 'completed' },
    { id: '3', invoice: 'INV-003', customer: 'Bob Johnson', amount: '$234.00', status: 'pending' },
    { id: '4', invoice: 'INV-004', customer: 'Alice Brown', amount: '$67.25', status: 'completed' },
  ];

  const lowStockProducts = [
    { id: '1', name: 'Wireless Mouse', stock: 3, minStock: 10 },
    { id: '2', name: 'USB Cable', stock: 5, minStock: 20 },
    { id: '3', name: 'Keyboard', stock: 2, minStock: 15 },
    { id: '4', name: 'Monitor', stock: 1, minStock: 5 },
  ];

  const popularProducts = [
    { id: '1', name: 'Laptop Stand', sales: 45, revenue: '$2,250' },
    { id: '2', name: 'Webcam HD', sales: 32, revenue: '$1,920' },
    { id: '3', name: 'Wireless Charger', sales: 28, revenue: '$840' },
    { id: '4', name: 'Bluetooth Speaker', sales: 24, revenue: '$1,440' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your inventory today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/pos')}>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
            <Button variant="outline" onClick={() => router.push('/inventory')}>
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Sales */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.invoice}</p>
                      <p className="text-sm text-muted-foreground">{sale.customer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                        {sale.status}
                      </Badge>
                      <span className="font-medium">{sale.amount}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push('/sales')}>
                  View All Sales
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.stock} left (min: {product.minStock})
                      </p>
                    </div>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push('/alerts')}>
                  View All Alerts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Popular Products</CardTitle>
              <CardDescription>Top selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {popularProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                        <p className="font-semibold">{product.revenue}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}