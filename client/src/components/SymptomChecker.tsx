import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Mic, 
  MicOff, 
  Send, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Clock,
  User,
  Thermometer,
  Heart,
  Activity,
  Brain,
  Eye,
  Ear
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
}

interface SymptomCheckerProps {
  user: User;
  language: 'en' | 'hi' | 'pa';
  isOnline: boolean;
}

interface SymptomResult {
  assessment: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  confidence: number;
  nextSteps: string[];
  shouldConsult: boolean;
}

export function SymptomChecker({ user, language, isOnline }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  const translations = {
    en: {
      title: "AI Symptom Checker",
      subtitle: "Describe your symptoms for preliminary health guidance",
      describe: "Describe your symptoms",
      placeholder: "E.g., I have a fever since yesterday, body aches, and mild cough...",
      voiceInput: "Voice Input",
      startListening: "Start Speaking",
      stopListening: "Stop Speaking",
      analyze: "Analyze Symptoms",
      analyzing: "Analyzing...",
      bodyMap: "Body Map",
      selectArea: "Select affected area",
      head: "Head",
      chest: "Chest",
      abdomen: "Abdomen",
      back: "Back",
      arms: "Arms",
      legs: "Legs",
      urgency: "Urgency Level",
      recommendations: "Recommendations",
      nextSteps: "Next Steps",
      confidence: "Confidence",
      disclaimer: "This is not a medical diagnosis. Always consult a healthcare professional for proper medical advice.",
      emergency: "Emergency",
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority",
      bookConsultation: "Book Consultation",
      callEmergency: "Call Emergency"
    },
    hi: {
      title: "AI लक्षण जांचकर्ता",
      subtitle: "प्रारंभिक स्वास्थ्य मार्गदर्शन के लिए अपने लक्षणों का वर्णन करें",
      describe: "अपने लक्षणों का वर्णन करें",
      placeholder: "जैसे, कल से बुखार है, शरीर में दर्द, और हल्की खांसी...",
      voiceInput: "आवाज़ इनपुट",
      startListening: "बोलना शुरू करें",
      stopListening: "बोलना बंद करें",
      analyze: "लक्षणों का विश्लेषण करें",
      analyzing: "विश्लेषण कर रहे हैं...",
      bodyMap: "शरीर का नक्शा",
      selectArea: "प्रभावित क्षेत्र चुनें",
      head: "सिर",
      chest: "छाती",
      abdomen: "पेट",
      back: "पीठ",
      arms: "बाहें",
      legs: "पैर",
      urgency: "तात्कालिकता स्तर",
      recommendations: "सिफारिशें",
      nextSteps: "अगले कदम",
      confidence: "विश्वास",
      disclaimer: "यह चिकित्सा निदान नहीं है। उचित चिकित्सा सलाह के लिए हमेशा स्वास्थ्य सेवा पेशेवर से सलाह लें।",
      emergency: "आपातकाल",
      high: "उच्च प्राथमिकता",
      medium: "मध्यम प्राथमिकता",
      low: "कम प्राथमिकता",
      bookConsultation: "परामर्श बुक करें",
      callEmergency: "आपातकाल कॉल करें"
    },
    pa: {
      title: "AI ਲੱਛਣ ਜਾਂਚਕਰਤਾ",
      subtitle: "ਸ਼ੁਰੂਆਤੀ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
      describe: "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
      placeholder: "ਜਿਵੇਂ, ਕੱਲ ਤੋਂ ਬੁਖਾਰ ਹੈ, ਸਰੀਰ ਵਿੱਚ ਦਰਦ, ਅਤੇ ਹਲਕੀ ਖੰਘ...",
      voiceInput: "ਆਵਾਜ਼ ਇਨਪੁੱਟ",
      startListening: "ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ",
      stopListening: "ਬੋਲਣਾ ਬੰਦ ਕਰੋ",
      analyze: "ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
      analyzing: "ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...",
      bodyMap: "ਸਰੀਰ ਦਾ ਨਕਸ਼ਾ",
      selectArea: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਚੁਣੋ",
      head: "ਸਿਰ",
      chest: "ਛਾਤੀ",
      abdomen: "ਪੇਟ",
      back: "ਪਿੱਠ",
      arms: "ਬਾਹਾਂ",
      legs: "ਲੱਤਾਂ",
      urgency: "ਤਤਕਾਲਤਾ ਪੱਧਰ",
      recommendations: "ਸਿਫਾਰਸ਼ਾਂ",
      nextSteps: "ਅਗਲੇ ਕਦਮ",
      confidence: "ਭਰੋਸਾ",
      disclaimer: "ਇਹ ਮੈਡੀਕਲ ਨਿਦਾਨ ਨਹੀਂ ਹੈ। ਸਹੀ ਮੈਡੀਕਲ ਸਲਾਹ ਲਈ ਹਮੇਸ਼ਾ ਸਿਹਤ ਸੇਵਾ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      emergency: "ਐਮਰਜੈਂਸੀ",
      high: "ਉੱਚ ਤਰਜੀਹ",
      medium: "ਮੱਧਮ ਤਰਜੀਹ",
      low: "ਘੱਟ ਤਰਜੀਹ",
      bookConsultation: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
      callEmergency: "ਐਮਰਜੈਂਸੀ ਕਾਲ ਕਰੋ"
    }
  };

  const t = translations[language];

  const bodyParts = [
    { id: 'head', name: t.head, icon: Brain, position: { top: '10%', left: '45%' } },
    { id: 'chest', name: t.chest, icon: Heart, position: { top: '30%', left: '45%' } },
    { id: 'abdomen', name: t.abdomen, icon: Activity, position: { top: '50%', left: '45%' } },
    { id: 'back', name: t.back, icon: User, position: { top: '40%', left: '25%' } },
    { id: 'arms', name: t.arms, icon: Activity, position: { top: '35%', left: '15%' } },
    { id: 'legs', name: t.legs, icon: Activity, position: { top: '70%', left: '45%' } }
  ];

  // Mock AI analysis
  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on keywords
    const symptomsLower = symptoms.toLowerCase();
    let mockResult: SymptomResult;
    
    if (symptomsLower.includes('chest pain') || symptomsLower.includes('breathing')) {
      mockResult = {
        assessment: "Possible respiratory or cardiac concern",
        urgency: 'high',
        recommendations: [
          "Seek immediate medical attention",
          "Monitor breathing carefully",
          "Rest and avoid physical exertion"
        ],
        confidence: 75,
        nextSteps: [
          "Visit emergency room if symptoms worsen",
          "Contact emergency services: 102"
        ],
        shouldConsult: true
      };
    } else if (symptomsLower.includes('fever') || symptomsLower.includes('headache')) {
      mockResult = {
        assessment: "Possible viral infection or common cold",
        urgency: 'medium',
        recommendations: [
          "Rest and stay hydrated",
          "Take paracetamol for fever",
          "Monitor temperature regularly"
        ],
        confidence: 85,
        nextSteps: [
          "Schedule teleconsultation within 24 hours",
          "Visit doctor if fever exceeds 102°F"
        ],
        shouldConsult: true
      };
    } else {
      mockResult = {
        assessment: "General health concern requiring evaluation",
        urgency: 'low',
        recommendations: [
          "Monitor symptoms for 24-48 hours",
          "Maintain good hygiene",
          "Stay hydrated and rest"
        ],
        confidence: 70,
        nextSteps: [
          "Consider teleconsultation if symptoms persist",
          "Keep a symptom diary"
        ],
        shouldConsult: false
      };
    }
    
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Mock voice input - in real app would use Speech Recognition API
    setTimeout(() => {
      setSymptoms(prev => prev + " [Voice input simulated] ");
      setIsListening(false);
    }, 3000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return t.emergency;
      case 'high': return t.high;
      case 'medium': return t.medium;
      case 'low': return t.low;
      default: return urgency;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>{t.title}</span>
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t.disclaimer}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Input */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.describe}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t.placeholder}
                className="min-h-32"
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={isListening ? () => setIsListening(false) : startVoiceInput}
                  disabled={!isOnline}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      {t.stopListening}
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      {t.startListening}
                    </>
                  )}
                </Button>
                
                {!isOnline && (
                  <span className="text-xs text-gray-500">(Voice input requires internet)</span>
                )}
              </div>

              <Button 
                onClick={analyzeSymptoms}
                disabled={!symptoms.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t.analyze}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Body Map */}
          <Card>
            <CardHeader>
              <CardTitle>{t.bodyMap}</CardTitle>
              <CardDescription>{t.selectArea}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-b from-blue-50 to-white rounded-lg p-6 h-96 overflow-hidden">
                {/* Human Body Silhouette SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 400"
                    className="h-full w-auto"
                    style={{ maxHeight: '350px' }}
                  >
                    {/* Body silhouette */}
                    <path
                      d="M100 20 C110 20 120 30 120 40 C120 50 110 60 100 60 C90 60 80 50 80 40 C80 30 90 20 100 20 Z"
                      fill="#e2e8f0"
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    {/* Neck */}
                    <rect x="95" y="60" width="10" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    {/* Torso */}
                    <path
                      d="M75 75 C75 75 80 70 100 70 C120 70 125 75 125 75 L125 180 C125 190 120 200 100 200 C80 200 75 190 75 180 Z"
                      fill="#e2e8f0"
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    {/* Arms */}
                    <ellipse cx="60" cy="120" rx="15" ry="40" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <ellipse cx="140" cy="120" rx="15" ry="40" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    {/* Legs */}
                    <ellipse cx="88" cy="280" rx="12" ry="80" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <ellipse cx="112" cy="280" rx="12" ry="80" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  </svg>
                </div>
                
                {/* Clickable body parts */}
                {bodyParts.map((part) => {
                  const Icon = part.icon;
                  return (
                    <button
                      key={part.id}
                      onClick={() => {
                        setSelectedBodyPart(part.id);
                        setSymptoms(prev => prev + ` [Pain/discomfort in ${part.name.toLowerCase()}] `);
                      }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedBodyPart === part.id 
                          ? 'bg-red-100 border-red-500 text-red-700 shadow-lg'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      style={{ top: part.position.top, left: part.position.left }}
                      title={`Click if you have pain in ${part.name.toLowerCase()}`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
                
                {/* Pain indicators */}
                {selectedBodyPart && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-100 border border-red-300 rounded-full p-2 animate-pulse">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                )}
              </div>
              
              {selectedBodyPart && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <p className="text-sm font-medium text-red-800">
                      Pain/discomfort selected: {bodyParts.find(p => p.id === selectedBodyPart)?.name}
                    </p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    This information will be shared with your doctor during consultation.
                  </p>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  💡 Tip: Click on the body parts where you feel pain or discomfort. You can select multiple areas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Analysis Results</span>
                    <Badge className={getUrgencyColor(result.urgency)}>
                      {getUrgencyText(result.urgency)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Assessment</h4>
                    <p className="text-gray-700">{result.assessment}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.confidence}</h4>
                    <div className="flex items-center space-x-3">
                      <Progress value={result.confidence} className="flex-1" />
                      <span className="text-sm text-gray-600">{result.confidence}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.recommendations}</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t.nextSteps}</h4>
                    <ul className="space-y-1">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.urgency === 'emergency' && (
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {t.callEmergency}
                  </Button>
                )}
                
                {result.shouldConsult && (
                  <Button className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    {t.bookConsultation}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Enter your symptoms and click analyze to get AI-powered health guidance</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}