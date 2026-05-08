import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const EmptyState = ({ 
  icon: Icon = FileQuestion, 
  title = "No data found", 
  message = "There is nothing to display here at the moment.",
  actionLabel,
  actionHref,
  onAction
}) => {
  return (
    <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent py-12">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full">
          <Icon className="h-10 w-10 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {message}
          </p>
        </div>
        {(actionLabel && actionHref) && (
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
        {(actionLabel && onAction) && (
          <Button variant="outline" size="sm" className="mt-2" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
