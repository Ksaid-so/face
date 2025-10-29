'use client';

import { useState } from 'react';
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
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  Filter,
  Download
} from 'lucide-react';
import { setProducts, setSearchQuery, setFilters } from '@/features/inventory/inventorySlice';
import type { RootState } from '@/lib/store';

export default function InventoryPage() {
  const dispatch = useDispatch();
  const { products, searchQuery, filters } = useSelector((state: RootState) => state.inventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock data for now
  const mockProducts = [
    {
      id: '1',
      name: 'Wireless Mouse',
      sku: 'WM-001',
      barcode: '1234567890123',
      price: 29.99,
      cost: 15.50,
      stock: 45,
      minStock: 10,
      maxStock: 100,
      isActive: true,
      category: { name: 'Electronics' },
    },
    {
      id: '2',
      name: 'USB Cable',
      sku: 'UC-002',
      barcode: '1234567890124',
      price: 12.99,
      cost: 5.25,
      stock: 8,
      minStock: 20,
      maxStock: 200,
      isActive: true,
      category: { name: 'Accessories' },
    },
    {
      id: '3',
      name: 'Keyboard',
      sku: 'KB-003',
      barcode: '1234567890125',
      price: 79.99,
      cost: 35.00,
      stock: 23,
      minStock: 15,
      maxStock: 50,
      isActive: true,
      category: { name: 'Electronics' },
    },
    {
      id: '4',
      name: 'Monitor',
      sku: 'MN-004',
      barcode: '1234567890126',
      price: 299.99,
      cost: 180.00,
      stock: 12,
      minStock: 5,
      maxStock: 25,
      isActive: true,
      category: { name: 'Electronics' },
    },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode?.includes(searchQuery);
    
    const matchesCategory = filters.category === "all" || !filters.category || product.category?.name === filters.category;
    const matchesLowStock = !filters.lowStock || product.stock <= product.minStock;
    const matchesOutOfStock = !filters.outOfStock || product.stock === 0;
    const matchesActive = !filters.active || product.isActive;

    return matchesSearch && matchesCategory && matchesLowStock && matchesOutOfStock && matchesActive;
  });

  const getStockStatus = (product: any) => {
    if (product.stock === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock <= product.minStock) return { status: 'Low Stock', variant: 'warning' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your products, track stock levels, and receive alerts.
            </p>
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
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Create a new product in your inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <Input id="sku" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="barcode" className="text-right">
                      Barcode
                    </Label>
                    <Input id="barcode" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input id="price" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost
                    </Label>
                    <Input id="cost" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <Input id="stock" type="number" className="col-span-3" />
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
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                    Save Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
                    placeholder="Search products by name, SKU, or barcode..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(value) => dispatch(setFilters({ category: value }))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={filters.lowStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setFilters({ lowStock: !filters.lowStock }))}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Stock
                </Button>
                <Button
                  variant={filters.outOfStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setFilters({ outOfStock: !filters.outOfStock }))}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Out of Stock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <CardDescription>
              A list of all your products in the inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Cost: ${product.cost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell className="font-mono">{product.barcode}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stock}</span>
                          {product.stock <= product.minStock && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                      </TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}