import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productSchema, productUpdateSchema } from '@/lib/schemas/productSchema'
import { handleApiError, sendErrorResponse, ApiError, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errorHandler'

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
      throw new UnauthorizedError();
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
    const apiError = handleApiError(error);
    return sendErrorResponse(apiError);
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    // Check permissions (only ADMIN and MANAGER can create products)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      throw new ForbiddenError();
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Validate input
    const validatedData = productSchema.parse(body);
    
    // Create product
    const product = await db.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        sku: validatedData.sku,
        barcode: validatedData.barcode,
        price: validatedData.price,
        cost: validatedData.cost,
        stock: validatedData.stock,
        minStock: validatedData.minStock,
        maxStock: validatedData.maxStock,
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
        categoryId: validatedData.categoryId,
        imageUrl: validatedData.imageUrl
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
    const apiError = handleApiError(error);
    return sendErrorResponse(apiError);
  }
}