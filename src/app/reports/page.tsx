'use client';

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
  RefreshCw
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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    });
  }, []);

  const fetchReport = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?type=${type}&startDate=${dateRange.start}&endDate=${dateRange.end}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReportData(data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReport(activeTab);
    }
  }, [activeTab, dateRange]);

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/reports?type=${activeTab}&startDate=${dateRange.start}&endDate=${dateRange.end}&format=${exportFormat}`);
      if (!response.ok) {
        throw new Error('Failed to export report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-report-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive business reports and analytics.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchReport(activeTab)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExport} disabled={loading}>
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
              Select the date range for your reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="export-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
            <TabsTrigger value="profit">Profit Report</TabsTrigger>
            <TabsTrigger value="customer">Customer Report</TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : reportData ? (
              <>
                {/* Sales Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.totalSales}</div>
                      <p className="text-xs text-muted-foreground">
                        Transactions in period
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Gross sales revenue
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.averageSaleValue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Per transaction
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalDiscounts)}</div>
                      <p className="text-xs text-muted-foreground">
                        Applied discounts
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Daily Sales Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Sales Trend</CardTitle>
                      <CardDescription>Sales volume and revenue over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={reportData.dailySales}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Selling Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>Best performing products by quantity sold</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.topProducts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="quantity" fill="#82ca9d" />
                        </BarChart>
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
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales data available for the selected period.</p>
              </div>
            )}
          </TabsContent>

          {/* Inventory Report */}
          <TabsContent value="inventory" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : reportData ? (
              <>
                {/* Inventory Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.totalProducts}</div>
                      <p className="text-xs text-muted-foreground">
                        Active products
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalStockValue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Current inventory value
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.lowStockItems}</div>
                      <p className="text-xs text-muted-foreground">
                        Need restocking
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overstock Items</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.overStockItems}</div>
                      <p className="text-xs text-muted-foreground">
                        Excess inventory
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Profit Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalProfitValue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Potential profit
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stock Alerts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Low Stock Alerts</CardTitle>
                      <CardDescription>Products below minimum stock levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reportData.stockAlerts.lowStock.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Product</th>
                                <th className="text-left py-2">SKU</th>
                                <th className="text-left py-2">Current</th>
                                <th className="text-left py-2">Min</th>
                                <th className="text-left py-2">Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.stockAlerts.lowStock.map((product: any) => (
                                <tr key={product.id} className="border-b">
                                  <td className="py-2">{product.name}</td>
                                  <td className="py-2">{product.sku}</td>
                                  <td className="py-2">{product.currentStock}</td>
                                  <td className="py-2">{product.minStock}</td>
                                  <td className="py-2">{product.category}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No low stock items</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Overstock Alerts</CardTitle>
                      <CardDescription>Products exceeding maximum stock levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reportData.stockAlerts.overStock.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Product</th>
                                <th className="text-left py-2">SKU</th>
                                <th className="text-left py-2">Current</th>
                                <th className="text-left py-2">Max</th>
                                <th className="text-left py-2">Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.stockAlerts.overStock.map((product: any) => (
                                <tr key={product.id} className="border-b">
                                  <td className="py-2">{product.name}</td>
                                  <td className="py-2">{product.sku}</td>
                                  <td className="py-2">{product.currentStock}</td>
                                  <td className="py-2">{product.maxStock}</td>
                                  <td className="py-2">{product.category}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No overstock items</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory by Category</CardTitle>
                    <CardDescription>Stock distribution across categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, value }) => `${category}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.categoryBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No inventory data available.</p>
              </div>
            )}
          </TabsContent>

          {/* Profit Report */}
          <TabsContent value="profit" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : reportData ? (
              <>
                {/* Profit Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalSalesRevenue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Total sales revenue
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Cost of Goods</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalCostOfGoods)}</div>
                      <p className="text-xs text-muted-foreground">
                        Direct product costs
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.grossProfit)}</div>
                      <p className="text-xs text-muted-foreground">
                        {reportData.summary.grossProfitMargin.toFixed(2)}% margin
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.netProfit)}</div>
                      <p className="text-xs text-muted-foreground">
                        {reportData.summary.netProfitMargin.toFixed(2)}% margin
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Profit Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profit Trend</CardTitle>
                    <CardDescription>Gross profit over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.sales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                        <Line type="monotone" dataKey="costOfGoods" stroke="#ff7c7c" name="Cost of Goods" />
                        <Line type="monotone" dataKey="grossProfit" stroke="#82ca9d" name="Gross Profit" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Expenses */}
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
                      <div className="text-center py-4 text-muted-foreground">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No expenses recorded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No profit data available.</p>
              </div>
            )}
          </TabsContent>

          {/* Customer Report */}
          <TabsContent value="customer" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : reportData ? (
              <>
                {/* Customer Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.totalCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        Registered customers
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.summary.totalPurchases}</div>
                      <p className="text-xs text-muted-foreground">
                        Customer transactions
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</div>
                      <p className="text-xs text-muted-foreground">
                        From customer sales
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(reportData.summary.averageCustomerValue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Per customer
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Highest spending customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reportData.topCustomers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Customer</th>
                              <th className="text-left py-2">Email</th>
                              <th className="text-right py-2">Total Spent</th>
                              <th className="text-right py-2">Purchases</th>
                              <th className="text-right py-2">Avg Order</th>
                              <th className="text-left py-2">First Purchase</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.topCustomers.map((customer: any) => (
                              <tr key={customer.id} className="border-b">
                                <td className="py-2">{customer.name || 'N/A'}</td>
                                <td className="py-2">{customer.email || 'N/A'}</td>
                                <td className="py-2 text-right">{formatCurrency(customer.totalSpent)}</td>
                                <td className="py-2 text-right">{customer.purchaseCount}</td>
                                <td className="py-2 text-right">{formatCurrency(customer.averageOrderValue)}</td>
                                <td className="py-2">{customer.firstPurchase ? new Date(customer.firstPurchase).toLocaleDateString() : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No customer data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No customer data available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}