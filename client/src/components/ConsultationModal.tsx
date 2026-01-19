import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  Clock,
  User,
  Stethoscope,
  Signal,
  Wifi,
  WifiOff,
  Camera,
  Settings
} from 'lucide-react';

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

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  user: User;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

export function ConsultationModal({ isOpen, onClose, appointment, user, language, isOnline }: ConsultationModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [duration, setDuration] = useState(0);

  const translations = {
    en: {
      consultation: "Consultation",
      connecting: "Connecting...",
      connected: "Connected",
      waitingForDoctor: "Waiting for doctor to join",
      connectionQuality: "Connection Quality",
      duration: "Duration",
      toggleVideo: "Toggle Video",
      toggleAudio: "Toggle Audio",
      endCall: "End Consultation",
      switchToAudio: "Switch to Audio Only",
      poorConnection: "Poor connection detected. Consider switching to audio-only mode.",
      doctorJoined: "Doctor has joined the consultation",
      consultationEnded: "Consultation ended",
      excellent: "Excellent",
      good: "Good", 
      poor: "Poor",
      minutes: "minutes",
      chat: "Chat",
      settings: "Settings"
    },
    hi: {
      consultation: "परामर्श",
      connecting: "कनेक्ट हो रहा है...",
      connected: "जुड़ गया",
      waitingForDoctor: "डॉक्टर के शामिल होने का इंतजार",
      connectionQuality: "कनेक्शन गुणवत्ता",
      duration: "अवधि",
      toggleVideo: "वीडियो टॉगल करें",
      toggleAudio: "ऑडियो टॉगल करें",
      endCall: "परामर्श समाप्त करें",
      switchToAudio: "केवल ऑडियो पर स्विच करें",
      poorConnection: "खराब कनेक्शन का पता चला। केवल ऑडियो मोड पर स्विच करने पर विचार करें।",
      doctorJoined: "डॉक्टर परामर्श में शामिल हो गए हैं",
      consultationEnded: "परामर्श समाप्त",
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      poor: "खराब",
      minutes: "मिनट",
      chat: "चैट",
      settings: "सेटिंग्स"
    },
    pa: {
      consultation: "ਸਲਾਹ",
      connecting: "ਜੁੜ ਰਿਹਾ ਹੈ...",
      connected: "ਜੁੜ ਗਿਆ",
      waitingForDoctor: "ਡਾਕਟਰ ਦੇ ਸ਼ਾਮਲ ਹੋਣ ਦੀ ਉਡੀਕ",
      connectionQuality: "ਕਨੈਕਸ਼ਨ ਗੁਣਵੱਤਾ",
      duration: "ਅਵਧੀ",
      toggleVideo: "ਵੀਡੀਓ ਟੌਗਲ ਕਰੋ",
      toggleAudio: "ਆਡੀਓ ਟੌਗਲ ਕਰੋ",
      endCall: "ਸਲਾਹ ਖਤਮ ਕਰੋ",
      switchToAudio: "ਸਿਰਫ਼ ਆਡੀਓ 'ਤੇ ਸਵਿਚ ਕਰੋ",
      poorConnection: "ਮਾੜਾ ਕਨੈਕਸ਼ਨ ਮਿਲਿਆ। ਸਿਰਫ਼ ਆਡੀਓ ਮੋਡ 'ਤੇ ਜਾਣ ਬਾਰੇ ਸੋਚੋ।",
      doctorJoined: "ਡਾਕਟਰ ਸਲਾਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਗਿਆ ਹੈ",
      consultationEnded: "ਸਲਾਹ ਖਤਮ",
      excellent: "ਸ਼ਾਨਦਾਰ",
      good: "ਚੰਗਾ",
      poor: "ਮਾੜਾ",
      minutes: "ਮਿੰਟ",
      chat: "ਚੈਟ",
      settings: "ਸੈਟਿੰਗਜ਼"
    }
  };

  const t = translations[language];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    if (isOpen && appointment) {
      setIsConnecting(true);
      // Simulate connection process
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        // Simulate random connection quality
        const qualities = ['excellent', 'good', 'poor'] as const;
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }, 3000);
    } else {
      setIsConnecting(false);
      setIsConnected(false);
      setDuration(0);
    }
  }, [isOpen, appointment]);

  const handleEndConsultation = () => {
    setIsConnected(false);
    setDuration(0);
    onClose();
  };

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5" />
              <span>{t.consultation} - {appointment.doctorName}</span>
            </div>
            <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {isConnected ? t.connected : (isConnecting ? t.connecting : 'Waiting')}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {appointment.date} at {appointment.time} • {appointment.type} consultation
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Main Video Area */}
          <div className="lg:col-span-3 bg-gray-900 rounded-lg relative overflow-hidden">
            {isConnecting ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>{t.connecting}</p>
                </div>
              </div>
            ) : isConnected ? (
              <>
                {/* Doctor's Video */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  {appointment.type === 'video' && videoEnabled ? (
                    <div className="text-center text-white">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarFallback className="text-2xl">
                          <Stethoscope className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-lg">{appointment.doctorName}</p>
                      <p className="text-sm opacity-75">Video connection established</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="bg-white/20 rounded-full p-8 mb-4">
                        <Phone className="h-16 w-16 mx-auto" />
                      </div>
                      <p className="text-lg">{appointment.doctorName}</p>
                      <p className="text-sm opacity-75">Audio-only consultation</p>
                    </div>
                  )}
                </div>

                {/* Patient's Video (Picture-in-Picture) */}
                {appointment.type === 'video' && videoEnabled && (
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}

                {/* Connection Quality Indicator */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-2">
                  {isOnline ? (
                    <Wifi className={`h-4 w-4 ${getConnectionColor(connectionQuality)}`} />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${getConnectionColor(connectionQuality)}`}>
                    {t[connectionQuality as keyof typeof t]}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-white" />
                    <span className="text-sm text-white">{formatDuration(duration)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>{t.waitingForDoctor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Doctor Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Doctor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      <Stethoscope className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{appointment.doctorName}</p>
                    <p className="text-xs text-gray-600">General Medicine</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            {connectionQuality === 'poor' && (
              <Alert>
                <Signal className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t.poorConnection}
                </AlertDescription>
              </Alert>
            )}

            {/* Chat */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t.chat}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="text-xs text-gray-600 bg-gray-100 rounded p-2">
                    Consultation started. Please describe your symptoms.
                  </div>
                </div>
                <div className="mt-3 flex">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    className="flex-1 text-sm p-2 border rounded-l"
                  />
                  <Button size="sm" className="rounded-l-none">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t">
          {appointment.type === 'video' && (
            <Button
              variant={videoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
              {t.toggleVideo}
            </Button>
          )}

          <Button
            variant={audioEnabled ? "default" : "destructive"}
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
            {t.toggleAudio}
          </Button>

          {appointment.type === 'video' && connectionQuality === 'poor' && (
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              {t.switchToAudio}
            </Button>
          )}

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {t.settings}
          </Button>

          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEndConsultation}
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            {t.endCall}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}