'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import InventoryAlerts from '@/components/alerts/InventoryAlerts';

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <InventoryAlerts />
    </DashboardLayout>
  );
}