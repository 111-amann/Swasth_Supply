import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck, Package } from "lucide-react";

interface OrderManagementProps {
  supplierId: string;
}

export function OrderManagement({ supplierId }: OrderManagementProps) {
  const { user } = useAuth();
  const { orders, updateOrderStatus, isUpdatingOrder } = useOrders();
  const [updateNotes, setUpdateNotes] = useState<{ [orderId: string]: string }>({});

  // Filter orders for this supplier
  const supplierOrders = orders.filter(order => order.supplierId === (supplierId || user?.uid));

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus,
        notes: updateNotes[orderId] || undefined,
      });
      
      // Clear the notes after update
      setUpdateNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[orderId];
        return newNotes;
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "preparing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["preparing", "cancelled"];
      case "preparing":
        return ["shipped"];
      case "shipped":
        return ["delivered"];
      default:
        return [];
    }
  };

  if (supplierOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground">
          When vendors place orders for your products, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h2>
        <p className="text-muted-foreground">
          Manage incoming orders from vendors and update delivery status
        </p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: supplierOrders.length, color: "text-blue-600" },
          { label: "Pending", value: supplierOrders.filter(o => o.status === "pending").length, color: "text-yellow-600" },
          { label: "In Progress", value: supplierOrders.filter(o => ["confirmed", "preparing", "shipped"].includes(o.status)).length, color: "text-purple-600" },
          { label: "Delivered", value: supplierOrders.filter(o => o.status === "delivered").length, color: "text-green-600" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {supplierOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.id.slice(-8)}
                  </CardTitle>
                  <CardDescription>
                    From {order.vendorName || "Vendor"} • {order.orderDate.toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(order.status)} border-0`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Customer:</strong> {order.vendorName || "Unknown Vendor"}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  {order.estimatedDelivery && (
                    <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery.toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-semibold mb-2">Ordered Items:</p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-muted-foreground">
                        {item.quantity} {item.unit} × ₹{item.price} = ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm"><strong>Customer Notes:</strong> {order.notes}</p>
                </div>
              )}

              {/* Status Update Actions */}
              {getAvailableActions(order.status).length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <div>
                    <Label htmlFor={`notes-${order.id}`} className="text-sm font-medium">
                      Update Notes (Optional)
                    </Label>
                    <Textarea
                      id={`notes-${order.id}`}
                      placeholder="Add any notes about this order update..."
                      value={updateNotes[order.id] || ""}
                      onChange={(e) => setUpdateNotes(prev => ({
                        ...prev,
                        [order.id]: e.target.value
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {getAvailableActions(order.status).map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        variant={action === "cancelled" ? "destructive" : "default"}
                        onClick={() => handleStatusUpdate(order.id, action)}
                        disabled={isUpdatingOrder}
                        className={action === "cancelled" ? "" : "bg-orange-600 hover:bg-orange-700"}
                      >
                        {isUpdatingOrder ? "Updating..." : 
                          action === "confirmed" ? "Confirm Order" :
                          action === "preparing" ? "Mark as Preparing" :
                          action === "shipped" ? "Mark as Shipped" :
                          action === "delivered" ? "Mark as Delivered" :
                          action === "cancelled" ? "Cancel Order" :
                          action.charAt(0).toUpperCase() + action.slice(1)
                        }
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}