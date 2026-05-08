import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status, className }) => {
  const config = {
    approved: {
      variant: 'success',
      label: 'Approved',
      icon: CheckCircle2,
    },
    pending: {
      variant: 'warning',
      label: 'Pending',
      icon: Clock,
    },
    rejected: {
      variant: 'destructive',
      label: 'Rejected',
      icon: XCircle,
    },
  };

  const { variant, label, icon: Icon } = config[status?.toLowerCase()] || {
    variant: 'secondary',
    label: status,
    icon: null,
  };

  return (
    <Badge variant={variant} className={`gap-1.5 px-2 py-0.5 ${className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

export default StatusBadge;
