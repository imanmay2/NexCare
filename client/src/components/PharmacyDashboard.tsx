import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  Building2,
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Truck,
  DollarSign
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  email: string;
  language: 'en' | 'hi' | 'pa';
}

interface PharmacyDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  batchNumber: string;
  manufacturer: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { medicine: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'delivered';
  orderDate: string;
  deliveryAddress?: string;
}

export function PharmacyDashboard({ user, onLogout, language, isOnline }: PharmacyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      stock: 150,
      minStock: 50,
      price: 15,
      expiryDate: '2025-12-31',
      batchNumber: 'PCM001',
      manufacturer: 'Cipla',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      stock: 25,
      minStock: 30,
      price: 45,
      expiryDate: '2025-06-30',
      batchNumber: 'AMX002',
      manufacturer: 'Sun Pharma',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Gastric',
      stock: 0,
      minStock: 20,
      price: 35,
      expiryDate: '2025-03-31',
      batchNumber: 'OMP003',
      manufacturer: 'Dr. Reddy\'s',
      status: 'out-of-stock'
    }
  ]);

  const [orders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Amar Singh',
      customerPhone: '+91-98765-43210',
      items: [
        { medicine: 'Paracetamol 500mg', quantity: 2, price: 30 },
        { medicine: 'Cough Syrup', quantity: 1, price: 85 }
      ],
      total: 115,
      status: 'pending',
      orderDate: '2024-12-17T14:30:00',
      deliveryAddress: 'Village Ghanaur, Nabha'
    },
    {
      id: '2',
      customerName: 'Simran Kaur',
      customerPhone: '+91-98765-43211',
      items: [
        { medicine: 'Vitamin D3', quantity: 1, price: 120 }
      ],
      total: 120,
      status: 'ready',
      orderDate: '2024-12-17T13:15:00'
    }
  ]);

  const translations = {
    en: {
      dashboard: "Pharmacy Dashboard",
      welcome: "Welcome",
      inventory: "Inventory Management",
      orders: "Orders",
      sales: "Sales & Reports",
      settings: "Settings",
      totalMedicines: "Total Medicines",
      lowStock: "Low Stock Items",
      pendingOrders: "Pending Orders",
      todaySales: "Today's Sales",
      searchMedicine: "Search medicines...",
      addMedicine: "Add Medicine",
      updateStock: "Update Stock",
      medicineName: "Medicine Name",
      stock: "Stock",
      price: "Price",
      status: "Status",
      actions: "Actions",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      expired: "Expired",
      orderNumber: "Order #",
      customer: "Customer",
      items: "Items",
      total: "Total",
      pending: "Pending",
      confirmed: "Confirmed",
      ready: "Ready for Pickup",
      delivered: "Delivered",
      confirm: "Confirm",
      prepare: "Prepare",
      markDelivered: "Mark Delivered",
      view: "View",
      offlineMode: "Offline Mode - Limited functionality"
    },
    hi: {
      dashboard: "फार्मेसी डैशबोर्ड",
      welcome: "स्वागत",
      inventory: "इन्वेंटरी प्रबंधन",
      orders: "आर्डर",
      sales: "बिक्री और रिपोर्ट",
      settings: "सेटिंग्स",
      totalMedicines: "कुल दवाएं",
      lowStock: "कम स्टॉक आइटम",
      pendingOrders: "लंबित आर्डर",
      todaySales: "आज की बिक्री",
      searchMedicine: "दवाएं खोजें...",
      addMedicine: "दवा जोड़ें",
      updateStock: "स्टॉक अपडेट करें",
      medicineName: "दवा का नाम",
      stock: "स्टॉक",
      price: "कीमत",
      status: "स्थिति",
      actions: "कार्य",
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक नहीं",
      expired: "समाप्त",
      orderNumber: "आर्डर #",
      customer: "ग्राहक",
      items: "आइटम",
      total: "कुल",
      pending: "लंबित",
      confirmed: "पुष्ट",
      ready: "पिकअप के लिए तैयार",
      delivered: "वितरित",
      confirm: "पुष्टि करें",
      prepare: "तैयार करें",
      markDelivered: "वितरित के रूप में चिह्नित करें",
      view: "देखें",
      offlineMode: "ऑफलाइन मोड - सीमित कार्यक्षमता"
    },
    pa: {
      dashboard: "ਫਾਰਮੇਸੀ ਡੈਸ਼ਬੋਰਡ",
      welcome: "ਸੁਆਗਤ",
      inventory: "ਇਨਵੇਂਟਰੀ ਪ੍ਰਬੰਧਨ",
      orders: "ਆਰਡਰ",
      sales: "ਵਿਕਰੀ ਅਤੇ ਰਿਪੋਰਟਾਂ",
      settings: "ਸੈਟਿੰਗਜ਼",
      totalMedicines: "ਕੁੱਲ ਦਵਾਈਆਂ",
      lowStock: "ਘੱਟ ਸਟਾਕ ਆਈਟਮ",
      pendingOrders: "ਲੰਬਿਤ ਆਰਡਰ",
      todaySales: "ਅੱਜ ਦੀ ਵਿਕਰੀ",
      searchMedicine: "ਦਵਾਈਆਂ ਖੋਜੋ...",
      addMedicine: "ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ",
      updateStock: "ਸਟਾਕ ਅੱਪਡੇਟ ਕਰੋ",
      medicineName: "ਦਵਾਈ ਦਾ ਨਾਮ",
      stock: "ਸਟਾਕ",
      price: "ਕੀਮਤ",
      status: "ਸਥਿਤੀ",
      actions: "ਕਾਰਵਾਈਆਂ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      outOfStock: "ਸਟਾਕ ਨਹੀਂ",
      expired: "ਸਮਾਪਤ",
      orderNumber: "ਆਰਡਰ #",
      customer: "ਗਾਹਕ",
      items: "ਆਈਟਮ",
      total: "ਕੁੱਲ",
      pending: "ਲੰਬਿਤ",
      confirmed: "ਪੁਸ਼ਟੀ",
      ready: "ਪਿਕਅੱਪ ਲਈ ਤਿਆਰ",
      delivered: "ਡਿਲੀਵਰ",
      confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
      prepare: "ਤਿਆਰ ਕਰੋ",
      markDelivered: "ਡਿਲੀਵਰ ਦੇ ਰੂਪ ਵਿੱਚ ਮਾਰਕ ਕਰੋ",
      view: "ਦੇਖੋ",
      offlineMode: "ਔਫਲਾਈਨ ਮੋਡ - ਸੀਮਤ ਕਾਰਜਕੁਸ਼ਲਤਾ"
    }
  };

  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-stock': return t.inStock;
      case 'low-stock': return t.lowStock;
      case 'out-of-stock': return t.outOfStock;
      case 'expired': return t.expired;
      case 'pending': return t.pending;
      case 'confirmed': return t.confirmed;
      case 'ready': return t.ready;
      case 'delivered': return t.delivered;
      default: return status;
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Building2 className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t.welcome}, {user.name}
                </h1>
                <p className="text-sm text-gray-600">Main Market, Nabha • {user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="text-gray-600">Today: Dec 17, 2024</div>
                <div className="text-gray-500">12 orders processed</div>
              </div>

              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isOnline && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t.offlineMode}. Orders and stock updates will sync when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{medicines.length}</div>
              <div className="text-sm text-gray-600">{t.totalMedicines}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {medicines.filter(m => m.status === 'low-stock' || m.status === 'out-of-stock').length}
              </div>
              <div className="text-sm text-gray-600">{t.lowStock}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">{t.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">₹2,450</div>
              <div className="text-sm text-gray-600">{t.todaySales}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">{t.inventory}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
            <TabsTrigger value="sales">{t.sales}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.inventory}</span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addMedicine}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchMedicine}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredMedicines.map((medicine) => (
                    <div key={medicine.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{medicine.name}</h4>
                          <p className="text-sm text-gray-600">{medicine.genericName} • {medicine.category}</p>
                          <p className="text-xs text-gray-500">
                            Batch: {medicine.batchNumber} • Exp: {medicine.expiryDate} • {medicine.manufacturer}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-semibold">₹{medicine.price}</div>
                          <div className="text-sm text-gray-600">{t.stock}: {medicine.stock}</div>
                          <Badge className={getStatusColor(medicine.status)}>
                            {getStatusText(medicine.status)}
                          </Badge>
                        </div>
                      </div>

                      {medicine.status === 'low-stock' && (
                        <Alert className="mb-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Stock is below minimum level ({medicine.minStock} units)
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          {t.updateStock}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Package className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.orders}</CardTitle>
                <CardDescription>
                  Manage customer orders and deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{t.orderNumber}{order.id}</h4>
                          <p className="text-sm text-gray-600">
                            {order.customerName} • {order.customerPhone}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-semibold">₹{order.total}</div>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium mb-2">{t.items}:</h5>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.medicine} x{item.quantity}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      {order.deliveryAddress && (
                        <div className="mb-3 p-3 bg-blue-50 rounded flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{order.deliveryAddress}</span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t.confirm}
                          </Button>
                        )}

                        {order.status === 'confirmed' && (
                          <Button size="sm" className="flex-1">
                            <Package className="h-4 w-4 mr-2" />
                            {t.prepare}
                          </Button>
                        )}

                        {order.status === 'ready' && (
                          <Button size="sm" className="flex-1">
                            <Truck className="h-4 w-4 mr-2" />
                            {t.markDelivered}
                          </Button>
                        )}

                        <Button variant="outline" size="sm" className="flex-1">
                          {t.view}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>{t.sales}</CardTitle>
                <CardDescription>
                  Sales analytics and financial reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Sales analytics dashboard would be implemented here</p>
                  <p className="text-sm">Daily, weekly, and monthly sales reports with charts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings}</CardTitle>
                <CardDescription>
                  Pharmacy settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Pharmacy settings interface would be implemented here</p>
                  <p className="text-sm">Business hours, delivery settings, staff management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}