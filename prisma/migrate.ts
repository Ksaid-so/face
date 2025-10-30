import { execSync } from 'child_process'

console.log('Starting database migration...')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Run migrations
  console.log('Running database migrations...')
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
  
  // Seed the database
  console.log('Seeding database...')
  execSync('npm run db:seed', { stdio: 'inherit' })
  
  console.log('Database migration completed successfully!')
} catch (error) {
  console.error('Migration failed:', error)
  process.exit(1)
}