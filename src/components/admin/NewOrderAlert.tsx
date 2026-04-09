import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NewOrderAlertProps {
  newOrderCount: number;
  onClearAlerts: () => void;
}

export function NewOrderAlert({ newOrderCount, onClearAlerts }: NewOrderAlertProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (newOrderCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newOrderCount]);

  return (
    <div className="flex items-center gap-2">
      {/* Sound toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="text-muted-foreground"
        title={soundEnabled ? 'Mute notifications' : 'Enable sound'}
      >
        {soundEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>

      {/* Notification bell */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative',
              isAnimating && 'animate-bounce-subtle'
            )}
          >
            {newOrderCount > 0 ? (
              <BellRing className="h-5 w-5 text-accent" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            {newOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-pulse-soft">
                {newOrderCount > 9 ? '9+' : newOrderCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Notifications</h4>
            {newOrderCount > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  You have {newOrderCount} new order{newOrderCount > 1 ? 's' : ''} waiting!
                </p>
                <Button size="sm" variant="outline" onClick={onClearAlerts} className="w-full">
                  Mark all as read
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No new notifications
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
