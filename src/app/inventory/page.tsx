'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';

export default function InventoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, searchQuery, filters } = useSelector((state: RootState) => state.inventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    maxStock: '',
    category: '',
    isActive: true
  });

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

  // CRUD Functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      barcode: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      maxStock: '',
      category: '',
      isActive: true
    });
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku || `SKU-${Date.now()}`,
      barcode: formData.barcode || `BAR-${Date.now()}`,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock) || 10,
      maxStock: parseInt(formData.maxStock) || 100,
      isActive: formData.isActive,
      category: { name: formData.category || 'Other' },
    };

    // In a real app, this would be an API call
    mockProducts.push(newProduct);
    dispatch(setProducts([...mockProducts]));
    
    toast.success('Product added successfully');
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      maxStock: product.maxStock.toString(),
      category: product.category?.name || '',
      isActive: product.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct || !formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock) || 10,
      maxStock: parseInt(formData.maxStock) || 100,
      isActive: formData.isActive,
      category: { name: formData.category || 'Other' },
    };

    const index = mockProducts.findIndex(p => p.id === selectedProduct.id);
    if (index !== -1) {
      mockProducts[index] = updatedProduct;
      dispatch(setProducts([...mockProducts]));
      
      toast.success('Product updated successfully');
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = (product: any) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      const index = mockProducts.findIndex(p => p.id === product.id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        dispatch(setProducts([...mockProducts]));
        
        toast.success('Product deleted successfully');
      }
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'SKU', 'Barcode', 'Price', 'Cost', 'Stock', 'Min Stock', 'Max Stock', 'Category', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.name,
        product.sku,
        product.barcode,
        product.price,
        product.cost,
        product.stock,
        product.minStock,
        product.maxStock,
        product.category?.name || '',
        getStockStatus(product).status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Inventory exported successfully');
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
            <Button variant="outline" onClick={handleExport}>
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
                      Name *
                    </Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Product name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <Input 
                      id="sku" 
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Auto-generated"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="barcode" className="text-right">
                      Barcode
                    </Label>
                    <Input 
                      id="barcode" 
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Auto-generated"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price *
                    </Label>
                    <Input 
                      id="price" 
                      name="price"
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost
                    </Label>
                    <Input 
                      id="cost" 
                      name="cost"
                      type="number" 
                      step="0.01"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock *
                    </Label>
                    <Input 
                      id="stock" 
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minStock" className="text-right">
                      Min Stock
                    </Label>
                    <Input 
                      id="minStock" 
                      name="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="10"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxStock" className="text-right">
                      Max Stock
                    </Label>
                    <Input 
                      id="maxStock" 
                      name="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddProduct}>
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
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
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

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name *
                </Label>
                <Input 
                  id="edit-name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sku" className="text-right">
                  SKU
                </Label>
                <Input 
                  id="edit-sku" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="SKU"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-barcode" className="text-right">
                  Barcode
                </Label>
                <Input 
                  id="edit-barcode" 
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="Barcode"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price *
                </Label>
                <Input 
                  id="edit-price" 
                  name="price"
                  type="number" 
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost" className="text-right">
                  Cost
                </Label>
                <Input 
                  id="edit-cost" 
                  name="cost"
                  type="number" 
                  step="0.01"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">
                  Stock *
                </Label>
                <Input 
                  id="edit-stock" 
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-minStock" className="text-right">
                  Min Stock
                </Label>
                <Input 
                  id="edit-minStock" 
                  name="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-maxStock" className="text-right">
                  Max Stock
                </Label>
                <Input 
                  id="edit-maxStock" 
                  name="maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
                setSelectedProduct(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleUpdateProduct}>
                Update Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}