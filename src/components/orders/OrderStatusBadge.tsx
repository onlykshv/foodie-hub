import React from 'react';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { OrderStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<OrderStatus, { 
  icon: React.ElementType; 
  label: string; 
  className: string;
}> = {
  placed: {
    icon: Package,
    label: 'Placed',
    className: 'status-placed',
  },
  preparing: {
    icon: Clock,
    label: 'Preparing',
    className: 'status-preparing',
  },
  ready: {
    icon: CheckCircle,
    label: 'Ready',
    className: 'status-ready',
  },
  delivered: {
    icon: Truck,
    label: 'Delivered',
    className: 'status-delivered',
  },
};

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span className={cn('status-badge', config.className, sizeClasses[size])}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
