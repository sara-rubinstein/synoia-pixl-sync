import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: 'up-to-date' | 'pending' | 'conflict'|'editing' | 'error';
  showIcon?: boolean;
  size?: 'sm' | 'default';
}

const statusConfig = {
  'up-to-date': {
    label: 'Up to Date',
    icon: CheckCircle,
    className: 'bg-status-success text-status-success-foreground border-status-success'
  },
  'pending': {
    label: 'Pending Upload',
    icon: Clock,
    className: 'bg-status-warning text-status-warning-foreground border-status-warning'
  },
  'conflict': {
    label: 'Cloud Newer',
    icon: AlertTriangle,
    className: 'bg-status-error text-status-error-foreground border-status-error'
  },
  'editing': {
    label: 'Editing',
    icon: AlertTriangle,
    className: 'bg-status-error text-status-error-foreground border-status-error'
  }
};

export function StatusBadge({ status, showIcon = true, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : ''}`}
    >
      {showIcon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />}
      {config.label}
    </Badge>
  );
}