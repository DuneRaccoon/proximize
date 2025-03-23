import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'customer' | 'campaign' | 'pass' | 'template' | 'location';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">No recent activity found</div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-4">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === 'customer'
                      ? 'bg-blue-500'
                      : activity.type === 'campaign'
                      ? 'bg-green-500'
                      : activity.type === 'pass'
                      ? 'bg-purple-500'
                      : activity.type === 'template'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
