import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Stethoscope, Building2, Phone, Shield } from 'lucide-react';
import { useError } from './ui/Toast';


interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  email: string;
  language: 'en' | 'hi' | 'pa';
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
  language: 'en' | 'hi' | 'pa';
  setLanguage: (lang: 'en' | 'hi' | 'pa') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginScreen({ onLogin, language, setLanguage, isLoading, setIsLoading }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'pharmacy'>('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { showToast } = useError();



  const translations = {
    en: {
      title: "Access Healthcare Platform",
      subtitle: "Enter your details to continue",
      name: "Full Name",
      email: "Email Address",
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
      email: "ईमेल एड्रेस",
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
      email: "ਈਮੇਲ ਐਡਰੇਸ",
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

  const roleIcons = {
    patient: User,
    doctor: Stethoscope,
    pharmacy: Building2
  };

  function isValid(email: string): Boolean {
    if (email.includes("@") && email.split("@").length == 2 && email.length != 0 && email.split("@")[1].includes("."))
      return true
    return false
  }

  const getOTP = async (e: any) => {
    e.preventDefault();
    if (!isValid(email) && (!isLogin ? name.length == 0 : true)) {
      showToast("Enter details properly", false);
      return
    }
    try {
      setIsLoading(true)
      // Get OTP request
      const response = await fetch('http://localhost:8090/users/otp', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, isLogin: isLogin })
      })
      const responseData = await response.json();
      if (response.ok) {
        setIsLoading(false);
        setIsOtpSent(true);
        showToast(responseData.Message, responseData.success)
      } else {
        setIsLoading(false);
        showToast(responseData.Message, responseData.success)
      }
    } catch (error) {
      setIsLoading(false);
      showToast(`Error during OTP request: ${error}`, false);
    }
  }

  const validateOTP = async (otp_: string) => {
    // Validate OTP request
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8090/users/', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          name: name || null,
          role: role || null,
          otp: otp_,
          isLogin: isLogin
        })
      })
      const responseData = await response.json();
      if (response.ok) {
        //backend res
        console.log(responseData);
        setIsLoading(false);
        if (responseData.Message)
          showToast(responseData.Message, responseData.success);
        const user: User = {
          id: '1',
          name: responseData.name,
          role: responseData.role,
          email: email,
          language: language
        };
        onLogin(user);
      } else {
        console.log("Entered here")
        setIsLoading(false);
        showToast(responseData.Message, responseData.success);
      }
    } catch (error) {
      setIsLoading(false)
      showToast(`Error occured: ${error}`, false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        {/* Horizontal Button Container */}
        <div className="flex flex-row gap-3">
          <Button
            variant={isLogin ? "default" : "outline"}
            className="flex-1"
            onClick={() => { setIsOtpSent(false); setIsLogin(true) }}
          >
            Login
          </Button>

          <Button
            variant={!isLogin ? "default" : "outline"}
            className="flex-1"
            onClick={() => { setIsOtpSent(false); setIsLogin(false) }}
          >
            Sign Up
          </Button>
        </div>

      </div>

      {/* Registration Form */}
      {!isLogin && <form onSubmit={(e: any) => getOTP(e)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.name}</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name" required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t.email}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-10" required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>{t.role}</Label>
          <RadioGroup value={role} onValueChange={(value: any) => setRole(value as typeof role)}>
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

        <Button type="submit" className="w-full" disabled={isLoading} onClick={getOTP}>
          {isLoading ? 'Loading...' : t.login}
        </Button>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>{t.privacy}</span>
        </div>
      </form>}

      {/* Login */}
      {isLogin && <div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.email}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-10" required
            />
          </div>
        </div>

        {/* Get OTP Button */}
        <div className="flex w-full">
          <Button className="ml-auto mt-4" onClick={(e: any) => getOTP(e)} disabled={isLoading || isOtpSent}>
            Get OTP
          </Button>
        </div>
      </div>}

      {/* OTP input */}
      {isOtpSent && (
        <div className="mt-4 space-y-3">
          <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]$/.test(val) || val === "") {
                    const newOtp = otp.split("");
                    newOtp[index] = val;
                    setOtp(newOtp.join(""))

                    // Move focus to next box
                    if (val !== "" && index < 5) {
                      document.getElementById(`otp-${index + 1}`)?.focus();
                    }
                    if (index === 5 && newOtp.join("").length == 6) {
                      validateOTP(newOtp.join(""));
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Move focus back on backspace
                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                    document.getElementById(`otp-${index - 1}`)?.focus();
                  }
                }}
                className="w-12 h-12 text-center text-lg font-bold border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}