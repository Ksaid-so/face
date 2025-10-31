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
  ArrowRight,
  User,
  Settings,
  FileText
} from 'lucide-react';
import { apiSlice } from '@/features/api/apiSlice';
import type { RootState } from '@/lib/store';
import { useSession } from 'next-auth/react';

interface CustomSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    id?: string;
  };
  expires: string;
}

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession() as { data: CustomSession | null };
  
  const userRole = session?.user?.role || 'STAFF';

  // Define role-based stats
  const getRoleBasedStats = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
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
      case 'MANAGER':
        return [
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
            title: 'Expenses',
            value: '$1,234',
            change: '+5%',
            icon: FileText,
            color: 'text-red-600',
          },
          {
            title: 'Low Stock Items',
            value: '23',
            change: '-5',
            icon: AlertTriangle,
            color: 'text-orange-600',
          },
        ];
      case 'STAFF':
      default:
        return [
          {
            title: 'Today\'s Sales',
            value: '$2,456',
            change: '+8%',
            icon: DollarSign,
            color: 'text-green-600',
          },
          {
            title: 'Products Sold',
            value: '45',
            change: '+12%',
            icon: ShoppingCart,
            color: 'text-blue-600',
          },
          {
            title: 'Tasks Completed',
            value: '12',
            change: '+3',
            icon: TrendingUp,
            color: 'text-purple-600',
          },
          {
            title: 'Pending Tasks',
            value: '3',
            change: '-1',
            icon: AlertTriangle,
            color: 'text-orange-600',
          },
        ];
    }
  };

  // Define role-based quick actions
  const getRoleBasedQuickActions = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { title: 'New Sale', icon: Plus, action: () => router.push('/pos'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
          { title: 'Add Product', icon: Package, action: () => router.push('/inventory'), role: ['ADMIN', 'MANAGER'] },
          { title: 'Manage Users', icon: User, action: () => router.push('/users'), role: ['ADMIN'] },
          { title: 'System Settings', icon: Settings, action: () => router.push('/settings'), role: ['ADMIN'] },
        ];
      case 'MANAGER':
        return [
          { title: 'New Sale', icon: Plus, action: () => router.push('/pos'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
          { title: 'Add Product', icon: Package, action: () => router.push('/inventory'), role: ['ADMIN', 'MANAGER'] },
          { title: 'View Expenses', icon: FileText, action: () => router.push('/expenses'), role: ['ADMIN', 'MANAGER'] },
          { title: 'Sales Reports', icon: TrendingUp, action: () => router.push('/sales'), role: ['ADMIN', 'MANAGER'] },
        ];
      case 'STAFF':
      default:
        return [
          { title: 'New Sale', icon: Plus, action: () => router.push('/pos'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
          { title: 'View Products', icon: Package, action: () => router.push('/inventory'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
          { title: 'My Tasks', icon: TrendingUp, action: () => router.push('/tasks'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
          { title: 'Profile Settings', icon: User, action: () => router.push('/auth/profile'), role: ['ADMIN', 'MANAGER', 'STAFF'] },
        ];
    }
  };

  // Define role-based recent sales data
  const getRoleBasedRecentSales = () => {
    switch (userRole) {
      case 'ADMIN':
      case 'MANAGER':
        return [
          { id: '1', invoice: 'INV-001', customer: 'John Doe', amount: '$156.00', status: 'completed' },
          { id: '2', invoice: 'INV-002', customer: 'Jane Smith', amount: '$89.50', status: 'completed' },
          { id: '3', invoice: 'INV-003', customer: 'Bob Johnson', amount: '$234.00', status: 'pending' },
          { id: '4', invoice: 'INV-004', customer: 'Alice Brown', amount: '$67.25', status: 'completed' },
        ];
      case 'STAFF':
      default:
        return [
          { id: '1', invoice: 'INV-001', customer: 'John Doe', amount: '$156.00', status: 'completed' },
          { id: '2', invoice: 'INV-002', customer: 'Jane Smith', amount: '$89.50', status: 'completed' },
          { id: '3', invoice: 'INV-003', customer: 'Bob Johnson', amount: '$234.00', status: 'pending' },
        ];
    }
  };

  // Define role-based low stock products
  const getRoleBasedLowStockProducts = () => {
    switch (userRole) {
      case 'ADMIN':
      case 'MANAGER':
        return [
          { id: '1', name: 'Wireless Mouse', stock: 3, minStock: 10 },
          { id: '2', name: 'USB Cable', stock: 5, minStock: 20 },
          { id: '3', name: 'Keyboard', stock: 2, minStock: 15 },
          { id: '4', name: 'Monitor', stock: 1, minStock: 5 },
        ];
      case 'STAFF':
      default:
        return [
          { id: '1', name: 'Wireless Mouse', stock: 3, minStock: 10 },
          { id: '2', name: 'USB Cable', stock: 5, minStock: 20 },
        ];
    }
  };

  // Define role-based popular products
  const getRoleBasedPopularProducts = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { id: '1', name: 'Laptop Stand', sales: 45, revenue: '$2,250' },
          { id: '2', name: 'Webcam HD', sales: 32, revenue: '$1,920' },
          { id: '3', name: 'Wireless Charger', sales: 28, revenue: '$840' },
          { id: '4', name: 'Bluetooth Speaker', sales: 24, revenue: '$1,440' },
        ];
      case 'MANAGER':
        return [
          { id: '1', name: 'Laptop Stand', sales: 45, revenue: '$2,250' },
          { id: '2', name: 'Webcam HD', sales: 32, revenue: '$1,920' },
          { id: '3', name: 'Wireless Charger', sales: 28, revenue: '$840' },
        ];
      case 'STAFF':
      default:
        return [
          { id: '1', name: 'Laptop Stand', sales: 45, revenue: '$2,250' },
          { id: '2', name: 'Webcam HD', sales: 32, revenue: '$1,920' },
        ];
    }
  };

  const stats = getRoleBasedStats();
  const quickActions = getRoleBasedQuickActions().filter(action => action.role.includes(userRole));
  const recentSales = getRoleBasedRecentSales();
  const lowStockProducts = getRoleBasedLowStockProducts();
  const popularProducts = getRoleBasedPopularProducts();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name || 'User'}!</h1>
          <p className="text-muted-foreground">
            {userRole === 'ADMIN' && "Here's what's happening with your business today."}
            {userRole === 'MANAGER' && "Here's what's happening with your inventory today."}
            {userRole === 'STAFF' && "Here's what's happening with your tasks today."}
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.slice(0, 2).map((action, index) => (
            <Button 
              key={index} 
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.title}
            </Button>
          ))}
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

      {/* Charts and Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              {userRole === 'ADMIN' && "Latest transactions from your store"}
              {userRole === 'MANAGER' && "Latest sales from your team"}
              {userRole === 'STAFF' && "Your recent sales transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{sale.invoice}</p>
                    <p className="text-sm text-muted-foreground">{sale.customer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{sale.amount}</span>
                    <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/sales')}>
                View all sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>
                Products that need restocking soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {product.stock}, Min: {product.minStock}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Low Stock
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" onClick={() => router.push('/inventory')}>
                  Manage inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff-specific content */}
        {userRole === 'STAFF' && (
          <Card>
            <CardHeader>
              <CardTitle>My Performance</CardTitle>
              <CardDescription>
                Your sales performance this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Sales Target</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: '80%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Items Sold</p>
                    <p className="text-xl font-bold">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-bold">$2,456</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Products or Role-specific Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {userRole === 'ADMIN' && 'Popular Products'}
            {userRole === 'MANAGER' && 'Top Selling Products'}
            {userRole === 'STAFF' && 'Products to Focus On'}
          </CardTitle>
          <CardDescription>
            {userRole === 'ADMIN' && 'Best selling items this month'}
            {userRole === 'MANAGER' && 'Top performing products in your category'}
            {userRole === 'STAFF' && 'Products with high sales targets'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  <p className="font-semibold">{product.revenue}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional role-specific cards */}
      {userRole === 'ADMIN' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Recent activity from your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="outline">Staff</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User role updated</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                  <Badge variant="outline">Manager</Badge>
                </div>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/users')}>
                  View all activity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Current system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <Badge variant="default">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Server</span>
                  <Badge variant="default">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backup</span>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/settings')}>
                  View system settings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}