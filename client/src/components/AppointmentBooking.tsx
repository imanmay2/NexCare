import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MapPin,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Headphones
} from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  availability: string[];
  consultationFee: number;
  languages: string[];
}

interface AppointmentBookingProps {
  user: User;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export function AppointmentBooking({ user, language, isOnline, appointments, setAppointments }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'in-person'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [consultationModal, setConsultationModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({ isOpen: false, appointment: null });

  const translations = {
    en: {
      title: "Appointment Management",
      subtitle: "Book consultations and manage your appointments",
      bookNew: "Book New Appointment",
      upcoming: "Upcoming Appointments",
      past: "Past Appointments",
      selectDoctor: "Select Doctor",
      selectDate: "Select Date",
      selectTime: "Select Time",
      consultType: "Consultation Type",
      video: "Video Call",
      audio: "Audio Call",
      inPerson: "In-Person Visit",
      symptoms: "Describe your symptoms",
      bookAppointment: "Book Appointment",
      booking: "Booking...",
      cancel: "Cancel",
      join: "Join Consultation",
      reschedule: "Reschedule",
      viewPrescription: "View Prescription",
      rating: "Rating",
      experience: "Experience",
      fee: "Consultation Fee",
      languages: "Languages",
      available: "Available",
      unavailable: "Unavailable",
      success: "Appointment booked successfully!",
      error: "Failed to book appointment. Please try again."
    },
    hi: {
      title: "अपॉइंटमेंट प्रबंधन",
      subtitle: "परामर्श बुक करें और अपने अपॉइंटमेंट प्रबंधित करें",
      bookNew: "नया अपॉइंटमेंट बुक करें",
      upcoming: "आगामी अपॉइंटमेंट",
      past: "पिछले अपॉइंटमेंट",
      selectDoctor: "डॉक्टर चुनें",
      selectDate: "तारीख चुनें",
      selectTime: "समय चुनें",
      consultType: "परामर्श प्रकार",
      video: "वीडियो कॉल",
      audio: "ऑडियो कॉल",
      inPerson: "व्यक्तिगत मुलाकात",
      symptoms: "अपने लक्षणों का वर्णन करें",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      booking: "बुकिंग...",
      cancel: "रद्द करें",
      join: "परामर्श में शामिल हों",
      reschedule: "पुनर्निर्धारण",
      viewPrescription: "नुस्खा देखें",
      rating: "रेटिंग",
      experience: "अनुभव",
      fee: "परामर्श शुल्क",
      languages: "भाषाएं",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
      success: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!",
      error: "अपॉइंटमेंट बुक करने में विफल। कृपया पुनः प्रयास करें।"
    },
    pa: {
      title: "ਮੁਲਾਕਾਤ ਪ੍ਰਬੰਧਨ",
      subtitle: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ ਅਤੇ ਆਪਣੀਆਂ ਮੁਲਾਕਾਤਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
      bookNew: "ਨਵੀਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
      upcoming: "ਆਉਣ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ",
      past: "ਪਿਛਲੀਆਂ ਮੁਲਾਕਾਤਾਂ",
      selectDoctor: "ਡਾਕਟਰ ਚੁਣੋ",
      selectDate: "ਮਿਤੀ ਚੁਣੋ",
      selectTime: "ਸਮਾਂ ਚੁਣੋ",
      consultType: "ਸਲਾਹ ਦੀ ਕਿਸਮ",
      video: "ਵੀਡੀਓ ਕਾਲ",
      audio: "ਆਡੀਓ ਕਾਲ",
      inPerson: "ਵਿਅਕਤੀਗਤ ਮੁਲਾਕਾਤ",
      symptoms: "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
      bookAppointment: "ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
      booking: "ਬੁੱਕਿੰਗ...",
      cancel: "ਰੱਦ ਕਰੋ",
      join: "ਸਲਾਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      reschedule: "ਮੁੜ ਨਿਰਧਾਰਣ",
      viewPrescription: "ਨੁਸਖਾ ਦੇਖੋ",
      rating: "ਰੇਟਿੰਗ",
      experience: "ਤਜਰਬਾ",
      fee: "ਸਲਾਹ ਫੀਸ",
      languages: "ਭਾਸ਼ਾਵਾਂ",
      available: "ਉਪਲਬਧ",
      unavailable: "ਅਣਉਪਲਬਧ",
      success: "ਮੁਲਾਕਾਤ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਈ!",
      error: "ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
    }
  };

  const t = translations[language];

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      rating: 4.8,
      experience: '8 years',
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      consultationFee: 200,
      languages: ['English', 'Hindi', 'Punjabi']
    },
    {
      id: '2', 
      name: 'Dr. Rajesh Kumar',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: '12 years',
      availability: ['10:00', '11:00', '15:00', '16:00', '17:00'],
      consultationFee: 250,
      languages: ['Hindi', 'Punjabi']
    },
    {
      id: '3',
      name: 'Dr. Sunita Patel',
      specialty: 'Gynecology',
      rating: 4.9,
      experience: '15 years',
      availability: ['09:00', '11:00', '14:00', '16:00'],
      consultationFee: 300,
      languages: ['English', 'Hindi']
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !symptoms.trim()) {
      return;
    }

    setIsBooking(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const doctor = doctors.find(d => d.id === selectedDoctor);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: doctor?.name || 'Unknown Doctor',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      type: consultationType,
      status: 'upcoming',
      symptoms: symptoms
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingForm(false);
    setSelectedTime('');
    setSymptoms('');
    setIsBooking(false);
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'in-person': return MapPin;
      default: return CalendarIcon;
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'in-person': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    if (!isOnline && appointment.type !== 'in-person') {
      alert('Internet connection required for video/audio consultations');
      return;
    }
    setConsultationModal({ isOpen: true, appointment });
  };

  if (showBookingForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t.bookNew}</span>
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                {t.cancel}
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t.selectDoctor}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor === doctor.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              ⭐ {doctor.rating}
                            </span>
                            <span className="text-xs text-gray-500">{doctor.experience}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">₹{doctor.consultationFee}</div>
                        <div className="text-xs text-gray-500">{t.fee}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {t.languages}: {doctor.languages.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.selectDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {selectedDate && selectedDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.selectTime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const doctor = doctors.find(d => d.id === selectedDoctor);
                      const isAvailable = doctor?.availability.includes(time);
                      
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          disabled={!isAvailable}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Consultation Type & Symptoms */}
        {selectedDate && selectedTime && selectedDoctor && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.consultType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {(['video', 'audio', 'in-person'] as const).map((type) => {
                    const Icon = getAppointmentIcon(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setConsultationType(type)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          consultationType === type 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{t[type]}</div>
                            <div className="text-xs text-gray-500">
                              {type === 'video' && 'High quality video consultation'}
                              {type === 'audio' && 'Audio-only call (low bandwidth)'}
                              {type === 'in-person' && 'Visit Nabha Civil Hospital'}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.symptoms}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms, medical history, and reason for consultation..."
                  className="min-h-32"
                />
                
                <Button
                  onClick={handleBookAppointment}
                  disabled={!symptoms.trim() || isBooking}
                  className="w-full mt-4"
                >
                  {isBooking ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t.booking}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.bookAppointment}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t.title}</span>
            <Button onClick={() => setShowBookingForm(true)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t.bookNew}
            </Button>
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. You can view existing appointments but cannot book new ones.
          </AlertDescription>
        </Alert>
      )}

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>{t.upcoming}</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
            <div className="space-y-4">
              {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => {
                const Icon = getAppointmentIcon(appointment.type);
                return (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge className={getAppointmentTypeColor(appointment.type)}>
                            {t[appointment.type]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleJoinConsultation(appointment)}>
                          {t.join}
                        </Button>
                        <Button variant="outline" size="sm">{t.reschedule}</Button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm">{t.symptoms}: {appointment.symptoms}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No upcoming appointments</p>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>{t.past}</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.filter(apt => apt.status === 'completed').length > 0 ? (
            <div className="space-y-4">
              {appointments.filter(apt => apt.status === 'completed').map((appointment) => {
                const Icon = getAppointmentIcon(appointment.type);
                return (
                  <div key={appointment.id} className="border rounded-lg p-4 opacity-75">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t.viewPrescription}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No past appointments</p>
          )}
        </CardContent>
      </Card>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={consultationModal.isOpen}
        onClose={() => setConsultationModal({ isOpen: false, appointment: null })}
        appointment={consultationModal.appointment}
        user={user}
        language={language}
        isOnline={isOnline}
      />
    </div>
  );
}