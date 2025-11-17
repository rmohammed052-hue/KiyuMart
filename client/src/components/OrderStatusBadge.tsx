import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Package, Truck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { getOrderStatusColor } from "@/../../shared/status-colors";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    icon: Package,
  },
  delivering: {
    label: "Delivering",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
  },
  disputed: {
    label: "Disputed",
    icon: AlertTriangle,
  },
  shipped: {
    label: "Shipped",
    icon: Package,
  },
};

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;
  const colorClasses = getOrderStatusColor(status, 'light');

  return (
    <Badge
      className={cn("gap-1.5 px-3 py-1 border", colorClasses, className)}
      data-testid={`badge-${status}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
