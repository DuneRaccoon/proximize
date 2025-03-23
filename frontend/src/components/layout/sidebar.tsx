import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  CreditCard,
  Mail,
  MapPin,
  LayoutDashboard,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-primary',
        isActive ? 'bg-primary/10 font-medium text-primary' : 'text-gray-600'
      )}
    >
      <div className="mr-3">{icon}</div>
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-gray-200 bg-white pt-16 md:block">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Wallet Pass Manager</h2>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem href="/customers" icon={<Users size={18} />} label="Customers" />
          <SidebarItem href="/templates" icon={<CreditCard size={18} />} label="Pass Templates" />
          <SidebarItem href="/passes" icon={<CreditCard size={18} />} label="Passes" />
          <SidebarItem href="/campaigns" icon={<Mail size={18} />} label="Campaigns" />
          <SidebarItem href="/locations" icon={<MapPin size={18} />} label="Locations" />
        </nav>

        <div className="border-t border-gray-200 px-2 py-4">
          <SidebarItem href="/settings" icon={<Settings size={18} />} label="Settings" />
          <SidebarItem href="/help" icon={<HelpCircle size={18} />} label="Help & Support" />
        </div>
      </div>
    </aside>
  );
}
