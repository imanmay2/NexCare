import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
    User,
    Bell,
    Clock,
    Shield,
    Languages,
    Save,
    Upload,
    Moon,
    Sun,
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Stethoscope,
    HeartPulse,
    Activity,
    Video,
    Headphones,
    Users,
    Award,
    BookOpen,
    Settings as SettingsIcon,
    Key,
    Fingerprint,
    Smartphone,
    LogOut,
    Hospital
} from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Globe2, ChevronsUpDown, Search, Check, X } from "lucide-react";
import axios from 'axios';
import { useError } from './ui/Toast';
import { INDIAN_LANGUAGES, SPECIALIZATIONS } from '../utils/utils';

interface DoctorSettingsProps {
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        language: 'en' | 'hi' | 'pa';
        profile_url?: string;
    };

    setUser?: any;

    data?: {
        d_id: string;
        name: string;
        domain: string;
        availability: string;
        experience: number;
        consultation_fee: number;
        languages: string;
        hospital: string;
    };
    setData?: any
}

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export function DoctorSettings({ user, setUser, data, setData }: DoctorSettingsProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { showToast } = useError();

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: user?.name,
        email: user?.email,
        specialization: data?.domain || '',
        hospital: data?.hospital || '',
        experience: data?.experience || 0,
        consultationFee: data?.consultation_fee || 0,
        currency: 'INR',
        languages: data?.languages ? data.languages.split(',') : []
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
        {
            id: 'appointments',
            title: 'New Appointments',
            description: 'Get notified when a patient books a new appointment',
            enabled: true
        },
        {
            id: 'reminders',
            title: 'Appointment Reminders',
            description: 'Receive reminders 1 hour before scheduled consultations',
            enabled: true
        },
        {
            id: 'messages',
            title: 'Patient Messages',
            description: 'Notifications for new messages from patients',
            enabled: true
        },
        {
            id: 'reports',
            title: 'Daily Reports',
            description: 'Receive daily summary of consultations and activities',
            enabled: false
        },
        {
            id: 'emergency',
            title: 'Emergency Alerts',
            description: 'Immediate notifications for emergency consultations',
            enabled: true
        }
    ]);


    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        biometricLogin: false,
        sessionTimeout: '30',
        loginAlerts: true,
        trustedDevices: ['iPhone 13', 'MacBook Pro']
    });

    // Language preferences
    const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>(user?.language || 'en');

    const translations = {
        en: {
            profile: "Profile",
            notifications: "Notifications",
            availability: "Availability",
            security: "Security",
            preferences: "Preferences",
            personalInfo: "Personal Information",
            professionalInfo: "Professional Information",
            notificationPreferences: "Notification Preferences",
            workingHours: "Working Hours",
            securitySettings: "Security Settings",
            languagePreferences: "Language & Theme",
            saveChanges: "Save Changes",
            saving: "Saving...",
            changesSaved: "Changes saved successfully!",
            uploadPhoto: "Upload Photo",
            removePhoto: "Remove",
            fullName: "Full Name",
            emailAddress: "Email Address",
            phoneNumber: "Phone Number",
            specialization: "Specialization",
            hospital: "Hospital/Clinic",
            qualifications: "Qualifications",
            experience: "Experience",
            licenseNumber: "Medical License Number",
            bio: "Professional Bio",
            consultationFee: "Consultation Fee",
            currency: "Currency",
            enable: "Enable",
            disable: "Disable",
            day: "Day",
            startTime: "Start Time",
            endTime: "End Time",
            addSlot: "Add Slot",
            removeSlot: "Remove",
            twoFactorAuth: "Two-Factor Authentication",
            biometricLogin: "Biometric Login",
            sessionTimeout: "Session Timeout (minutes)",
            loginAlerts: "Login Alerts",
            trustedDevices: "Trusted Devices",
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            changePassword: "Change Password",
            language: "Language",
            theme: "Theme",
            light: "Light",
            dark: "Dark",
            system: "System",
            english: "English",
            hindi: "हिंदी",
            punjabi: "ਪੰਜਾਬੀ"
        },
        hi: {
            profile: "प्रोफाइल",
            notifications: "सूचनाएं",
            availability: "उपलब्धता",
            security: "सुरक्षा",
            preferences: "प्राथमिकताएं",
            personalInfo: "व्यक्तिगत जानकारी",
            professionalInfo: "व्यावसायिक जानकारी",
            notificationPreferences: "सूचना प्राथमिकताएं",
            workingHours: "कार्य घंटे",
            securitySettings: "सुरक्षा सेटिंग्स",
            languagePreferences: "भाषा और थीम",
            saveChanges: "बदलाव सहेजें",
            saving: "सहेजा जा रहा...",
            changesSaved: "बदलाव सफलतापूर्वक सहेजे गए!",
            uploadPhoto: "फोटो अपलोड करें",
            removePhoto: "हटाएं",
            fullName: "पूरा नाम",
            emailAddress: "ईमेल पता",
            phoneNumber: "फोन नंबर",
            specialization: "विशेषज्ञता",
            hospital: "अस्पताल/क्लिनिक",
            qualifications: "योग्यताएं",
            experience: "अनुभव",
            licenseNumber: "मेडिकल लाइसेंस नंबर",
            bio: "पेशेवर जीवनी",
            consultationFee: "परामर्श शुल्क",
            currency: "मुद्रा",
            enable: "सक्षम करें",
            disable: "अक्षम करें",
            day: "दिन",
            startTime: "प्रारंभ समय",
            endTime: "समाप्ति समय",
            addSlot: "स्लॉट जोड़ें",
            removeSlot: "हटाएं",
            twoFactorAuth: "दो-चरणीय प्रमाणीकरण",
            biometricLogin: "बायोमेट्रिक लॉगिन",
            sessionTimeout: "सत्र समय सीमा (मिनट)",
            loginAlerts: "लॉगिन अलर्ट",
            trustedDevices: "विश्वसनीय डिवाइस",
            currentPassword: "वर्तमान पासवर्ड",
            newPassword: "नया पासवर्ड",
            confirmPassword: "पासवर्ड की पुष्टि करें",
            changePassword: "पासवर्ड बदलें",
            language: "भाषा",
            theme: "थीम",
            light: "लाइट",
            dark: "डार्क",
            system: "सिस्टम",
            english: "English",
            hindi: "हिंदी",
            punjabi: "ਪੰਜਾਬੀ"
        },
        pa: {
            profile: "ਪ੍ਰੋਫਾਈਲ",
            notifications: "ਸੂਚਨਾਵਾਂ",
            availability: "ਉਪਲਬਧਤਾ",
            security: "ਸੁਰੱਖਿਆ",
            preferences: "ਤਰਜੀਹਾਂ",
            personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
            professionalInfo: "ਪੇਸ਼ੇਵਰ ਜਾਣਕਾਰੀ",
            notificationPreferences: "ਸੂਚਨਾ ਤਰਜੀਹਾਂ",
            workingHours: "ਕੰਮ ਦੇ ਘੰਟੇ",
            securitySettings: "ਸੁਰੱਖਿਆ ਸੈਟਿੰਗਾਂ",
            languagePreferences: "ਭਾਸ਼ਾ ਅਤੇ ਥੀਮ",
            saveChanges: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ",
            saving: "ਸੁਰੱਖਿਅਤ ਹੋ ਰਿਹਾ ਹੈ...",
            changesSaved: "ਤਬਦੀਲੀਆਂ ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤੀਆਂ!",
            uploadPhoto: "ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
            removePhoto: "ਹਟਾਓ",
            fullName: "ਪੂਰਾ ਨਾਮ",
            emailAddress: "ਈਮੇਲ ਪਤਾ",
            phoneNumber: "ਫ਼ੋਨ ਨੰਬਰ",
            specialization: "ਸਪੈਸ਼ਲਾਈਜ਼ੇਸ਼ਨ",
            hospital: "ਹਸਪਤਾਲ/ਕਲੀਨਿਕ",
            qualifications: "ਯੋਗਤਾਵਾਂ",
            experience: "ਤਜਰਬਾ",
            licenseNumber: "ਮੈਡੀਕਲ ਲਾਇਸੈਂਸ ਨੰਬਰ",
            bio: "ਪੇਸ਼ੇਵਰ ਜੀਵਨੀ",
            consultationFee: "ਸਲਾਹ ਫੀਸ",
            currency: "ਮੁਦਰਾ",
            enable: "ਯੋਗ ਕਰੋ",
            disable: "ਅਯੋਗ ਕਰੋ",
            day: "ਦਿਨ",
            startTime: "ਸ਼ੁਰੂ ਸਮਾਂ",
            endTime: "ਖਤਮ ਸਮਾਂ",
            addSlot: "ਸਲਾਟ ਜੋੜੋ",
            removeSlot: "ਹਟਾਓ",
            twoFactorAuth: "ਦੋ-ਪੜਾਵੀ ਪ੍ਰਮਾਣੀਕਰਣ",
            biometricLogin: "ਬਾਇਓਮੈਟ੍ਰਿਕ ਲੌਗਇਨ",
            sessionTimeout: "ਸੈਸ਼ਨ ਟਾਈਮਆਉਟ (ਮਿੰਟ)",
            loginAlerts: "ਲੌਗਇਨ ਅਲਰਟ",
            trustedDevices: "ਭਰੋਸੇਯੋਗ ਡੀਵਾਈਸਾਂ",
            currentPassword: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ",
            newPassword: "ਨਵਾਂ ਪਾਸਵਰਡ",
            confirmPassword: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
            changePassword: "ਪਾਸਵਰਡ ਬਦਲੋ",
            language: "ਭਾਸ਼ਾ",
            theme: "ਥੀਮ",
            light: "ਲਾਈਟ",
            dark: "ਡਾਰਕ",
            system: "ਸਿਸਟਮ",
            english: "English",
            hindi: "हिंदी",
            punjabi: "ਪੰਜਾਬੀ"
        }
    };

    const t = translations[language];

    const handleSave = async () => {
        setIsSaving(true);

        //Save
        if (profileForm.experience && profileForm.consultationFee && profileForm.languages.length > 0) {
            try {
                const res = await axios.put('http://localhost:8090/doctor/updateProfileData', {
                    d_id: user?.id,
                    name: profileForm.name,
                    consultation_fee: profileForm.consultationFee,
                    languages: profileForm.languages.join(','),
                    experience: profileForm.experience,
                    domain: profileForm.specialization,
                    hospital: profileForm.hospital
                }, { withCredentials: true })
                if (res.status === 200) {
                    setShowSuccessAlert(true);
                    setIsSaving(false);
                    setData({
                        ...data,
                        d_id: user?.id,
                        name: profileForm.name,
                        consultation_fee: profileForm.consultationFee,
                        languages: profileForm.languages.join(','),
                        experience: profileForm.experience,
                        domain: profileForm.specialization,
                        hospital: profileForm.hospital
                    })
                    setUser({ ...user, name: profileForm.name })
                    // Hide success alert after 3 seconds
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                    }, 3000);
                }
            } catch (err) {
                showToast("An error occurred while saving changes. Please try again.", false);
            }

        } else {
            setIsSaving(false);
            showToast("Please fill the details properly", false);
            return
        }
    };

    const toggleNotification = (id: string) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    const uploadPhoto = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (100KB = 100 * 1024 bytes)
        if (file.size > 100 * 1024) {
            alert("File size exceeds 100KB. Please select a smaller file.");
            return;
        }

        setPreview(URL.createObjectURL(file));


        const formData = new FormData();
        try {
            formData.append("image", file);
        } catch (err) {
            console.error(err);
        }

        axios.post(
            "http://localhost:8090/doctor/uploadProfilePic",
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        ).then((res) => {
            if (res.status === 200)
                showToast("Sucessfully uploaded", true);

        }).catch((_) => {
            showToast("Error Encountered", false);
        })

    };


    const removePhoto = async () => {
        if ((fileInputRef.current!.value != "" && fileInputRef.current!.value != null && fileInputRef.current!.value != undefined) || user?.profile_url) {
            const res = await axios.delete("http://localhost:8090/doctor/deleteProfilePic", { withCredentials: true })
            const data = await res.data;

            if (res.status === 200) {
                setPreview(null);
                setUser({ ...user, profile_url: "" })
                fileInputRef.current!.value = ""
            }
            showToast(data.Message, data.success)
        }
    }

    return (
        <div className="space-y-6">
            <CardHeader className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            <SettingsIcon className="h-5 w-5 inline-block mr-2" />
                            {t.profile}
                        </CardTitle>
                        <CardDescription>
                            Manage your account settings and preferences
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
                                {t.saving}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                {t.saveChanges}
                            </>
                        )}
                    </Button>
                </div>

                {showSuccessAlert && (
                    <Alert className="mt-4 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {t.changesSaved}
                        </AlertDescription>
                    </Alert>
                )}
            </CardHeader>

            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="profile" className={`${activeTab === 'profile'
                            ? 'bg-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}>
                            <User className="h-4 w-4 mr-2" />
                            {t.profile}
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className={`${activeTab === 'notifications'
                            ? 'bg-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}>
                            <Bell className="h-4 w-4 mr-2" />
                            {t.notifications}
                        </TabsTrigger>
                        <TabsTrigger value="security" className={`${activeTab === 'security'
                            ? 'bg-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}>
                            <Shield className="h-4 w-4 mr-2" />
                            {t.security}
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        {/* Profile Photo */}
                        <Card className="border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-6">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={preview || user?.profile_url} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                                            {user?.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-2">
                                        <div className="flex space-x-2">
                                            {/* Upload photo button */}
                                            <Button variant="outline" size="sm" onClick={uploadPhoto}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                {t.uploadPhoto}
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*" // Only allow images
                                                className="hidden"
                                            />
                                            {/* Remove photo button */}
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={removePhoto}>
                                                {t.removePhoto}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            JPG, PNG. Max size 100KB.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{t.personalInfo}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">{t.fullName}</Label>
                                    <Input
                                        id="fullName"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2 pointer-events-none text-gray-500">
                                    <Label htmlFor="email">{t.emailAddress}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Information */}
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{t.professionalInfo}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Specialization</Label>
                                        <Select
                                            value={profileForm.specialization}
                                            onValueChange={(val: string) => setProfileForm({ ...profileForm, specialization: val })}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200">
                                                <SelectValue placeholder="Select Specialization" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPECIALIZATIONS.map((spec) => (
                                                    <SelectItem key={spec.value} value={spec.value}>
                                                        {spec.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Years of Experience</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g., 12"
                                            value={profileForm.experience}
                                            onChange={(e) => setProfileForm({ ...profileForm, experience: parseInt(e.target.value) || 0 })}
                                            className="bg-white border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Consultation Fee (INR)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            value={profileForm.consultationFee}
                                            onChange={(e) => setProfileForm({ ...profileForm, consultationFee: parseInt(e.target.value) || 0 })}
                                            className="pl-8 bg-white border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Hospital/Clinic</Label>
                                    <Input
                                        placeholder="e.g., Nabha Civil Hospital"
                                        value={profileForm.hospital}
                                        onChange={(e) => setProfileForm({ ...profileForm, hospital: e.target.value })}
                                        className="bg-white border-gray-200"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-black font-bold tracking-widest text-slate-500">
                                        Fluent Languages
                                    </Label>

                                    {/* Selected Languages Badges */}
                                    <div className="flex flex-wrap gap-3 mt-4 min-w-0">
                                        {profileForm.languages?.map((langValue: string) => {
                                            const langLabel = INDIAN_LANGUAGES.find((l) => l.value === langValue)?.label || langValue;
                                            return (
                                                <div
                                                    key={langValue}
                                                    className="flex text-black px-4 py-2 rounded-full border-2 border-slate-900 items-center justify-center"
                                                >
                                                    <span className="text-sm truncate max-w-[140px]">{langLabel}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = profileForm.languages.filter((l: string) => l !== langValue);
                                                            setProfileForm({ ...profileForm, languages: updated });
                                                        }}
                                                        className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                                                    >
                                                        <X className="h-4 w-4 ml-2" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Language Selector Popover */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                className="w-full h-12 justify-between !rounded-none border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] data-[state=open]:shadow-none data-[state=open]:translate-x-[1px] data-[state=open]:translate-y-[1px] transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Globe2 className="h-4 w-4 text-blue-600" />
                                                    <span className="font-bold">
                                                        {profileForm.languages?.length > 0 ? `${profileForm.languages.length} Selected` : "Select Languages..."}
                                                    </span>
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            side="bottom"
                                            align="start"
                                            sideOffset={8}
                                            className="z-[9999] w-full p-0 !rounded-none border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                                        >
                                            <Command className="!rounded-none bg-white">
                                                <div className="flex items-center border-b-2 border-slate-900 px-3 bg-slate-50">
                                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                    <CommandInput
                                                        placeholder="Search languages..."
                                                        className="h-11 font-bold !border-none !ring-0"
                                                    />
                                                </div>
                                                <div className="max-h-[70vh] overflow-auto">
                                                    <CommandList>
                                                        <CommandEmpty className="py-6 text-center text-xs font-black uppercase text-slate-400">
                                                            No results found.
                                                        </CommandEmpty>
                                                        <CommandGroup className="p-2">
                                                            {INDIAN_LANGUAGES.map((lang) => {
                                                                const isSelected = profileForm.languages?.includes(lang.value);
                                                                return (
                                                                    <CommandItem
                                                                        key={lang.value}
                                                                        onSelect={() => {
                                                                            const updated = isSelected
                                                                                ? profileForm.languages.filter((l: string) => l !== lang.value)
                                                                                : [...(profileForm.languages || []), lang.value];
                                                                            setProfileForm({ ...profileForm, languages: updated });
                                                                        }}
                                                                        className={`
                                                                        flex items-center justify-between py-3 mb-1 cursor-pointer !rounded-none
                                                                        ${isSelected ? "!bg-blue-600 !text-white" : "hover:!bg-slate-100"}
                                                                        `}
                                                                    >
                                                                        <span className="font-black uppercase tracking-tight text-xs">
                                                                            {lang.label}
                                                                        </span>
                                                                        <div className={`
                                                                            h-5 w-5 border-2 border-slate-900 flex items-center justify-center
                                                                            ${isSelected ? "bg-white" : "bg-transparent"}
                                                                            `}>
                                                                            {isSelected && <Check className="h-3 w-3 text-blue-600 stroke-[4px]" />}
                                                                        </div>
                                                                    </CommandItem>
                                                                );
                                                            })}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </div>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card className="border border-gray-200 opacity-60 pointer-events-none relative">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">
                                        {t.notificationPreferences}
                                    </CardTitle>

                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                        Coming Soon
                                    </span>
                                </div>

                                <CardDescription>
                                    Choose how you want to receive notifications
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {notificationSettings.map((setting) => (
                                    <div
                                        key={setting.id}
                                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium text-gray-500">
                                                {setting.title}
                                            </Label>
                                            <p className="text-sm text-gray-400">
                                                {setting.description}
                                            </p>
                                        </div>

                                        <Switch
                                            checked={false}
                                            disabled
                                            className="opacity-50 cursor-not-allowed"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <div className="space-y-6">
                            {/* Security Settings */}
                            <Card className="border border-gray-200 opacity-60 pointer-events-none relative">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold">
                                            {t.securitySettings}
                                        </CardTitle>

                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                            Coming Soon
                                        </span>
                                    </div>

                                    <CardDescription>
                                        Set your own security preferences to protect your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium text-gray-500">{t.twoFactorAuth}</Label>
                                            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.twoFactorAuth}
                                            onCheckedChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                                            style={{ backgroundColor: securitySettings.twoFactorAuth ? '#2563eb' : '#e5e7eb' }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium text-gray-500">{t.biometricLogin}</Label>
                                            <p className="text-sm text-gray-400">Use fingerprint or face recognition to log in</p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.biometricLogin}
                                            onCheckedChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, biometricLogin: checked })}
                                            style={{ backgroundColor: securitySettings.biometricLogin ? '#2563eb' : '#e5e7eb' }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium text-gray-500">{t.sessionTimeout}</Label>
                                            <p className="text-sm text-gray-400">Automatically log out after inactivity</p>
                                        </div>
                                        <select
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                                            className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-400"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium text-gray-500">{t.loginAlerts}</Label>
                                            <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.loginAlerts}
                                            onCheckedChange={(checked: boolean) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
                                            style={{ backgroundColor: securitySettings.loginAlerts ? '#2564eb78' : '#e5e7eb' }}
                                        />
                                    </div>

                                    <div className="py-3">
                                        <Label className="text-base font-medium block mb-3 text-gray-500">{t.trustedDevices}</Label>
                                        <div className="space-y-2">
                                            {securitySettings.trustedDevices.map((device, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <Smartphone className="h-5 w-5 text-gray-500" />
                                                        <span className="text-sm text-gray-400">{device}</span>
                                                    </div>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-gray-400">
                                                        Active
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Change Password */}
                            {/* <Card className="border border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{t.changePassword}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">{t.currentPassword}</Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            className="bg-white border-gray-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">{t.newPassword}</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            className="bg-white border-gray-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            className="bg-white border-gray-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <Button variant="outline" className="mt-2">
                                        <Key className="h-4 w-4 mr-2" />
                                        {t.changePassword}
                                    </Button>
                                </CardContent>
                            </Card> */}
                        </div>
                    </TabsContent>


                </Tabs>
            </CardContent>
        </div>
    );
}

export default DoctorSettings;