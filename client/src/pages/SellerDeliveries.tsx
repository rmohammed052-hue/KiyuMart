import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Truck, MapPin, Package } from "lucide-react";
import { getOrderStatusColor } from "../../../shared/status-colors";

interface Delivery {
  id: string;
  orderNumber: string;
  status: string;
  riderId?: string;
  riderName?: string;
  deliveryAddress: string;
  estimatedTime?: string;
  createdAt: string;
}

export default function SellerDeliveries() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: deliveries = [], isLoading } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries", "seller"],
    queryFn: async () => {
      const res = await fetch("/api/deliveries?role=seller");
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      return res.json();
    },
  });

  // Status colors now imported from shared/status-colors.ts

  return (
    <DashboardLayout role="seller">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Deliveries</h1>
          <p className="text-muted-foreground">Track your order deliveries</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : deliveries.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deliveries</h3>
              <p className="text-muted-foreground">Your deliveries will appear here</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="p-4" data-testid={`card-delivery-${delivery.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <p className="font-semibold">Order #{delivery.orderNumber}</p>
                                            <div className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border ${getOrderStatusColor(delivery.status, 'light')}`}>
                        {delivery.status}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <p>{delivery.deliveryAddress}</p>
                    </div>
                    {delivery.riderName && (
                      <p className="text-sm mt-2">
                        <span className="text-muted-foreground">Rider:</span> {delivery.riderName}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-track-${delivery.id}`}>
                    Track
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
