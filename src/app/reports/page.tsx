'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download,
  Calendar,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  FileText,
  RefreshCw,
  ShoppingCart,
  AlertTriangle,
  X,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Initialize date range to last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/reports?type=${activeTab}&startDate=${dateRange.start}&endDate=${dateRange.end}`);
      // const data = await response.json();
      
      // Mock data for now
      const mockData = {
        sales: {
          totalRevenue: 125000,
          totalSales: 842,
          averageOrderValue: 148.42,
          topProducts: [
            { name: 'Wireless Headphones', sales: 124, revenue: 12400 },
            { name: 'Smartphone', sales: 87, revenue: 26100 },
            { name: 'Laptop', sales: 45, revenue: 45000 },
            { name: 'Tablet', sales: 63, revenue: 18900 },
            { name: 'Smart Watch', sales: 92, revenue: 9200 },
          ],
          dailySales: [
            { date: '2024-01-01', sales: 24, revenue: 3200 },
            { date: '2024-01-02', sales: 18, revenue: 2800 },
            { date: '2024-01-03', sales: 31, revenue: 4100 },
            { date: '2024-01-04', sales: 27, revenue: 3800 },
            { date: '2024-01-05', sales: 42, revenue: 5600 },
            { date: '2024-01-06', sales: 35, revenue: 4900 },
            { date: '2024-01-07', sales: 29, revenue: 4200 },
          ]
        },
        inventory: {
          totalProducts: 1247,
          lowStockItems: 23,
          outOfStockItems: 8,
          overstockItems: 15,
          categoryBreakdown: [
            { category: 'Electronics', count: 420, value: 85000 },
            { category: 'Clothing', count: 315, value: 12500 },
            { category: 'Home Goods', count: 280, value: 18000 },
            { category: 'Books', count: 156, value: 4200 },
            { category: 'Other', count: 76, value: 5400 },
          ],
          recentAdjustments: [
            { product: 'Wireless Mouse', adjustment: -15, reason: 'Damaged items', date: '2024-01-05' },
            { product: 'USB Cable', adjustment: 50, reason: 'New shipment', date: '2024-01-04' },
            { product: 'Keyboard', adjustment: -8, reason: 'Quality issues', date: '2024-01-03' },
          ]
        },
        expenses: [
          { id: '1', title: 'Office Rent', category: 'RENT', date: '2024-01-01', amount: 2500 },
          { id: '2', title: 'Electricity Bill', category: 'UTILITIES', date: '2024-01-05', amount: 350 },
          { id: '3', title: 'Employee Salaries', category: 'SALARIES', date: '2024-01-10', amount: 15000 },
          { id: '4', title: 'Office Supplies', category: 'SUPPLIES', date: '2024-01-12', amount: 125 },
          { id: '5', title: 'Marketing Campaign', category: 'MARKETING', date: '2024-01-15', amount: 800 },
        ],
        recentSales: [
          { id: 'INV-001', date: '2024-01-07', customer: 'John Doe', items: 3, total: 156.00, staff: 'Jane Smith' },
          { id: 'INV-002', date: '2024-01-07', customer: 'Jane Smith', items: 1, total: 89.50, staff: 'John Doe' },
          { id: 'INV-003', date: '2024-01-06', customer: 'Bob Johnson', items: 5, total: 234.00, staff: 'Jane Smith' },
          { id: 'INV-004', date: '2024-01-06', customer: 'Alice Brown', items: 2, total: 67.25, staff: 'John Doe' },
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReportData();
    }
  }, [activeTab, dateRange]);

  const handleExport = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/reports?type=${activeTab}&startDate=${dateRange.start}&endDate=${dateRange.end}&format=${exportFormat}`);
      
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and export detailed business reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchReportData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>
            Select the date range for your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales">
          {reportData?.sales && (
            <div className="space-y-6">
              {/* Sales Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(reportData.sales.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.sales.totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(reportData.sales.averageOrderValue)}</div>
                    <p className="text-xs text-muted-foreground">
                      +2.3% from last period
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>
                      Best performing products by revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.sales.topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Sales Trend</CardTitle>
                    <CardDescription>
                      Revenue trend over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.sales.dailySales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Sales Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Latest completed transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Invoice</th>
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Customer</th>
                          <th className="text-left py-2">Items</th>
                          <th className="text-right py-2">Total</th>
                          <th className="text-left py-2">Staff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.recentSales.map((sale: any) => (
                          <tr key={sale.id} className="border-b">
                            <td className="py-2">{sale.invoiceNo}</td>
                            <td className="py-2">{new Date(sale.date).toLocaleDateString()}</td>
                            <td className="py-2">{sale.customer}</td>
                            <td className="py-2">{sale.items}</td>
                            <td className="py-2 text-right">{formatCurrency(sale.total)}</td>
                            <td className="py-2">{sale.staff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory">
          {reportData?.inventory && (
            <div className="space-y-6">
              {/* Inventory Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.inventory.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      In catalog
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{reportData.inventory.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Items below minimum
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{reportData.inventory.outOfStockItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Items unavailable
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overstock</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.inventory.overstockItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Items above maximum
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>
                      Product distribution by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.inventory.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {reportData.inventory.categoryBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Items']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Value</CardTitle>
                    <CardDescription>
                      Total value by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.inventory.categoryBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" name="Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Adjustments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Adjustments</CardTitle>
                  <CardDescription>
                    Latest inventory adjustments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Product</th>
                          <th className="text-left py-2">Adjustment</th>
                          <th className="text-left py-2">Reason</th>
                          <th className="text-left py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.inventory.recentAdjustments.map((adj: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{adj.product}</td>
                            <td className={`py-2 ${adj.adjustment < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {adj.adjustment > 0 ? '+' : ''}{adj.adjustment}
                            </td>
                            <td className="py-2">{adj.reason}</td>
                            <td className="py-2">{new Date(adj.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Expenses Report */}
        <TabsContent value="expenses">
          {reportData && (
            <div className="space-y-6">
              {/* Expenses Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Operating Expenses</CardTitle>
                  <CardDescription>Business expenses during period</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData.expenses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Title</th>
                            <th className="text-left py-2">Category</th>
                            <th className="text-left py-2">Date</th>
                            <th className="text-right py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.expenses.map((expense: any) => (
                            <tr key={expense.id} className="border-b">
                              <td className="py-2">{expense.title}</td>
                              <td className="py-2">{expense.category}</td>
                              <td className="py-2">{new Date(expense.date).toLocaleDateString()}</td>
                              <td className="py-2 text-right">{formatCurrency(expense.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No expenses found for the selected period.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Summary Report */}
        <TabsContent value="summary">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>
                  Key metrics and insights for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3>Performance Overview</h3>
                  <p>
                    This report summarizes the key performance indicators for your business during the selected period.
                    Overall, the business has shown positive growth trends with some areas requiring attention.
                  </p>
                  
                  <h4>Key Highlights</h4>
                  <ul>
                    <li>Revenue increased by 12% compared to the previous period</li>
                    <li>Inventory turnover improved by 8%</li>
                    <li>Customer satisfaction scores remained high at 4.7/5.0</li>
                    <li>Operational costs decreased by 3% due to efficiency improvements</li>
                  </ul>
                  
                  <h4>Areas for Improvement</h4>
                  <ul>
                    <li>Reduce out-of-stock incidents by 15% through better demand forecasting</li>
                    <li>Optimize marketing spend to improve ROI by 10%</li>
                    <li>Implement staff training to reduce transaction errors by 20%</li>
                  </ul>
                  
                  <h4>Recommendations</h4>
                  <ol>
                    <li>Invest in advanced inventory management tools to improve forecasting accuracy</li>
                    <li>Review and optimize marketing channels based on performance data</li>
                    <li>Conduct regular staff training sessions to maintain service quality</li>
                    <li>Expand product lines in high-performing categories</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}