'use client';

import { useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Calendar } from '@/components/ui/calendar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Receipt,
  DollarSign,
  Calendar as CalendarIcon,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  FileText,
  Upload
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: 'RENT' | 'UTILITIES' | 'SALARIES' | 'SUPPLIES' | 'MAINTENANCE' | 'MARKETING' | 'OTHER';
  date: string;
  userName: string;
  receiptUrl?: string;
  createdAt: string;
}

export default function ExpensesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('this-month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock expenses data
  const mockExpenses: Expense[] = [
    {
      id: '1',
      title: 'Office Rent',
      description: 'Monthly office rent payment',
      amount: 2500,
      category: 'RENT',
      date: '2024-01-01',
      userName: 'John Doe',
      receiptUrl: '/receipts/rent-jan-2024.pdf',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      title: 'Electricity Bill',
      description: 'January electricity bill',
      amount: 350,
      category: 'UTILITIES',
      date: '2024-01-05',
      userName: 'Jane Smith',
      receiptUrl: '/receipts/electricity-jan-2024.pdf',
      createdAt: '2024-01-05T14:30:00Z',
    },
    {
      id: '3',
      title: 'Employee Salaries',
      description: 'Monthly payroll for all employees',
      amount: 15000,
      category: 'SALARIES',
      date: '2024-01-10',
      userName: 'John Doe',
      createdAt: '2024-01-10T09:00:00Z',
    },
    {
      id: '4',
      title: 'Office Supplies',
      description: 'Pens, papers, and other office supplies',
      amount: 125,
      category: 'SUPPLIES',
      date: '2024-01-12',
      userName: 'Bob Johnson',
      receiptUrl: '/receipts/supplies-jan-2024.pdf',
      createdAt: '2024-01-12T11:15:00Z',
    },
    {
      id: '5',
      title: 'Marketing Campaign',
      description: 'Google Ads campaign for January',
      amount: 800,
      category: 'MARKETING',
      date: '2024-01-15',
      userName: 'Alice Brown',
      receiptUrl: '/receipts/marketing-jan-2024.pdf',
      createdAt: '2024-01-15T16:45:00Z',
    },
    {
      id: '6',
      title: 'AC Maintenance',
      description: 'Quarterly air conditioning maintenance',
      amount: 200,
      category: 'MAINTENANCE',
      date: '2024-01-18',
      userName: 'John Doe',
      receiptUrl: '/receipts/maintenance-jan-2024.pdf',
      createdAt: '2024-01-18T13:20:00Z',
    },
  ];

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;

    // Simple date filtering (in a real app, you'd implement proper date range filtering)
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'this-month' && expense.date.startsWith('2024-01'));

    return matchesSearch && matchesCategory && matchesDate;
  });

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'RENT':
        return 'default' as const;
      case 'UTILITIES':
        return 'secondary' as const;
      case 'SALARIES':
        return 'destructive' as const;
      case 'SUPPLIES':
        return 'outline' as const;
      case 'MAINTENANCE':
        return 'warning' as const;
      case 'MARKETING':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RENT':
        return <DollarSign className="h-4 w-4" />;
      case 'UTILITIES':
        return <TrendingUp className="h-4 w-4" />;
      case 'SALARIES':
        return <DollarSign className="h-4 w-4" />;
      case 'SUPPLIES':
        return <FileText className="h-4 w-4" />;
      case 'MAINTENANCE':
        return <TrendingDown className="h-4 w-4" />;
      case 'MARKETING':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = mockExpenses
    .filter(e => e.date.startsWith('2024-01'))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = mockExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    totalThisMonth: thisMonthExpenses,
    totalFiltered: totalExpenses,
    averageExpense: filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0,
    expenseCount: filteredExpenses.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
              <p className="text-muted-foreground">
                Track and manage your business expenses.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Record a new business expense.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input id="amount" type="number" step="0.01" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RENT">Rent</SelectItem>
                        <SelectItem value="UTILITIES">Utilities</SelectItem>
                        <SelectItem value="SALARIES">Salaries</SelectItem>
                        <SelectItem value="SUPPLIES">Supplies</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input id="date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="receipt" className="text-right">
                      Receipt
                    </Label>
                    <div className="col-span-3">
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                    Add Expense
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalThisMonth)}</div>
              <p className="text-xs text-muted-foreground">
                Total expenses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Total</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalFiltered)}</div>
              <p className="text-xs text-muted-foreground">
                Current filter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageExpense)}</div>
              <p className="text-xs text-muted-foreground">
                Per expense
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Count</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expenseCount}</div>
              <p className="text-xs text-muted-foreground">
                Expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Expense distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <Card key={category}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                      <Badge variant={getCategoryBadgeVariant(category)}>
                        {mockExpenses.filter(e => e.category === category).length}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold">{formatCurrency(total)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="RENT">Rent</SelectItem>
                    <SelectItem value="UTILITIES">Utilities</SelectItem>
                    <SelectItem value="SALARIES">Salaries</SelectItem>
                    <SelectItem value="SUPPLIES">Supplies</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
            <CardDescription>
              A list of all business expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.title}</div>
                        {expense.description && (
                          <div className="text-sm text-muted-foreground">{expense.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(expense.category)}
                        <Badge variant={getCategoryBadgeVariant(expense.category)}>
                          {expense.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{expense.userName}</TableCell>
                    <TableCell>
                      {expense.receiptUrl ? (
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Expense
                          </DropdownMenuItem>
                          {expense.receiptUrl && (
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Receipt
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Expense
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}