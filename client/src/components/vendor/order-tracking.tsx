import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/hooks/use-firestore";
import { where, orderBy } from "firebase/firestore";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  MessageCircle,
  Truck,
} from "lucide-react";

interface OrderTrackingProps {
  vendorId: string;
}

export function OrderTracking({ vendorId }: OrderTrackingProps) {
  const { useCollection } = useFirestore();

  const { documents: orders, loading } = useCollection("orders", [
    where("vendorId", "==", vendorId),
    orderBy("orderDate", "desc"),
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "preparing":
        return <Package className="h-4 w-4 text-orange-500" />;
      case "ready":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Tracking
        </h2>
        <p className="text-muted-foreground">
          Track your orders and communicate with suppliers
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {orders?.filter((o) => o.status === "pending").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {
                    orders?.filter((o) =>
                      ["confirmed", "preparing", "ready"].includes(o.status)
                    ).length || 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {orders?.filter((o) => o.status === "delivered").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Orders Yet
              </h3>
              <p className="text-muted-foreground">
                Your orders will appear here once you place them with suppliers.
              </p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </div>
                    </Badge>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Ordered: {formatDate(order.orderDate)}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-muted-foreground">
                          Estimated: {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                      {order.actualDelivery && (
                        <p className="text-green-600">
                          Delivered: {formatDate(order.actualDelivery)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {Array.isArray(order.items) &&
                      order.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between py-1"
                        >
                          <span className="text-sm">
                            {item.productName || "Product"} (x{item.quantity})
                          </span>
                          <span className="text-sm font-medium">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 rounded p-2">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-1" size={14} />
                    Contact Supplier
                  </Button>

                  {order.status === "delivered" && (
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Leave Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
