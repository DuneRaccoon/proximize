import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: number;
  className?: string;
}

export function StatsCard({ title, value, icon, description, change, className }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
        </div>
        <div className="mt-2 flex items-baseline">
          <h2 className="text-3xl font-semibold">{value}</h2>
          {change !== undefined && (
            <div
              className={cn(
                'ml-2 flex items-center text-xs font-medium',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
