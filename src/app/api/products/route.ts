import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    
    // Build where clause
    const where: any = {
      isActive: true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    // Get products
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.product.count({ where })
    ])
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can create products)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Create product
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        sku: body.sku,
        barcode: body.barcode,
        price: parseFloat(body.price),
        cost: parseFloat(body.cost),
        stock: parseInt(body.stock),
        minStock: parseInt(body.minStock),
        maxStock: parseInt(body.maxStock),
        isActive: body.isActive !== undefined ? body.isActive : true,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl
      },
      include: {
        category: true
      }
    })
    
    // Log product creation
    const { logProductCreation } = await import('@/lib/productHistory')
    await logProductCreation(product.id, session.user.id || '')
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}