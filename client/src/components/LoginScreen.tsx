import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Stethoscope, Building2, Phone, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa';
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
  language: 'en' | 'hi' | 'pa';
  setLanguage: (lang: 'en' | 'hi' | 'pa') => void;
}

export function LoginScreen({ onLogin, language }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'pharmacy'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      title: "Access Healthcare Platform",
      subtitle: "Enter your details to continue",
      name: "Full Name",
      phone: "Phone Number",
      role: "Select Role",
      patient: "Patient",
      doctor: "Doctor",
      pharmacy: "Pharmacy",
      login: "Continue",
      privacy: "Your data is secure and encrypted",
      demo: "Demo Login",
      patientDesc: "Book consultations, view records",
      doctorDesc: "Manage consultations, prescriptions",
      pharmacyDesc: "Update medicine stock, orders"
    },
    hi: {
      title: "स्वास्थ्य प्लेटफॉर्म तक पहुंच",
      subtitle: "जारी रखने के लिए अपना विवरण दर्ज करें",
      name: "पूरा नाम",
      phone: "फोन नंबर",
      role: "भूमिका चुनें",
      patient: "मरीज़",
      doctor: "डॉक्टर",
      pharmacy: "फार्मेसी",
      login: "जारी रखें",
      privacy: "आपका डेटा सुरक्षित और एन्क्रिप्टेड है",
      demo: "डेमो लॉगिन",
      patientDesc: "परामर्श बुक करें, रिकॉर्ड देखें",
      doctorDesc: "परामर्श, नुस्खे प्रबंधित करें",
      pharmacyDesc: "दवा स्टॉक, ऑर्डर अपडेट करें"
    },
    pa: {
      title: "ਸਿਹਤ ਪਲੈਟਫਾਰਮ ਤੱਕ ਪਹੁੰਚ",
      subtitle: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੇ ਵੇਰਵੇ ਦਾਖਲ ਕਰੋ",
      name: "ਪੂਰਾ ਨਾਮ",
      phone: "ਫੋਨ ਨੰਬਰ",
      role: "ਭੂਮਿਕਾ ਚੁਣੋ",
      patient: "ਮਰੀਜ਼",
      doctor: "ਡਾਕਟਰ",
      pharmacy: "ਫਾਰਮੇਸੀ",
      login: "ਜਾਰੀ ਰੱਖੋ",
      privacy: "ਤੁਹਾਡਾ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਅਤੇ ਐਨਕ੍ਰਿਪਟ ਹੈ",
      demo: "ਡੈਮੋ ਲਾਗਇਨ",
      patientDesc: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ, ਰਿਕਾਰਡ ਦੇਖੋ",
      doctorDesc: "ਸਲਾਹ, ਨੁਸਖੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
      pharmacyDesc: "ਦਵਾਈ ਸਟਾਕ, ਆਰਡਰ ਅੱਪਡੇਟ ਕਰੋ"
    }
  };

  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || `Demo ${t[role]}`,
      role,
      phone: phone || '+91-XXXX-XXXX',
      language
    };

    onLogin(user);
    setIsLoading(false);
  };

  const handleDemoLogin = (demoRole: 'patient' | 'doctor' | 'pharmacy') => {
    const demoUsers = {
      patient: { name: 'Amar Singh', phone: '+91-98765-43210' },
      doctor: { name: 'Dr. Priya Sharma', phone: '+91-98765-43211' },
      pharmacy: { name: 'Nabha Medical Store', phone: '+91-98765-43212' }
    };

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: demoUsers[demoRole].name,
      role: demoRole,
      phone: demoUsers[demoRole].phone,
      language
    };

    onLogin(user);
  };

  const roleIcons = {
    patient: User,
    doctor: Stethoscope,
    pharmacy: Building2
  };

  return (
    <div className="space-y-6">
      {/* Demo Login Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">{t.demo}</h3>
        <div className="grid grid-cols-1 gap-2">
          {(['patient', 'doctor', 'pharmacy'] as const).map((demoRole) => {
            const Icon = roleIcons[demoRole];
            return (
              <Button
                key={demoRole}
                variant="outline"
                onClick={() => handleDemoLogin(demoRole)}
                className="justify-start h-auto p-3"
              >
                <Icon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t[demoRole]}</div>
                  <div className="text-xs text-gray-500">{t[`${demoRole}Desc` as keyof typeof t]}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or register new account</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.name}</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t.phone}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91-XXXXX-XXXXX"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>{t.role}</Label>
          <RadioGroup value={role} onValueChange={(value) => setRole(value as typeof role)}>
            {(['patient', 'doctor', 'pharmacy'] as const).map((roleOption) => {
              const Icon = roleIcons[roleOption];
              return (
                <div key={roleOption} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={roleOption} id={roleOption} />
                  <Icon className="h-4 w-4 text-gray-600" />
                  <Label htmlFor={roleOption} className="flex-1 cursor-pointer">
                    <div className="font-medium">{t[roleOption]}</div>
                    <div className="text-xs text-gray-500">{t[`${roleOption}Desc` as keyof typeof t]}</div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Loading...' : t.login}
        </Button>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>{t.privacy}</span>
        </div>
      </form>
    </div>
  );
}