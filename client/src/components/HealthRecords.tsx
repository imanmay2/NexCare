import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar,
  Pill,
  Activity,
  Heart,
  TestTube,
  User,
  AlertCircle,
  Shield,
  RefreshCw,
  Eye,
  Printer
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
}

interface HealthRecordsProps {
  user: User;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface MedicalRecord {
  id: string;
  type: 'consultation' | 'prescription' | 'lab-result' | 'vital-signs';
  date: string;
  doctor: string;
  title: string;
  summary: string;
  details: any;
  status: 'final' | 'preliminary' | 'pending';
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  diagnosis: string;
}

interface VitalSigns {
  id: string;
  date: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  bmi: string;
}

export function HealthRecords({ user, language, isOnline }: HealthRecordsProps) {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'syncing'>('synced');

  const translations = {
    en: {
      title: "Health Records",
      subtitle: "Your complete medical history and documents",
      consultations: "Consultations",
      prescriptions: "Prescriptions",
      labResults: "Lab Results",
      vitals: "Vital Signs",
      summary: "Medical Summary",
      download: "Download",
      share: "Share",
      print: "Print",
      view: "View Details",
      syncData: "Sync Data",
      lastSync: "Last synced",
      offlineMode: "Offline Mode - Records cached locally",
      noRecords: "No records available",
      emergencyAccess: "Emergency Access",
      emergencyInfo: "Critical medical information for emergency situations",
      allergies: "Allergies",
      medications: "Current Medications",
      conditions: "Medical Conditions",
      contacts: "Emergency Contacts",
      bloodType: "Blood Type",
      insurance: "Insurance Info",
      date: "Date",
      doctor: "Doctor",
      diagnosis: "Diagnosis",
      medication: "Medication",
      dosage: "Dosage",
      frequency: "Frequency",
      instructions: "Instructions",
      normal: "Normal",
      abnormal: "Abnormal",
      pending: "Pending"
    },
    hi: {
      title: "स्वास्थ्य रिकॉर्ड",
      subtitle: "आपका पूरा चिकित्सा इतिहास और दस्तावेज",
      consultations: "परामर्श",
      prescriptions: "नुस्खे",
      labResults: "लैब परिणाम",
      vitals: "महत्वपूर्ण संकेत",
      summary: "चिकित्सा सारांश",
      download: "डाउनलोड",
      share: "साझा करें",
      print: "प्रिंट",
      view: "विवरण देखें",
      syncData: "डेटा सिंक करें",
      lastSync: "अंतिम बार सिंक",
      offlineMode: "ऑफलाइन मोड - रिकॉर्ड स्थानीय रूप से संग्रहीत",
      noRecords: "कोई रिकॉर्ड उपलब्ध नहीं",
      emergencyAccess: "आपातकालीन पहुंच",
      emergencyInfo: "आपातकालीन स्थितियों के लिए महत्वपूर्ण चिकित्सा जानकारी",
      allergies: "एलर्जी",
      medications: "वर्तमान दवाएं",
      conditions: "चिकित्सा स्थितियां",
      contacts: "आपातकालीन संपर्क",
      bloodType: "रक्त समूह",
      insurance: "बीमा जानकारी",
      date: "तारीख",
      doctor: "डॉक्टर",
      diagnosis: "निदान",
      medication: "दवा",
      dosage: "खुराक",
      frequency: "आवृत्ति",
      instructions: "निर्देश",
      normal: "सामान्य",
      abnormal: "असामान्य",
      pending: "लंबित"
    },
    pa: {
      title: "ਸਿਹਤ ਰਿਕਾਰਡ",
      subtitle: "ਤੁਹਾਡਾ ਪੂਰਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਅਤੇ ਦਸਤਾਵੇਜ਼",
      consultations: "ਸਲਾਹ",
      prescriptions: "ਨੁਸਖੇ",
      labResults: "ਲੈਬ ਨਤੀਜੇ",
      vitals: "ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ",
      summary: "ਮੈਡੀਕਲ ਸਾਰਾਂਸ਼",
      download: "ਡਾਊਨਲੋਡ",
      share: "ਸਾਂਝਾ ਕਰੋ",
      print: "ਪ੍ਰਿੰਟ",
      view: "ਵੇਰਵੇ ਦੇਖੋ",
      syncData: "ਡੇਟਾ ਸਿੰਕ ਕਰੋ",
      lastSync: "ਆਖਰੀ ਵਾਰ ਸਿੰਕ",
      offlineMode: "ਔਫਲਾਈਨ ਮੋਡ - ਰਿਕਾਰਡ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਸਟੋਰ",
      noRecords: "ਕੋਈ ਰਿਕਾਰਡ ਉਪਲਬਧ ਨਹੀਂ",
      emergencyAccess: "ਐਮਰਜੈਂਸੀ ਪਹੁੰਚ",
      emergencyInfo: "ਐਮਰਜੈਂਸੀ ਸਥਿਤੀਆਂ ਲਈ ਮਹੱਤਵਪੂਰਨ ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ",
      allergies: "ਐਲਰਜੀਆਂ",
      medications: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ",
      conditions: "ਮੈਡੀਕਲ ਸਥਿਤੀਆਂ",
      contacts: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      bloodType: "ਖੂਨ ਦੀ ਕਿਸਮ",
      insurance: "ਬੀਮਾ ਜਾਣਕਾਰੀ",
      date: "ਮਿਤੀ",
      doctor: "ਡਾਕਟਰ",
      diagnosis: "ਨਿਦਾਨ",
      medication: "ਦਵਾਈ",
      dosage: "ਖੁਰਾਕ",
      frequency: "ਬਾਰੰਬਾਰਤਾ",
      instructions: "ਹਦਾਇਤਾਂ",
      normal: "ਸਾਧਾਰਨ",
      abnormal: "ਅਸਧਾਰਨ",
      pending: "ਲੰਬਿਤ"
    }
  };

  const t = translations[language];

  // Mock data
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'consultation',
      date: '2024-12-15',
      doctor: 'Dr. Priya Sharma',
      title: 'General Check-up',
      summary: 'Routine health examination with vital signs assessment',
      details: {
        symptoms: 'Fever, body ache',
        diagnosis: 'Viral fever',
        treatment: 'Rest, hydration, paracetamol'
      },
      status: 'final'
    },
    {
      id: '2',
      type: 'prescription',
      date: '2024-12-15',
      doctor: 'Dr. Priya Sharma',
      title: 'Prescription for Viral Fever',
      summary: 'Medication prescribed for viral fever treatment',
      details: {
        medications: [
          {
            name: 'Paracetamol 500mg',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '5 days',
            instructions: 'Take after meals'
          }
        ]
      },
      status: 'final'
    },
    {
      id: '3',
      type: 'lab-result',
      date: '2024-12-10',
      doctor: 'Dr. Rajesh Kumar',
      title: 'Blood Test Results',
      summary: 'Complete blood count and basic metabolic panel',
      details: {
        results: [
          { parameter: 'Hemoglobin', value: '13.5 g/dL', normal: '12-16 g/dL', status: 'normal' },
          { parameter: 'Blood Sugar', value: '95 mg/dL', normal: '70-100 mg/dL', status: 'normal' }
        ]
      },
      status: 'final'
    }
  ];

  const vitalSigns: VitalSigns[] = [
    {
      id: '1',
      date: '2024-12-15',
      bloodPressure: '120/80',
      heartRate: '78',
      temperature: '99.2°F',
      weight: '70 kg',
      height: '170 cm',
      bmi: '24.2'
    },
    {
      id: '2',
      date: '2024-12-10',
      bloodPressure: '118/78',
      heartRate: '75',
      temperature: '98.6°F',
      weight: '70 kg',
      height: '170 cm',
      bmi: '24.2'
    }
  ];

  const emergencyInfo = {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Vitamin D supplements'],
    medicalConditions: ['Hypertension (controlled)'],
    emergencyContacts: [
      { name: 'Spouse: Simran Kaur', phone: '+91-98765-43211' },
      { name: 'Brother: Ravi Singh', phone: '+91-98765-43212' }
    ],
    insurance: 'ESIC Card: 1234567890'
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncStatus('synced');
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return User;
      case 'prescription': return Pill;
      case 'lab-result': return TestTube;
      case 'vital-signs': return Activity;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'bg-green-100 text-green-800';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{t.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              {!isOnline && (
                <Badge variant="outline" className="text-orange-600">
                  Offline
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSync}
                disabled={!isOnline || syncStatus === 'syncing'}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {t.syncData}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t.offlineMode}. Records will sync when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">{t.summary}</TabsTrigger>
          <TabsTrigger value="consultations">{t.consultations}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t.prescriptions}</TabsTrigger>
          <TabsTrigger value="lab-results">{t.labResults}</TabsTrigger>
          <TabsTrigger value="vitals">{t.vitals}</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Emergency Access Card */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Shield className="h-5 w-5" />
                <span>{t.emergencyAccess}</span>
              </CardTitle>
              <CardDescription>
                {t.emergencyInfo}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{t.bloodType}</h4>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {emergencyInfo.bloodType}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.allergies}</h4>
                    <div className="space-y-1">
                      {emergencyInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.medications}</h4>
                    <div className="space-y-1">
                      {emergencyInfo.currentMedications.map((med, index) => (
                        <p key={index} className="text-sm">{med}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{t.conditions}</h4>
                    <div className="space-y-1">
                      {emergencyInfo.medicalConditions.map((condition, index) => (
                        <p key={index} className="text-sm">{condition}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.contacts}</h4>
                    <div className="space-y-1">
                      {emergencyInfo.emergencyContacts.map((contact, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-gray-600">{contact.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.insurance}</h4>
                    <p className="text-sm">{emergencyInfo.insurance}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Records Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Medical Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicalRecords.slice(0, 3).map((record) => {
                  const Icon = getRecordIcon(record.type);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{record.title}</h4>
                          <p className="text-sm text-gray-600">{record.date} - {record.doctor}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle>{t.consultations}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.filter(r => r.type === 'consultation').map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{record.title}</h4>
                        <p className="text-sm text-gray-600">{record.date} - {record.doctor}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t.view}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {t.download}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{record.summary}</p>
                    {record.details && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <p><strong>Symptoms:</strong> {record.details.symptoms}</p>
                        <p><strong>Diagnosis:</strong> {record.details.diagnosis}</p>
                        <p><strong>Treatment:</strong> {record.details.treatment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>{t.prescriptions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.filter(r => r.type === 'prescription').map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{record.title}</h4>
                        <p className="text-sm text-gray-600">{record.date} - {record.doctor}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          {t.print}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          {t.share}
                        </Button>
                      </div>
                    </div>
                    {record.details?.medications && (
                      <div className="space-y-2">
                        {record.details.medications.map((med: any, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                            <h5 className="font-medium">{med.name}</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                              <div><strong>{t.dosage}:</strong> {med.dosage}</div>
                              <div><strong>{t.frequency}:</strong> {med.frequency}</div>
                              <div><strong>Duration:</strong> {med.duration}</div>
                              <div><strong>{t.instructions}:</strong> {med.instructions}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results">
          <Card>
            <CardHeader>
              <CardTitle>{t.labResults}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.filter(r => r.type === 'lab-result').map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{record.title}</h4>
                        <p className="text-sm text-gray-600">{record.date} - {record.doctor}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t.download}
                      </Button>
                    </div>
                    {record.details?.results && (
                      <div className="space-y-2">
                        {record.details.results.map((result: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <span className="font-medium">{result.parameter}</span>
                              <span className="text-sm text-gray-600 ml-2">({result.normal})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{result.value}</span>
                              <Badge 
                                className={result.status === 'normal' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                                }
                              >
                                {result.status === 'normal' ? t.normal : t.abnormal}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>{t.vitals}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitalSigns.map((vital) => (
                  <div key={vital.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{vital.date}</h4>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        View Trends
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                        <div className="font-semibold">{vital.bloodPressure}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <Activity className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Heart Rate</div>
                        <div className="font-semibold">{vital.heartRate} bpm</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Temperature</div>
                        <div className="font-semibold">{vital.temperature}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <User className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Weight</div>
                        <div className="font-semibold">{vital.weight}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Height</div>
                        <div className="font-semibold">{vital.height}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <Activity className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">BMI</div>
                        <div className="font-semibold">{vital.bmi}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}