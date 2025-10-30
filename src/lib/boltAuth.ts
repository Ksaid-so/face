import { PrismaClient } from '@prisma/client'
import { UserRole } from '@prisma/client'

const prisma = new PrismaClient()

export interface BoltUser {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export class BoltAuth {
  static async setUserContext(userId: string, userRole: string): Promise<void> {
    // In a real implementation, this would set the PostgreSQL session variables
    // for Row Level Security
    console.log(`Setting user context: ${userId}, role: ${userRole}`)
  }
}

// Server-side methods - only import bcrypt and define these methods on the server
// We'll use a factory function that can be dynamically imported on the server
export const getServerBoltAuth = async () => {
  // Only load bcrypt on the server
  if (typeof window === 'undefined') {
    const bcrypt = await import('bcrypt')
    
    return {
      async createUser(email: string, password: string, name?: string, role: UserRole = UserRole.STAFF): Promise<BoltUser | null> {
        try {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10)
          
          // Create user in database
          const user = await prisma.user.create({
            data: {
              email,
              name: name || null,
              role,
              password: hashedPassword
            }
          })
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        } catch (error) {
          console.error('Error creating user:', error)
          return null
        }
      },
      
      async authenticateUser(email: string, password: string): Promise<BoltUser | null> {
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email }
          })
          
          if (!user || !user.password) {
            return null
          }
          
          // Compare passwords
          const isValid = await bcrypt.compare(password, user.password)
          
          if (!isValid) {
            return null
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        } catch (error) {
          console.error('Error authenticating user:', error)
          return null
        }
      },
      
      async getUserById(id: string): Promise<BoltUser | null> {
        try {
          const user = await prisma.user.findUnique({
            where: { id }
          })
          
          if (!user) {
            return null
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          return null
        }
      }
    }
  }
  
  // Return null if we're on the client
  return null
}

export default BoltAuth