import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Calendar,
  Video,
  FileText,
  MapPin,
  Clock,
  Phone,
  Heart,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
  Pill,
  Thermometer,
  Activity,
  Headphones,
  Wifi,
  WifiOff
} from 'lucide-react';
import { SymptomChecker } from './SymptomChecker';
import { AppointmentBooking } from './AppointmentBooking';
import { HealthRecords } from './HealthRecords';
import { PharmacyLocator } from './PharmacyLocator';
import { ConsultationModal } from './ConsultationModal';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  email: string;
  language: 'en' | 'hi' | 'pa';
}

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  symptoms: string;
}

interface HealthMetric {
  type: string;
  value: string;
  date: string;
  status: 'normal' | 'attention' | 'critical';
}

export function PatientDashboard({ user, onLogout, language, isOnline }: PatientDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      date: '2024-12-18',
      time: '14:30',
      type: 'video',
      status: 'upcoming',
      symptoms: 'Fever, body ache'
    },
    {
      id: '2',
      doctorName: 'Dr. Rajesh Kumar',
      date: '2024-12-15',
      time: '10:00',
      type: 'audio',
      status: 'completed',
      symptoms: 'Headache'
    }
  ]);

  const [healthMetrics] = useState<HealthMetric[]>([
    { type: 'Blood Pressure', value: '120/80', date: '2024-12-15', status: 'normal' },
    { type: 'Temperature', value: '99.2°F', date: '2024-12-17', status: 'attention' },
    { type: 'Heart Rate', value: '78 bpm', date: '2024-12-17', status: 'normal' }
  ]);

  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [consultationModal, setConsultationModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({ isOpen: false, appointment: null });
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setLastSync(new Date());
    }
  }, [isOnline]);

  const translations = {
    en: {
      dashboard: "Patient Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      appointments: "Appointments",
      records: "Health Records",
      pharmacy: "Pharmacy",
      symptoms: "Symptom Checker",
      upcoming: "Upcoming Appointment",
      recent: "Recent Health Metrics",
      newConsultation: "New Consultation",
      emergencyCall: "Emergency Call",
      viewAll: "View All",
      lastSync: "Last synced",
      offlineMode: "Offline Mode - Some features limited",
      onlineMode: "Connected - All features available"
    },
    hi: {
      dashboard: "मरीज़ डैशबोर्ड",
      welcome: "वापसी पर स्वागत",
      overview: "अवलोकन",
      appointments: "अपॉइंटमेंट",
      records: "स्वास्थ्य रिकॉर्ड",
      pharmacy: "फार्मेसी",
      symptoms: "लक्षण जांचकर्ता",
      upcoming: "आगामी अपॉइंटमेंट",
      recent: "हाल की स्वास्थ्य मेट्रिक्स",
      newConsultation: "नया परामर्श",
      emergencyCall: "आपातकालीन कॉल",
      viewAll: "सभी देखें",
      lastSync: "अंतिम बार सिंक",
      offlineMode: "ऑफलाइन मोड - कुछ सुविधाएं सीमित",
      onlineMode: "जुड़ा हुआ - सभी सुविधाएं उपलब्ध"
    },
    pa: {
      dashboard: "ਮਰੀਜ਼ ਡੈਸ਼ਬੋਰਡ",
      welcome: "ਵਾਪਸੀ ਤੇ ਸੁਆਗਤ",
      overview: "ਸੰਖੇਪ",
      appointments: "ਮੁਲਾਕਾਤਾਂ",
      records: "ਸਿਹਤ ਰਿਕਾਰਡ",
      pharmacy: "ਫਾਰਮੇਸੀ",
      symptoms: "ਲੱਛਣ ਜਾਂਚਕਰਤਾ",
      upcoming: "ਆਉਣ ਵਾਲੀ ਮੁਲਾਕਾਤ",
      recent: "ਹਾਲ ਦੇ ਸਿਹਤ ਮੈਟ੍ਰਿਕਸ",
      newConsultation: "ਨਵੀਂ ਸਲਾਹ",
      emergencyCall: "ਐਮਰਜੈਂਸੀ ਕਾਲ",
      viewAll: "ਸਭ ਦੇਖੋ",
      lastSync: "ਆਖਰੀ ਵਾਰ ਸਿੰਕ",
      offlineMode: "ਔਫਲਾਈਨ ਮੋਡ - ਕੁਝ ਸੁਵਿਧਾਵਾਂ ਸੀਮਤ",
      onlineMode: "ਜੁੜਿਆ ਹੋਇਆ - ਸਾਰੀਆਂ ਸੁਵਿਧਾਵਾਂ ਉਪਲਬਧ"
    }
  };

  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'attention': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'in-person': return MapPin;
      default: return Calendar;
    }
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    if (!isOnline && appointment.type !== 'in-person') {
      alert('Internet connection required for video/audio consultations');
      return;
    }
    setConsultationModal({ isOpen: true, appointment });
  };

  const handleEmergencyCall = () => {
    if (window.confirm('This will call emergency services (102). Do you want to proceed?')) {
      // In a real app, this would initiate an emergency call
      window.open('tel:102');
    }
  };

  const handleNewConsultation = () => {
    // Switch to appointments tab
    const appointmentsTab = document.querySelector('[value="appointments"]') as HTMLElement;
    if (appointmentsTab) {
      appointmentsTab.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{t.welcome}, {user.name}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <div className="text-xs text-gray-500">
                  <div>{isOnline ? t.onlineMode : t.offlineMode}</div>
                  <div>{t.lastSync}: {lastSync.toLocaleTimeString()}</div>
                </div>
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
        {/* Connection Alert */}
        {!isOnline && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t.offlineMode}. Your data will sync when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="appointments">{t.appointments}</TabsTrigger>
            <TabsTrigger value="symptoms">{t.symptoms}</TabsTrigger>
            <TabsTrigger value="records">{t.records}</TabsTrigger>
            <TabsTrigger value="pharmacy">{t.pharmacy}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleNewConsultation}>
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{t.newConsultation}</h3>
                  <p className="text-sm text-gray-600">Video or audio consultation</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleEmergencyCall}>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{t.emergencyCall}</h3>
                  <p className="text-sm text-gray-600">24/7 emergency support</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => (document.querySelector('[value="symptoms"]') as HTMLElement)?.click()}>
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{t.symptoms}</h3>
                  <p className="text-sm text-gray-600">AI-powered health guidance</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t.upcoming}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                  <div className="space-y-3">
                    {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => {
                      const Icon = getAppointmentIcon(appointment.type);
                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{appointment.doctorName}</div>
                              <div className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </div>
                              <div className="text-xs text-gray-500">{appointment.symptoms}</div>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleJoinConsultation(appointment)}>
                            Join
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>{t.recent}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{metric.type}</span>
                        <Badge variant={metric.status === 'normal' ? 'default' : 'destructive'}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentBooking
              user={user}
              language={language}
              isOnline={isOnline}
              appointments={appointments}
              setAppointments={setAppointments}
            />
          </TabsContent>

          <TabsContent value="symptoms">
            <SymptomChecker user={user} language={language} isOnline={isOnline} />
          </TabsContent>

          <TabsContent value="records">
            <HealthRecords user={user} language={language} isOnline={isOnline} />
          </TabsContent>

          <TabsContent value="pharmacy">
            <PharmacyLocator user={user} language={language} isOnline={isOnline} />
          </TabsContent>
        </Tabs>

        {/* Consultation Modal */}
        <ConsultationModal
          isOpen={consultationModal.isOpen}
          onClose={() => setConsultationModal({ isOpen: false, appointment: null })}
          appointment={consultationModal.appointment}
          user={user}
          language={language}
          isOnline={isOnline}
        />
      </main>
    </div>
  );
}