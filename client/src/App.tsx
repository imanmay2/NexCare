import React, { useState, useEffect } from "react";
import { PatientDashboard } from "./components/PatientDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PharmacyDashboard } from "./components/PharmacyDashboard";
import { LoginScreen } from "./components/LoginScreen";
import { Button } from "./components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  Heart,
  Smartphone,
  Users,
  MapPin,
  Clock,
  Shield,
  Wifi,
  Languages,
  Activity,
  Phone,
  MessageSquare,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  role: "patient" | "doctor" | "pharmacy";
  email: string;
  language: "en" | "hi" | "pa";
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<"en" | "hi" | "pa">(
    "en",
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const translations = {
    en: {
      title: "NexCare Telemedicine Platform",
      subtitle:
        "Connecting rural communities to quality healthcare",
      loginPrompt: "Welcome to Healthcare Access",
      features: "Platform Features",
      offline: "Offline Mode Active",
      online: "Connected",
      stats: "Platform Statistics",
    },
    hi: {
      title: "नाभा टेलीमेडिसिन प्लेटफॉर्म",
      subtitle:
        "ग्रामीण समुदायों को गुणवत्तापूर्ण स्वास्थ्य सेवा से जोड़ना",
      loginPrompt: "स्वास्थ्य सेवा पहुंच में आपका स्वागत है",
      features: "प्लेटफॉर्म सुविधाएं",
      offline: "ऑफलाइन मोड सक्रिय",
      online: "जुड़ा हुआ",
      stats: "प्लेटफॉर्म आंकड़े",
    },
    pa: {
      title: "ਨਾਭਾ ਟੈਲੀਮੈਡਿਸਿਨ ਪਲੈਟਫਾਰਮ",
      subtitle:
        "ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਨੂੰ ਗੁਣਵੱਤਾ ਭਰਪੂਰ ਸਿਹਤ ਸੇਵਾ ਨਾਲ ਜੋੜਨਾ",
      loginPrompt: "ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
      features: "ਪਲੈਟਫਾਰਮ ਸੁਵਿਧਾਵਾਂ",
      offline: "ਔਫਲਾਈਨ ਮੋਡ ਸਰਗਰਮ",
      online: "ਜੁੜਿਆ ਹੋਇਆ",
      stats: "ਪਲੈਟਫਾਰਮ ਦੇ ਅੰਕੜੇ",
    },
  };

  const t = translations[language];

  if (user) {
    switch (user.role) {
      case "patient":
        return (
          <PatientDashboard
            user={user}
            onLogout={() => setUser(null)}
            language={language}
            isOnline={isOnline}
          />
        );
      case "doctor":
        return (
          <DoctorDashboard
            user={user}
            onLogout={() => setUser(null)}
            language={language}
            isOnline={isOnline}
          />
        );
      case "pharmacy":
        return (
          <PharmacyDashboard
            user={user}
            onLogout={() => setUser(null)}
            language={language}
            isOnline={isOnline}
          />
        );
      default:
        return (
          <LoginScreen
            onLogin={setUser}
            language={language}
            setLanguage={setLanguage}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <Wifi
                  className={`h-4 w-4 ${isOnline ? "text-green-500" : "text-red-500"}`}
                />
                <span className="text-sm text-gray-600">
                  {isOnline ? t.online : t.offline}
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex space-x-1">
                {(["en", "hi", "pa"] as const).map((lang) => {
                  const languageLabels = {
                    en: "English",
                    hi: "हिंदी",
                    pa: "ਪੰਜਾਬੀ",
                  };
                  return (
                    <Button
                      key={lang}
                      variant={
                        language === lang
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setLanguage(lang)}
                      className="px-3 py-1"
                    >
                      {languageLabels[lang]}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Login Section - Top Priority */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Heart className="h-5 w-5" />
              <span className="font-medium">
                NexCare Telemedicine Platform
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.loginPrompt}
            </h1>
            <p className="text-gray-600">
              Access your personalized healthcare dashboard
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <LoginScreen
                onLogin={setUser}
                language={language}
                setLanguage={setLanguage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">
              Serving 173 villages around Nabha, Punjab
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" &&
              "Bridging Healthcare Gaps in Rural Punjab"}
            {language === "hi" &&
              "ग्रामीण पंजाब में स्वास्थ्य सेवा की खाई को पाटना"}
            {language === "pa" &&
              "ਪੇਂਡੂ ਪੰਜਾਬ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਦੇ ਪਾੜੇ ਨੂੰ ਭਰਨਾ"}
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            {language === "en" &&
              "Get medical consultations, check medicine availability, and access your health records - even when offline."}
            {language === "hi" &&
              "चिकित्सा परामर्श प्राप्त करें, दवा की उप��ब्धता जांचें, और अपने स्वास्थ्य रिकॉर्ड तक पहुंचें - यहां तक कि ऑफलाइन भी।"}
            {language === "pa" &&
              "ਮੈਡੀਕਲ ਸਲਾਹ ਲਓ, ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ ਦੀ ਜਾਂਚ ਕਰੋ, ਅਤੇ ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡਾਂ ਤੱਕ ਪਹੁੰਚ ਕਰੋ - ਔਫਲਾਈਨ ਵੀ।"}
          </p>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                11/23
              </div>
              <div className="text-sm text-gray-600">
                Active Doctors
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                173
              </div>
              <div className="text-sm text-gray-600">
                Villages Served
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                24/7
              </div>
              <div className="text-sm text-gray-600">
                Emergency Access
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                31%
              </div>
              <div className="text-sm text-gray-600">
                Rural Internet Coverage
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t.features}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Smartphone className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Video Consultations</CardTitle>
                <CardDescription>
                  Low-bandwidth video calls with automatic
                  fallback to audio-only for poor connections
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Offline Health Records</CardTitle>
                <CardDescription>
                  Access your medical history and prescriptions
                  even without internet connectivity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>AI Symptom Checker</CardTitle>
                <CardDescription>
                  Preliminary health guidance in Punjabi and
                  Hindi with offline functionality
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Medicine Availability</CardTitle>
                <CardDescription>
                  Real-time updates on drug stock at local
                  pharmacies to avoid unnecessary trips
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Languages className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Available in Punjabi, Hindi, and English with
                  voice navigation options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-10 w-10 text-teal-600 mb-2" />
                <CardTitle>IVR & SMS Support</CardTitle>
                <CardDescription>
                  Works on feature phones through voice calls
                  and text messages
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Access Methods */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>
              Multiple Ways to Access Healthcare
            </CardTitle>
            <CardDescription>
              Choose the method that works best with your device
              and connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  Mobile App
                </h3>
                <p className="text-sm text-gray-600">
                  Full-featured app with offline sync
                </p>
                <Badge variant="secondary" className="mt-2">
                  Smartphones
                </Badge>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  IVR Hotline
                </h3>
                <p className="text-sm text-gray-600">
                  Voice-guided service in local languages
                </p>
                <Badge variant="secondary" className="mt-2">
                  All Phones
                </Badge>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  SMS Service
                </h3>
                <p className="text-sm text-gray-600">
                  Text-based appointments and updates
                </p>
                <Badge variant="secondary" className="mt-2">
                  Feature Phones
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-lg font-semibold">
                NexCare Telemedicine Platform
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Improving healthcare access for rural communities
              in Punjab
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Emergency: 102</span>
              <span>Support: +91-XXX-XXX-XXXX</span>
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}