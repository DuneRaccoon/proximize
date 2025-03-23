'use client';

import React, { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { Button } from '@/components/ui/button';
import { Plus, Users, CreditCard, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { customerService, campaignService, passService, templateService } from '@/lib/api';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customerCount: 0,
    passCount: 0,
    campaignCount: 0,
    templateCount: 0,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: '1',
      title: 'New customer registered',
      description: 'John Doe joined your customer list',
      timestamp: new Date().toISOString(),
      type: 'customer' as const,
    },
    {
      id: '2',
      title: 'Campaign started',
      description: 'Summer Promotion campaign is now active',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'campaign' as const,
    },
    {
      id: '3',
      title: 'Pass redeemed',
      description: 'Pass #1234 was redeemed by Jane Smith',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'pass' as const,
    },
  ]);

  const chartData = [
    { name: 'Jan', passes: 40, redemptions: 24 },
    { name: 'Feb', passes: 30, redemptions: 18 },
    { name: 'Mar', passes: 20, redemptions: 10 },
    { name: 'Apr', passes: 27, redemptions: 12 },
    { name: 'May', passes: 45, redemptions: 25 },
    { name: 'Jun', passes: 78, redemptions: 42 },
    { name: 'Jul', passes: 65, redemptions: 30 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, we'd make these API calls properly
        const [customers, passes, campaigns, templates] = await Promise.all([
          customerService.getAllCustomers(),
          passService.getAllPasses(),
          campaignService.getAllCampaigns(),
          templateService.getAllTemplates(),
        ]);

        setStats({
          customerCount: customers.length,
          passCount: passes.length,
          campaignCount: campaigns.length,
          templateCount: templates.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link href="/templates/new">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Template
            </Button>
          </Link>
          <Link href="/campaigns/new">
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value={stats.customerCount}
          icon={<Users className="h-4 w-4" />}
          description="Active customers in your database"
          change={8.2}
        />
        <StatsCard
          title="Passes Created"
          value={stats.passCount}
          icon={<CreditCard className="h-4 w-4" />}
          description="Total passes issued to customers"
          change={12.5}
        />
        <StatsCard
          title="Active Campaigns"
          value={stats.campaignCount}
          icon={<Mail className="h-4 w-4" />}
          description="Currently running campaigns"
          change={-3.8}
        />
        <StatsCard
          title="Templates"
          value={stats.templateCount}
          icon={<MapPin className="h-4 w-4" />}
          description="Available pass templates"
          change={5.1}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-5">
          <OverviewChart data={chartData} />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
