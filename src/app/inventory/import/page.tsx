'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function ImportProductsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      
      setFile(selectedFile)
      setError('')
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('entityType', 'products')

      const response = await fetch('/api/bulk/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to import products')
      }

      const data = await response.json()
      setResults(data)
      
      if (data.errors && data.errors.length > 0) {
        toast.error(`Import completed with ${data.errors.length} errors`)
      } else {
        toast.success('Products imported successfully')
      }
    } catch (err) {
      setError(err.message || 'Failed to import products')
      toast.error('Import failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Create CSV template
    const template = `name,sku,barcode,price,cost,stock,minStock,maxStock,category,description
Wireless Mouse,WM-001,1234567890123,29.99,15.50,45,10,100,Electronics,High-quality wireless mouse
USB Cable,UC-002,1234567890124,12.99,5.25,100,20,200,Accessories,Durable USB cable
Keyboard,KB-003,1234567890125,79.99,35.00,25,15,50,Electronics,Mechanical keyboard`

    // Create and download file
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Products</h1>
            <p className="text-muted-foreground">
              Import products from a CSV file
            </p>
          </div>
          <Button onClick={() => router.push('/inventory')}>
            Back to Inventory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Products</CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple products at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="file">CSV File</Label>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  Download Template
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <Button 
                  onClick={handleImport} 
                  disabled={!file || loading}
                >
                  {loading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import Products'
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                CSV file should include columns: name, sku, barcode, price, cost, stock, minStock, maxStock, category, description
              </p>
            </div>

            {results && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Import Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">
                        {results.results.filter((r: any) => r.action === 'created').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Products Created</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">
                        {results.results.filter((r: any) => r.action === 'updated').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Products Updated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-destructive">
                        {results.errors?.length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Errors</p>
                    </CardContent>
                  </Card>
                </div>
                
                {results.errors && results.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Errors:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.errors.slice(0, 5).map((error: any, index: number) => (
                        <li key={index} className="text-sm text-destructive">
                          Row {index + 1}: {error.error}
                        </li>
                      ))}
                      {results.errors.length > 5 && (
                        <li className="text-sm text-muted-foreground">
                          ...and {results.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}