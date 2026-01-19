import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  Clock,
  Video,
  Phone,
  FileText,
  Pill,
  LogOut,
  User,
  CheckCircle,
  AlertCircle,
  Headphones,
  MapPin
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
}

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface Consultation {
  id: string;
  patientName: string;
  patientAge: number;
  time: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'waiting' | 'in-progress' | 'completed';
  symptoms: string;
  urgency: 'low' | 'medium' | 'high';
}

export function DoctorDashboard({ user, onLogout, language, isOnline }: DoctorDashboardProps) {
  const [consultations] = useState<Consultation[]>([
    {
      id: '1',
      patientName: 'Amar Singh',
      patientAge: 35,
      time: '14:30',
      type: 'video',
      status: 'waiting',
      symptoms: 'Fever, body ache, mild cough',
      urgency: 'medium'
    },
    {
      id: '2',
      patientName: 'Simran Kaur',
      patientAge: 28,
      time: '15:00',
      type: 'audio',
      status: 'waiting',
      symptoms: 'Headache, nausea',
      urgency: 'low'
    },
    {
      id: '3',
      patientName: 'Ravi Kumar',
      patientAge: 45,
      time: '15:30',
      type: 'in-person',
      status: 'waiting',
      symptoms: 'Chest pain, shortness of breath',
      urgency: 'high'
    }
  ]);

  const translations = {
    en: {
      dashboard: "Doctor Dashboard",
      welcome: "Welcome, Dr.",
      consultationQueue: "Consultation Queue",
      todayStats: "Today's Statistics",
      patientRecords: "Patient Records",
      prescriptions: "Prescriptions",
      schedule: "Schedule",
      waiting: "Waiting",
      inProgress: "In Progress",
      completed: "Completed",
      startConsultation: "Start Consultation",
      viewHistory: "View History",
      writePrescription: "Write Prescription",
      urgency: "Urgency",
      symptoms: "Symptoms",
      age: "Age",
      low: "Low",
      medium: "Medium",
      high: "High",
      totalPatients: "Total Patients",
      pendingConsults: "Pending Consults",
      completedToday: "Completed Today",
      avgRating: "Average Rating"
    },
    hi: {
      dashboard: "डॉक्टर डैशबोर्ड",
      welcome: "स्वागत है, डॉ.",
      consultationQueue: "परामर्श कतार",
      todayStats: "आज की आंकड़े",
      patientRecords: "मरीज़ के रिकॉर्ड",
      prescriptions: "नुस्खे",
      schedule: "कार्यक्रम",
      waiting: "प्रतीक्षारत",
      inProgress: "प्रगति में",
      completed: "पूर्ण",
      startConsultation: "परामर्श शुरू करें",
      viewHistory: "इतिहास देखें",
      writePrescription: "नुस्खा लिखें",
      urgency: "तात्कालिकता",
      symptoms: "लक्षण",
      age: "आयु",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      totalPatients: "कुल मरीज़",
      pendingConsults: "लंबित परामर्श",
      completedToday: "आज पूर्ण",
      avgRating: "औसत रेटिंग"
    },
    pa: {
      dashboard: "ਡਾਕਟਰ ਡੈਸ਼ਬੋਰਡ",
      welcome: "ਸੁਆਗਤ ਹੈ, ਡਾ.",
      consultationQueue: "ਸਲਾਹ ਕਤਾਰ",
      todayStats: "ਅੱਜ ਦੇ ਅੰਕੜੇ",
      patientRecords: "ਮਰੀਜ਼ ਰਿਕਾਰਡ",
      prescriptions: "ਨੁਸਖੇ",
      schedule: "ਕਾਰਜਕ੍ਰਮ",
      waiting: "ਉਡੀਕ ਵਿੱਚ",
      inProgress: "ਪ੍ਰਗਤੀ ਵਿੱਚ",
      completed: "ਪੂਰਾ",
      startConsultation: "ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ",
      viewHistory: "ਇਤਿਹਾਸ ਦੇਖੋ",
      writePrescription: "ਨੁਸਖਾ ਲਿਖੋ",
      urgency: "ਤਤਕਾਲਤਾ",
      symptoms: "ਲੱਛਣ",
      age: "ਉਮਰ",
      low: "ਘੱਟ",
      medium: "ਮੱਧਮ",
      high: "ਉੱਚ",
      totalPatients: "ਕੁੱਲ ਮਰੀਜ਼",
      pendingConsults: "ਲੰਬਿਤ ਸਲਾਹ",
      completedToday: "ਅੱਜ ਪੂਰੇ",
      avgRating: "ਔਸਤ ਰੇਟਿੰਗ"
    }
  };

  const t = translations[language];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'in-person': return MapPin;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Stethoscope className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t.welcome} {user.name}
                </h1>
                <p className="text-sm text-gray-600">General Medicine • Nabha Civil Hospital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="text-gray-600">Today: Dec 17, 2024</div>
                <div className="text-gray-500">8 consultations scheduled</div>
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're offline. Some features may be limited. Patient data will sync when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">{t.totalPatients}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">{t.pendingConsults}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">{t.completedToday}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">{t.avgRating}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="queue">{t.consultationQueue}</TabsTrigger>
            <TabsTrigger value="patients">{t.patientRecords}</TabsTrigger>
            <TabsTrigger value="prescriptions">{t.prescriptions}</TabsTrigger>
            <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.consultationQueue}</CardTitle>
                <CardDescription>
                  Manage your consultation queue and patient interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consultation) => {
                    const Icon = getConsultationIcon(consultation.type);
                    return (
                      <div key={consultation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{consultation.patientName}</h4>
                              <p className="text-sm text-gray-600">
                                {t.age}: {consultation.patientAge} • {consultation.time}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <Badge className={getStatusColor(consultation.status)}>
                              {consultation.status === 'waiting' && t.waiting}
                              {consultation.status === 'in-progress' && t.inProgress}
                              {consultation.status === 'completed' && t.completed}
                            </Badge>
                            <Badge className={getUrgencyColor(consultation.urgency)}>
                              {consultation.urgency === 'low' && t.low}
                              {consultation.urgency === 'medium' && t.medium}
                              {consultation.urgency === 'high' && t.high}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <h5 className="text-sm font-medium mb-1">{t.symptoms}:</h5>
                          <p className="text-sm text-gray-700">{consultation.symptoms}</p>
                        </div>

                        <div className="flex space-x-2">
                          {consultation.status === 'waiting' && (
                            <Button size="sm" className="flex-1">
                              <Video className="h-4 w-4 mr-2" />
                              {t.startConsultation}
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            {t.viewHistory}
                          </Button>
                          
                          <Button variant="outline" size="sm" className="flex-1">
                            <Pill className="h-4 w-4 mr-2" />
                            {t.writePrescription}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>{t.patientRecords}</CardTitle>
                <CardDescription>
                  Access and manage patient medical records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Patient records management interface would be implemented here</p>
                  <p className="text-sm">Search, filter, and access complete patient histories</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>{t.prescriptions}</CardTitle>
                <CardDescription>
                  Create and manage digital prescriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Digital prescription system would be implemented here</p>
                  <p className="text-sm">E-prescriptions with pharmacy integration and drug interaction checking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>{t.schedule}</CardTitle>
                <CardDescription>
                  Manage your consultation schedule and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Schedule management interface would be implemented here</p>
                  <p className="text-sm">Set availability, block time slots, and manage appointments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}