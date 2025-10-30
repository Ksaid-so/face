import { db } from '@/lib/db'

export async function checkLowStockAlerts() {
  try {
    // Find products with low stock
    const lowStockProducts = await db.product.findMany({
      where: {
        stock: {
          lte: db.product.fields.minStock
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true
      }
    })

    // Check for existing alerts for these products
    const existingAlerts = await db.inventoryAlert.findMany({
      where: {
        productId: {
          in: lowStockProducts.map(p => p.id)
        },
        type: 'LOW_STOCK',
        isRead: false
      },
      select: {
        productId: true
      }
    })

    const existingAlertProductIds = new Set(existingAlerts.map(a => a.productId))

    // Create alerts for products without existing alerts
    const newAlerts = []
    for (const product of lowStockProducts) {
      if (!existingAlertProductIds.has(product.id)) {
        const alert = await db.inventoryAlert.create({
          data: {
            productId: product.id,
            type: 'LOW_STOCK',
            message: `Low stock alert for ${product.name}. Current stock: ${product.stock}, minimum required: ${product.minStock}`
          }
        })
        newAlerts.push(alert)
      }
    }

    console.log(`Generated ${newAlerts.length} new low stock alerts`)
    return newAlerts
  } catch (error) {
    console.error('Error generating low stock alerts:', error)
    throw error
  }
}

export async function checkOverstockAlerts() {
  try {
    // Find products with overstock
    const overstockProducts = await db.product.findMany({
      where: {
        stock: {
          gte: db.product.fields.maxStock
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        maxStock: true
      }
    })

    // Check for existing alerts for these products
    const existingAlerts = await db.inventoryAlert.findMany({
      where: {
        productId: {
          in: overstockProducts.map(p => p.id)
        },
        type: 'OVERSTOCK',
        isRead: false
      },
      select: {
        productId: true
      }
    })

    const existingAlertProductIds = new Set(existingAlerts.map(a => a.productId))

    // Create alerts for products without existing alerts
    const newAlerts = []
    for (const product of overstockProducts) {
      if (!existingAlertProductIds.has(product.id)) {
        const alert = await db.inventoryAlert.create({
          data: {
            productId: product.id,
            type: 'OVERSTOCK',
            message: `Overstock alert for ${product.name}. Current stock: ${product.stock}, maximum recommended: ${product.maxStock}`
          }
        })
        newAlerts.push(alert)
      }
    }

    console.log(`Generated ${newAlerts.length} new overstock alerts`)
    return newAlerts
  } catch (error) {
    console.error('Error generating overstock alerts:', error)
    throw error
  }
}