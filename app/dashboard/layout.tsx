import { DashboardLayout } from '@/components/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout title="" description="">{children}</DashboardLayout>;
}
