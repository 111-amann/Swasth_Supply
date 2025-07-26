import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore } from "@/hooks/use-firestore";
import { where, orderBy } from "firebase/firestore";
import { Clock, CheckCircle, Package, Truck, Phone, MapPin } from "lucide-react";

interface OrderManagementProps {
  supplierId: string;
}

export function OrderManagement({ supplierId }: OrderManagementProps) {
  const { updateDocument, useCollection } = useFirestore();

  // Get supplier's orders
  const { documents: orders, loading } = useFirestore().useCollection("orders", [
    where("supplierId", "==", supplierId),
    orderBy("orderDate", "desc"),
  ]);

  // Mock orders for demonstration
  const mockOrders = [
    {
      id: "order1",
      orderNumber: "#12345",
      vendorName: "Raj's Puchka Corner",
      orderDate: "2 hours ago",
      items: [
        { name: "Basmati Rice", quantity: 1, unit: "25kg" },
        { name: "Cooking Oil", quantity: 1, unit: "15L" },
      ],
      totalAmount: 3050,
      status: "pending",
      deliveryAddress: "Connaught Place, Delhi",
      vendorPhone: "+91 9876543210",
    },
    {
      id: "order2",
      orderNumber: "#12344",
      vendorName: "Mumbai Chaat Wala",
      orderDate: "1 day ago",
      items: [
        { name: "Garam Masala", quantity: 5, unit: "kg" },
        { name: "Red Chili Powder", quantity: 2, unit: "kg" },
      ],
      totalAmount: 2650,
      status: "delivered",
      deliveryAddress: "Churchgate, Mumbai",
      vendorPhone: "+91 9123456789",
    },
    {
      id: "order3",
      orderNumber: "#12343",
      vendorName: "Delhi Street Food Co.",
      orderDate: "3 days ago",
      items: [
        { name: "Onions", quantity: 2, unit: "50kg" },
        { name: "Potatoes", quantity: 1, unit: "50kg" },
      ],
      totalAmount: 2100,
      status: "confirmed",
      deliveryAddress: "Karol Bagh, Delhi",
      vendorPhone: "+91 9234567890",
    },
  ];

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateDocument("orders", orderId, { 
        status: newStatus,
        ...(newStatus === "delivered" && { actualDelivery: new Date() })
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "ready":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} capitalize`}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready for Pickup" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Incoming Orders</h2>

      {/* Order Cards */}
      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id} className="supplier-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.vendorName} • {order.orderDate}
                  </p>
                </div>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusUpdate(order.id, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue>
                      {getStatusBadge(order.status)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {getStatusIcon(option.value)}
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <div className="font-medium">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} ({item.quantity} {item.unit})
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="mr-1" size={14} />
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-secondary text-lg">₹{order.totalAmount}</p>
                  </div>
                  <div className="flex space-x-2">
                    {order.status === "delivered" ? (
                      <Button variant="outline" className="flex-1" disabled>
                        Completed
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                        onClick={() => handleStatusUpdate(order.id, "confirmed")}
                        disabled={order.status !== "pending"}
                      >
                        {order.status === "pending" ? "Confirm" : "Update Status"}
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Phone size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Progress */}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">Order Progress:</span>
                    <div className="flex items-center space-x-2">
                      {["pending", "confirmed", "preparing", "ready", "delivered"].map((step, index) => {
                        const isCompleted = statusOptions.findIndex(s => s.value === order.status) >= index;
                        const isCurrent = step === order.status;
                        
                        return (
                          <div
                            key={step}
                            className={`w-3 h-3 rounded-full ${
                              isCompleted 
                                ? "bg-blue-500" 
                                : isCurrent 
                                ? "bg-blue-300 animate-pulse" 
                                : "bg-gray-300"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {mockOrders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Orders from vendors will appear here once you list your products.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
