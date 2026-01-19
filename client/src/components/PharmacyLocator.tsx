import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search,
  Navigation,
  Star,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Store,
  Filter
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
}

interface PharmacyLocatorProps {
  user: User;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone: string;
  rating: number;
  isOpen: boolean;
  openingHours: string;
  services: string[];
  deliveryAvailable: boolean;
  lastUpdated: string;
}

interface Medicine {
  name: string;
  genericName: string;
  strength: string;
  price: number;
  stock: 'in-stock' | 'low-stock' | 'out-of-stock';
  manufacturer: string;
}

export function PharmacyLocator({ user, language, isOnline }: PharmacyLocatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const translations = {
    en: {
      title: "Pharmacy Locator",
      subtitle: "Find nearby pharmacies and check medicine availability",
      search: "Search medicine or pharmacy",
      nearbyPharmacies: "Nearby Pharmacies",
      medicineAvailability: "Medicine Availability",
      directions: "Get Directions",
      call: "Call",
      order: "Order for Delivery",
      inStock: "In Stock",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      open: "Open",
      closed: "Closed",
      rating: "Rating",
      distance: "Distance",
      services: "Services",
      deliveryAvailable: "Home Delivery Available",
      lastUpdated: "Last updated",
      filters: "Filters",
      openNow: "Open Now",
      homeDelivery: "Home Delivery",
      searchResults: "Search Results",
      noResults: "No results found",
      offlineMode: "Offline Mode - Showing cached data",
      updateStock: "Update Stock",
      reserve: "Reserve",
      generic: "Generic",
      branded: "Branded"
    },
    hi: {
      title: "फार्मेसी लोकेटर",
      subtitle: "पास की फार्मेसी खोजें और दवा की उपलब्धता जांचें",
      search: "दवा या फार्मेसी खोजें",
      nearbyPharmacies: "पास की फार्मेसियां",
      medicineAvailability: "दवा की उपलब्धता",
      directions: "दिशा निर्देश प्राप्त करें",
      call: "कॉल करें",
      order: "डिलीवरी के लिए ऑर्डर करें",
      inStock: "स्टॉक में",
      lowStock: "कम स्टॉक",
      outOfStock: "स्टॉक नहीं",
      open: "खुला",
      closed: "बंद",
      rating: "रेटिंग",
      distance: "दूरी",
      services: "सेवाएं",
      deliveryAvailable: "होम डिलीवरी उपलब्ध",
      lastUpdated: "अंतिम बार अपडेट",
      filters: "फिल्टर",
      openNow: "अभी खुला",
      homeDelivery: "होम डिलीवरी",
      searchResults: "खोज परिणाम",
      noResults: "कोई परिणाम नहीं मिला",
      offlineMode: "ऑफलाइन मोड - संग्रहीत डेटा दिखा रहे हैं",
      updateStock: "स्टॉक अपडेट करें",
      reserve: "आरक्षित करें",
      generic: "जेनेरिक",
      branded: "ब्रांडेड"
    },
    pa: {
      title: "ਫਾਰਮੇਸੀ ਲੋਕੇਟਰ",
      subtitle: "ਨੇੜਲੀ ਫਾਰਮੇਸੀ ਲੱਭੋ ਅਤੇ ਦਵਾਈ ਦੀ ਉਪਲਬਧਤਾ ਜਾਂਚੋ",
      search: "ਦਵਾਈ ਜਾਂ ਫਾਰਮੇਸੀ ਖੋਜੋ",
      nearbyPharmacies: "ਨੇੜਲੀਆਂ ਫਾਰਮੇਸੀਆਂ",
      medicineAvailability: "ਦਵਾਈ ਦੀ ਉਪਲਬਧਤਾ",
      directions: "ਦਿਸ਼ਾ ਨਿਰਦੇਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
      call: "ਕਾਲ ਕਰੋ",
      order: "ਡਿਲੀਵਰੀ ਲਈ ਆਰਡਰ ਕਰੋ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      lowStock: "ਘੱਟ ਸਟਾਕ",
      outOfStock: "ਸਟਾਕ ਨਹੀਂ",
      open: "ਖੁੱਲ੍ਹਾ",
      closed: "ਬੰਦ",
      rating: "ਰੇਟਿੰਗ",
      distance: "ਦੂਰੀ",
      services: "ਸੇਵਾਵਾਂ",
      deliveryAvailable: "ਘਰ ਡਿਲੀਵਰੀ ਉਪਲਬਧ",
      lastUpdated: "ਆਖਰੀ ਵਾਰ ਅੱਪਡੇਟ",
      filters: "ਫਿਲਟਰ",
      openNow: "ਹੁਣ ਖੁੱਲ੍ਹਾ",
      homeDelivery: "ਘਰ ਡਿਲੀਵਰੀ",
      searchResults: "ਖੋਜ ਨਤੀਜੇ",
      noResults: "ਕੋਈ ਨਤੀਜੇ ਨਹੀਂ ਮਿਲੇ",
      offlineMode: "ਔਫਲਾਈਨ ਮੋਡ - ਸਟੋਰ ਕੀਤਾ ਡੇਟਾ ਦਿਖਾ ਰਹੇ ਹਾਂ",
      updateStock: "ਸਟਾਕ ਅੱਪਡੇਟ ਕਰੋ",
      reserve: "ਰਿਜ਼ਰਵ ਕਰੋ",
      generic: "ਜੈਨਰਿਕ",
      branded: "ਬ੍ਰਾਂਡੇਡ"
    }
  };

  const t = translations[language];

  const pharmacies: Pharmacy[] = [
    {
      id: '1',
      name: 'Nabha Medical Store',
      address: 'Main Market, Nabha, Punjab 147201',
      distance: 0.5,
      phone: '+91-98765-43210',
      rating: 4.5,
      isOpen: true,
      openingHours: '8:00 AM - 10:00 PM',
      services: ['Prescription medicines', 'OTC drugs', 'Health checkup'],
      deliveryAvailable: true,
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'City Pharmacy',
      address: 'Patiala Road, Nabha, Punjab 147201',
      distance: 1.2,
      phone: '+91-98765-43211',
      rating: 4.2,
      isOpen: true,
      openingHours: '9:00 AM - 9:00 PM',
      services: ['Prescription medicines', 'Baby care', 'First aid'],
      deliveryAvailable: false,
      lastUpdated: '1 hour ago'
    },
    {
      id: '3',
      name: 'Health Plus Pharmacy',
      address: 'Civil Hospital Road, Nabha, Punjab 147201',
      distance: 2.1,
      phone: '+91-98765-43212',
      rating: 4.7,
      isOpen: false,
      openingHours: '8:00 AM - 8:00 PM',
      services: ['Prescription medicines', 'Ayurvedic medicines', 'Consultation'],
      deliveryAvailable: true,
      lastUpdated: '30 minutes ago'
    }
  ];

  const commonMedicines: Medicine[] = [
    {
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: '500mg',
      price: 15,
      stock: 'in-stock',
      manufacturer: 'Various'
    },
    {
      name: 'Crocin',
      genericName: 'Paracetamol',
      strength: '650mg',
      price: 25,
      stock: 'in-stock',
      manufacturer: 'GSK'
    },
    {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: '250mg',
      price: 45,
      stock: 'low-stock',
      manufacturer: 'Various'
    },
    {
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      strength: '20mg',
      price: 35,
      stock: 'out-of-stock',
      manufacturer: 'Various'
    }
  ];

  const getStockIcon = (stock: string) => {
    switch (stock) {
      case 'in-stock': return CheckCircle;
      case 'low-stock': return AlertCircle;
      case 'out-of-stock': return XCircle;
      default: return Package;
    }
  };

  const getStockColor = (stock: string) => {
    switch (stock) {
      case 'in-stock': return 'text-green-600';
      case 'low-stock': return 'text-orange-600';
      case 'out-of-stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStockText = (stock: string) => {
    switch (stock) {
      case 'in-stock': return t.inStock;
      case 'low-stock': return t.lowStock;
      case 'out-of-stock': return t.outOfStock;
      default: return stock;
    }
  };

  const filteredMedicines = commonMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>{t.title}</span>
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t.offlineMode}. Stock information may not be current.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {t.filters}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="open-now" />
                <label htmlFor="open-now" className="text-sm">{t.openNow}</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="delivery" />
                <label htmlFor="delivery" className="text-sm">{t.homeDelivery}</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="generic" />
                <label htmlFor="generic" className="text-sm">{t.generic}</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="branded" />
                <label htmlFor="branded" className="text-sm">{t.branded}</label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pharmacy List */}
        <Card>
          <CardHeader>
            <CardTitle>{t.nearbyPharmacies}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPharmacy?.id === pharmacy.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{pharmacy.name}</h4>
                      <p className="text-sm text-gray-600">{pharmacy.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={pharmacy.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {pharmacy.isOpen ? t.open : t.closed}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{pharmacy.distance} km</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{pharmacy.rating}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{pharmacy.openingHours}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {pharmacy.services.slice(0, 2).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {pharmacy.deliveryAvailable && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <Truck className="h-3 w-3 mr-1" />
                        Delivery
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      {t.directions}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      {t.call}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {t.lastUpdated}: {pharmacy.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medicine Search */}
        <Card>
          <CardHeader>
            <CardTitle>{t.medicineAvailability}</CardTitle>
            <CardDescription>
              {selectedPharmacy ? `At ${selectedPharmacy.name}` : 'Select a pharmacy to check availability'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  placeholder="Search for medicines..."
                  className="pl-10"
                />
              </div>
            </div>

            {selectedPharmacy && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{selectedPharmacy.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{selectedPharmacy.address}</p>
                {selectedPharmacy.deliveryAvailable && (
                  <Button size="sm" className="w-full">
                    <Truck className="h-4 w-4 mr-2" />
                    {t.order}
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-3">
              {filteredMedicines.map((medicine, index) => {
                const StockIcon = getStockIcon(medicine.stock);
                return (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{medicine.name}</h4>
                        <p className="text-sm text-gray-600">
                          {medicine.genericName} - {medicine.strength}
                        </p>
                        <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{medicine.price}</div>
                        <div className={`flex items-center space-x-1 text-sm ${getStockColor(medicine.stock)}`}>
                          <StockIcon className="h-4 w-4" />
                          <span>{getStockText(medicine.stock)}</span>
                        </div>
                      </div>
                    </div>

                    {medicine.stock !== 'out-of-stock' && selectedPharmacy && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          {t.reserve}
                        </Button>
                        {selectedPharmacy.deliveryAvailable && (
                          <Button size="sm" className="flex-1">
                            Order
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredMedicines.length === 0 && medicineSearch && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>{t.noResults}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pharmacy Image */}
      <Card>
        <CardHeader>
          <CardTitle>Local Pharmacy Network</CardTitle>
          <CardDescription>
            Supporting rural healthcare through accessible medicine distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1597121798359-e9ee76aa0478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwc2hlbHZlc3xlbnwxfHx8fDE3NTgwMDMxNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="Pharmacy with medicine shelves"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Store className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">15+ Pharmacies</h4>
              <p className="text-sm text-gray-600">In Nabha region</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">500+ Medicines</h4>
              <p className="text-sm text-gray-600">Real-time stock</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Home Delivery</h4>
              <p className="text-sm text-gray-600">Within 2 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}