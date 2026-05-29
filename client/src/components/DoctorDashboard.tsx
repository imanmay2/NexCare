import React, { useEffect, useState } from 'react';
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
  MapPin,
  Activity,
  HeartPulse,
  Thermometer,
  Scale,
  Ruler,
  PlusCircle,
  Search,
  Save
} from 'lucide-react';
import { Input } from './ui/input';
import { HealthMetricsOverlay } from './HealthMetricsOverlay';
import { EditClinicalProfile } from './ClinicalProfileOverlay';
import { Label } from './ui/label';
import DoctorSchedule from './DoctorSchedule';
import DoctorSettings from './DoctorSettings';
import axios from 'axios';
import { useError } from './ui/Toast';
import { SPECIALIZATIONS } from '../utils/utils';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  email: string;
  language: 'en' | 'hi' | 'pa';
}

interface DoctorDashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  onLogout: () => void;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
  data?: any;
  setData?: any
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


type TimeSlot = { id: number, start: string; end: string };
type TimeSlots = Record<string, TimeSlot[]>;

export function DoctorDashboard({ user, setUser, onLogout, language, isOnline, data, setData }: DoctorDashboardProps) {
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
      status: 'completed',
      symptoms: 'Chest pain, shortness of breath',
      urgency: 'high'
    }
  ]);

  const { showToast } = useError();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [isClinicalProfileModalOpen, setIsClinicalProfileModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({
  });

  useEffect(() => {
    axios.get("http://localhost:8090/doctor/getSchedule", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        if (res.status === 200) {
          setTimeSlots(data.availability);
        } else {
          throw Error("Failed to fetch schedule");
        }
      }).catch((err) => {
        showToast("Error in fetching schedule...", false);
      })
  }, [])

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
      avgRating: "Average Rating",
      settings: "Settings"
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
      avgRating: "औसत रेटिंग",
      settings: "सेटिंग्स"
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
      avgRating: "ਔਸਤ ਰੇਟਿੰਗ",
      settings: "ਸੈਟਿੰਗਸ"
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

  const handleSave = async () => {
    setIsSaving(true);
    console.log(timeSlots);

    try {
      const res = await axios.put("http://localhost:8090/doctor/setSchedule", {
        d_id: user.id,
        availability: timeSlots
      }, { withCredentials: true })

      const data = await res.data;
      if (res.status === 200) {
        showToast(data.Message, data.success);
      } else {
        throw Error("Failed to save schedule");
      }
    } catch (err) {
      showToast("Error in saving schedule...", false);
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  }

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
                {data?.domain && data?.hospital && <p className="text-sm text-gray-600">{SPECIALIZATIONS.filter((s => s.value == data?.domain))[0].label || ''} • {data?.hospital || ''}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="text-gray-600">Today: {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</div>
                <div className="text-gray-500">{consultations.length} consultations scheduled</div>
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
              <div className="text-2xl font-bold text-gray-900">{consultations.length}</div>
              <div className="text-sm text-gray-600">{t.pendingConsults}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{consultations.filter(c => c.status === 'completed').length}</div>
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
            <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
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
              <CardContent className="space-y-6 py-6">

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Patient ID..."
                      className="pl-10 bg-white border-none shadow-sm h-12"
                    />
                  </div>
                </div>

                {/* Patient Summary Card */}
                <div className="lg:col-span-1">
                  <Card className="h-full border-blue-100 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="text-base">Current Patient Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <Avatar className="h-12 w-12 border-2 border-blue-200">
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">Amar Singh</p>
                          <p className="text-xs text-gray-500">ID: PX-9921 • 35 Yrs</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Blood Group</span>
                          <span className="font-medium">B+ Positive</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Known Allergies</span>
                          <span className="text-red-600 font-medium">Penicillin</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Chronic Conditions</span>
                          <span className="font-medium">Hypertension</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Medications</span>
                          <span className="font-medium">Lisinopril 10mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Family History</span>
                          <span className="font-medium">Cardiac Issues of Father</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Surgical History</span>
                          <span className="font-medium">Appendectomy</span>
                        </div>
                      </div>
                      <Button onClick={() => setIsClinicalProfileModalOpen(true)} className="w-full mt-4 variant-outline bg-white border-blue-200 text-blue-600 hover:bg-blue-50">
                        Edit Clinical Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* The Metrics Grid */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-white border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">Clinical Vitals</CardTitle>
                        <CardDescription>Recent physiological measurements</CardDescription>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Label className="text-sm font-medium text-gray-500">
                          <b>Date:</b> {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Label>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Last Sync: Just now
                        </Badge>
                        <Button
                          onClick={() => setIsMetricsModalOpen(true)}
                          variant="outline"
                        >
                          <PlusCircle className="h-5 w-5" />
                          Add New Metrics
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0">
                      {[
                        { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: HeartPulse, color: "text-red-500" },
                        { label: "Heart Rate", value: "72", unit: "bpm", icon: Activity, color: "text-orange-500" },
                        { label: "SpO2", value: "98", unit: "%", icon: CheckCircle, color: "text-blue-500" },
                        { label: "Temp", value: "98.6", unit: "°F", icon: Thermometer, color: "text-yellow-600" },
                        { label: "Weight", value: "68", unit: "kg", icon: Scale, color: "text-emerald-600" },
                        { label: "Height", value: "172", unit: "cm", icon: Ruler, color: "text-indigo-600" }
                      ].map((metric) => (
                        <div key={metric.label} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-hover hover:border-blue-200 mx-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`p-1.5 rounded-md ${metric.color.replace('text', 'bg')}/10`}>
                              <metric.icon className={`h-4 w-4 ${metric.color}`} />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{metric.label}</p>
                          </div>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-gray-900 leading-none">{metric.value}</span>
                            <span className="text-[10px] text-gray-400 font-medium pb-0.5 leading-none">{metric.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add the Overlay Component here */}
                <HealthMetricsOverlay
                  isOpen={isMetricsModalOpen}
                  onClose={() => setIsMetricsModalOpen(false)}
                  patientId="PX-9921"
                />
                <EditClinicalProfile
                  isOpen={isClinicalProfileModalOpen}
                  onClose={() => setIsClinicalProfileModalOpen(false)}
                  patientId="PX-9921"
                />

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t.schedule}</CardTitle>
                    <CardDescription>
                      Manage your consultation schedule and availability
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DoctorSchedule timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <DoctorSettings user={user} setUser={setUser} data={data} setData={setData} />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div >
  );
}