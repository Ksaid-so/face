'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { setProducts } from '@/features/inventory/inventorySlice'
import type { RootState } from '@/lib/store'

export default function AdjustStockPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { products } = useSelector((state: RootState) => state.inventory)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [adjustment, setAdjustment] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        dispatch(setProducts(data.products))
      } catch (error) {
        toast.error('Failed to load products')
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [dispatch])

  const handleAdjustStock = async () => {
    if (!selectedProductId || !adjustment) {
      setError('Please select a product and enter an adjustment value')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stock/adjustment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProductId,
          adjustment: parseInt(adjustment),
          reason: reason || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to adjust stock')
      }

      const data = await response.json()
      
      // Update local state
      dispatch(setProducts(products.map(p => 
        p.id === selectedProductId ? { ...p, stock: data.product.stock } : p
      )))
      
      toast.success(`Stock adjusted successfully. New stock level: ${data.product.stock}`)
      
      // Reset form
      setSelectedProductId('')
      setAdjustment('')
      setReason('')
    } catch (err) {
      setError(err.message || 'Failed to adjust stock')
      toast.error('Stock adjustment failed')
    } finally {
      setLoading(false)
    }
  }

  const selectedProduct = products.find(p => p.id === selectedProductId)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Adjust Stock</h1>
            <p className="text-muted-foreground">
              Manually adjust product stock levels
            </p>
          </div>
          <Button onClick={() => router.push('/inventory')}>
            Back to Inventory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Adjustment</CardTitle>
            <CardDescription>
              Adjust the stock level for a specific product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (SKU: {product.sku || 'N/A'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adjustment">Adjustment</Label>
                  <div className="flex gap-2">
                    <Input
                      id="adjustment"
                      type="number"
                      value={adjustment}
                      onChange={(e) => setAdjustment(e.target.value)}
                      placeholder="Enter adjustment amount"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>Positive to add, negative to remove</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for adjustment"
                  />
                </div>
                
                <Button 
                  onClick={handleAdjustStock} 
                  disabled={!selectedProductId || !adjustment || loading}
                >
                  {loading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    'Adjust Stock'
                  )}
                </Button>
              </div>
              
              {selectedProduct && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className="font-medium">{selectedProduct.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Stock:</span>
                        <span className="font-medium">{selectedProduct.minStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Stock:</span>
                        <span className="font-medium">{selectedProduct.maxStock}</span>
                      </div>
                      {adjustment && (
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">New Stock:</span>
                          <span className="font-medium text-lg">
                            {selectedProduct.stock + parseInt(adjustment)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}