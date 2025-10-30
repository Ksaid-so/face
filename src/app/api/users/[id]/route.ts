import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (users can view themselves, ADMIN can view all)
    if (session.user.id !== params.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get user
    const user = await db.user.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (users can update themselves, ADMIN can update all)
    if (session.user.id !== params.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Check if another user with same email already exists
    if (body.email && body.email !== existingUser.email) {
      const duplicateUser = await db.user.findUnique({
        where: {
          email: body.email
        }
      })
      
      if (duplicateUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
    }
    
    // Prepare update data
    const updateData: any = {
      name: body.name,
      updatedAt: new Date()
    }
    
    // Only ADMIN can change role
    if (session.user.role === 'ADMIN' && body.role) {
      updateData.role = body.role
    }
    
    // Update user
    const user = await db.user.update({
      where: {
        id: params.id
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN can delete users)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Prevent deleting yourself
    if (session.user.id === params.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }
    
    // Delete user
    await db.user.delete({
      where: {
        id: params.id
      }
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}