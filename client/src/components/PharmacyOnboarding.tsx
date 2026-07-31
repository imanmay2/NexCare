// PharmacyOnboarding.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Heart,
    Wifi,
    Search,
    Store,
    Clock,
    Navigation,
    Loader2,
    CheckCircle2,
    XCircle,
    PlusCircle,
} from "lucide-react";
import { useError } from "./ui/Toast";

interface PharmacyOnboardingProps {
    onComplete: (data: any) => void;
    language: "en" | "hi" | "pa";
    onLogout: () => void;
    isOnline: boolean;
    setLanguage: (lang: "en" | "hi" | "pa") => void;
    branchId?: string;
}

interface OnboardingForm {
    // Pharmacy fields
    pharmacyName: string;
    pharmacyPhone: string;
    pharmacyEmail: string;
    pharmacyLicenseNumber: string;
    pharmacyGstNumber: string;
    ownerId: string;

    // Branch fields
    branchName: string;
    branchAddress: string;
    branchCity: string;
    branchState: string;
    branchPincode: string;
    branchPhone: string;
    branchEmail: string;
    branchLicenseNo: string;
    openingTime: string;
    closingTime: string;
    latitude: number | null;
    longitude: number | null;
}

type PharmacyType = "new" | "existing";

export const PharmacyOnboarding = ({
    onComplete,
    language,
    onLogout,
    isOnline,
    setLanguage,
    branchId
}: PharmacyOnboardingProps) => {
    const { register, setValue, watch, handleSubmit, reset } = useForm<OnboardingForm>({
        defaultValues: {
            openingTime: "09:00",
            closingTime: "21:00",
            latitude: null,
            longitude: null,
        }
    });
    const { showToast } = useError();

    const [pharmacyType, setPharmacyType] = useState<PharmacyType>("new");
    const [searchPharmacyId, setSearchPharmacyId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isPharmacyFound, setIsPharmacyFound] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    const watchLatitude = watch("latitude");
    const watchLongitude = watch("longitude");

    const handlePharmacyTypeChange = (type: PharmacyType) => {
        setPharmacyType(type);
        setIsPharmacyFound(false);
        setSearchPharmacyId("");
        // Reset pharmacy fields when switching to new
        if (type === "new") {
            setValue("pharmacyName", "");
            setValue("pharmacyPhone", "");
            setValue("pharmacyEmail", "");
            setValue("pharmacyLicenseNumber", "");
            setValue("pharmacyGstNumber", "");
            setValue("ownerId", "");
        }
    };

    const handleSearchPharmacy = async () => {
        if (!searchPharmacyId.trim()) {
            showToast("Please enter a pharmacy ID to search", false);
            return;
        }

        setIsSearching(true);
        try {
            // Simulated API call - replace with actual API endpoint
            // const response = await fetch(`/api/pharmacies/${searchPharmacyId}`);
            // const data = await response.json();

            // Mock data for demonstration - REMOVE THIS IN PRODUCTION
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate finding a pharmacy
            const mockPharmacyData = {
                name: "NexCare Pharmacy Main",
                phone: "9876543210",
                email: "main@nexcare.com",
                license_number: "PHARM-2024-001",
                gst_number: "22AAAAA0000A1Z5",
                owner_id: "OWN-001",
            };

            // Check if pharmacy exists (mock logic)
            if (searchPharmacyId === "PH001" || searchPharmacyId === "1") {
                setValue("pharmacyName", mockPharmacyData.name);
                setValue("pharmacyPhone", mockPharmacyData.phone);
                setValue("pharmacyEmail", mockPharmacyData.email);
                setValue("pharmacyLicenseNumber", mockPharmacyData.license_number);
                setValue("pharmacyGstNumber", mockPharmacyData.gst_number);
                setValue("ownerId", mockPharmacyData.owner_id);
                setIsPharmacyFound(true);
                showToast("Pharmacy found! Details auto-filled.", true);
            } else {
                setIsPharmacyFound(false);
                showToast("No pharmacy found with this ID. Please check and try again.", false);
            }
        } catch (error) {
            showToast("Error searching for pharmacy. Please try again.", false);
            setIsPharmacyFound(false);
        } finally {
            setIsSearching(false);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            showToast("Geolocation is not supported by your browser", false);
            return;
        }

        setIsDetectingLocation(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("latitude", position.coords.latitude);
                setValue("longitude", position.coords.longitude);
                setIsDetectingLocation(false);
                showToast("Location detected successfully!", true);
            },
            (error) => {
                setIsDetectingLocation(false);
                let errorMessage = "Unable to detect location. ";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "Location permission was denied. Please allow location access in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "Location information is unavailable. Try connecting to WiFi or opening Google Maps first.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "Location request timed out. Please try again.";
                        break;
                }
                setLocationError(errorMessage);
                showToast(errorMessage, false);
            },
            {
                enableHighAccuracy: false, // Changed to false - WiFi-based is faster on MacBooks
                timeout: 15000, // Increased to 15 seconds
                maximumAge: 60000 // Allow cached position up to 1 minute old
            }
        );
    };

    const onSubmit = (data: OnboardingForm) => {
        // Pharmacy validations (only if new pharmacy)
        if (pharmacyType === "new") {
            if (!data.pharmacyName?.trim()) {
                showToast("Please enter the pharmacy name", false);
                return;
            }
            if (!data.pharmacyPhone?.trim() || data.pharmacyPhone.length < 10) {
                showToast("Please enter a valid pharmacy phone number", false);
                return;
            }
            if (!data.pharmacyEmail?.trim() || !data.pharmacyEmail.includes("@")) {
                showToast("Please enter a valid pharmacy email address", false);
                return;
            }
            if (!data.pharmacyLicenseNumber?.trim()) {
                showToast("Please enter the pharmacy license number", false);
                return;
            }
            if (!data.ownerId?.trim()) {
                showToast("Please enter the owner ID", false);
                return;
            }
        } else {
            if (!isPharmacyFound) {
                showToast("Please search and select an existing pharmacy first", false);
                return;
            }
        }

        // Branch validations
        if (!data.branchName?.trim()) {
            showToast("Please enter the branch name", false);
            return;
        }
        if (!data.branchAddress?.trim()) {
            showToast("Please enter the branch address", false);
            return;
        }
        if (!data.branchCity?.trim()) {
            showToast("Please enter the branch city", false);
            return;
        }
        if (!data.branchState?.trim()) {
            showToast("Please enter the branch state", false);
            return;
        }
        if (!data.branchPincode?.trim() || data.branchPincode.length !== 6) {
            showToast("Please enter a valid 6-digit pincode", false);
            return;
        }
        if (!data.branchPhone?.trim() || data.branchPhone.length < 10) {
            showToast("Please enter a valid branch phone number", false);
            return;
        }
        if (!data.branchEmail?.trim() || !data.branchEmail.includes("@")) {
            showToast("Please enter a valid branch email address", false);
            return;
        }
        if (!data.branchLicenseNo?.trim()) {
            showToast("Please enter the branch license number", false);
            return;
        }
        if (!data.openingTime) {
            showToast("Please set the opening time", false);
            return;
        }
        if (!data.closingTime) {
            showToast("Please set the closing time", false);
            return;
        }
        if (data.latitude === null || data.longitude === null) {
            showToast("Please detect your location before submitting", false);
            return;
        }

        // Prepare data for submission
        const formData = {
            pharmacyType,
            pharmacyId: pharmacyType === "existing" ? searchPharmacyId : null,
            pharmacy: {
                name: data.pharmacyName,
                phone: data.pharmacyPhone,
                email: data.pharmacyEmail,
                license_number: data.pharmacyLicenseNumber,
                gst_number: data.pharmacyGstNumber || null,
                owner_id: data.ownerId,
            },
            branch: {
                branch_name: data.branchName,
                address: data.branchAddress,
                city: data.branchCity,
                state: data.branchState,
                pin_code: data.branchPincode,
                phone: data.branchPhone,
                email: data.branchEmail,
                license_no: data.branchLicenseNo,
                opening_time: data.openingTime,
                closing_time: data.closingTime,
                latitude: data.latitude,
                longitude: data.longitude,
            }
        };

        onComplete(formData);
    };

    const translations = {
        en: {
            title: "NexCare Telemedicine Platform",
            subtitle: "Connecting rural communities to quality healthcare",
            welcome: "Pharmacy Onboarding",
            description: "Register your pharmacy and branch to start serving patients",
            pharmacyType: "Pharmacy Type",
            newPharmacy: "New Pharmacy",
            existingPharmacy: "Existing Pharmacy",
            searchPharmacy: "Search Pharmacy by ID",
            searchPlaceholder: "Enter pharmacy ID (e.g., PH001)",
            search: "Search",
            searching: "Searching...",
            pharmacyFound: "Pharmacy found! Details auto-filled.",
            pharmacyNotFound: "Pharmacy not found",
            pharmacyInfo: "Pharmacy Details",
            branchInfo: "Branch Information",
            contactInfo: "Contact Information",
            operationalInfo: "Operational Settings",
            locationInfo: "Location Details",
            pharmacyName: "Pharmacy Name",
            pharmacyNamePlaceholder: "e.g., NexCare Pharmacy",
            pharmacyPhone: "Pharmacy Phone",
            pharmacyPhonePlaceholder: "9876543210",
            pharmacyEmail: "Pharmacy Email",
            pharmacyEmailPlaceholder: "pharmacy@example.com",
            pharmacyLicenseNumber: "Pharmacy License Number",
            pharmacyLicensePlaceholder: "e.g., PHARM-2024-001",
            pharmacyGstNumber: "GST Number (Optional)",
            pharmacyGstPlaceholder: "e.g., 22AAAAA0000A1Z5",
            ownerId: "Owner ID",
            ownerIdPlaceholder: "e.g., OWN-001",
            branchName: "Branch Name",
            branchNamePlaceholder: "e.g., Main Branch, City Center",
            branchAddress: "Branch Address",
            branchAddressPlaceholder: "Street address, building name",
            branchCity: "City",
            branchCityPlaceholder: "e.g., Nabha",
            branchState: "State",
            branchStatePlaceholder: "e.g., Punjab",
            branchPincode: "Pincode",
            branchPincodePlaceholder: "147201",
            branchPhone: "Branch Phone",
            branchPhonePlaceholder: "9876543211",
            branchEmail: "Branch Email",
            branchEmailPlaceholder: "branch@example.com",
            branchLicenseNo: "Branch License Number",
            branchLicensePlaceholder: "e.g., BR-PHARM-2024-001",
            openingTime: "Opening Time",
            closingTime: "Closing Time",
            detectLocation: "Detect Location",
            detectingLocation: "Detecting...",
            locationDetected: "Location detected!",
            latitude: "Latitude",
            longitude: "Longitude",
            saveAndContinue: "Complete Onboarding",
            offline: "Offline Mode Active",
            online: "Connected",
            optional: "(Optional)",
            newPharmacyDesc: "Register a new pharmacy with your first branch",
            existingPharmacyDesc: "Add a new branch to an existing pharmacy",
        },
        hi: {
            title: "नाभा टेलीमेडिसिन प्लेटफॉर्म",
            subtitle: "ग्रामीण समुदायों को गुणवत्तापूर्ण स्वास्थ्य सेवा से जोड़ना",
            welcome: "फार्मेसी ऑनबोर्डिंग",
            description: "अपनी फार्मेसी और शाखा पंजीकृत करें",
            pharmacyType: "फार्मेसी प्रकार",
            newPharmacy: "नई फार्मेसी",
            existingPharmacy: "मौजूदा फार्मेसी",
            searchPharmacy: "आईडी द्वारा फार्मेसी खोजें",
            searchPlaceholder: "फार्मेसी आईडी दर्ज करें (जैसे, PH001)",
            search: "खोजें",
            searching: "खोज रहे हैं...",
            pharmacyFound: "फार्मेसी मिली! विवरण ऑटो-भरें।",
            pharmacyNotFound: "फार्मेसी नहीं मिली",
            pharmacyInfo: "फार्मेसी विवरण",
            branchInfo: "शाखा जानकारी",
            contactInfo: "संपर्क जानकारी",
            operationalInfo: "परिचालन सेटिंग्स",
            locationInfo: "स्थान विवरण",
            pharmacyName: "फार्मेसी का नाम",
            pharmacyNamePlaceholder: "जैसे, नेक्सकेयर फार्मेसी",
            pharmacyPhone: "फार्मेसी फोन",
            pharmacyPhonePlaceholder: "9876543210",
            pharmacyEmail: "फार्मेसी ईमेल",
            pharmacyEmailPlaceholder: "pharmacy@example.com",
            pharmacyLicenseNumber: "फार्मेसी लाइसेंस नंबर",
            pharmacyLicensePlaceholder: "जैसे, PHARM-2024-001",
            pharmacyGstNumber: "जीएसटी नंबर (वैकल्पिक)",
            pharmacyGstPlaceholder: "जैसे, 22AAAAA0000A1Z5",
            ownerId: "मालिक आईडी",
            ownerIdPlaceholder: "जैसे, OWN-001",
            branchName: "शाखा का नाम",
            branchNamePlaceholder: "जैसे, मुख्य शाखा, सिटी सेंटर",
            branchAddress: "शाखा का पता",
            branchAddressPlaceholder: "सड़क पता, भवन का नाम",
            branchCity: "शहर",
            branchCityPlaceholder: "जैसे, नाभा",
            branchState: "राज्य",
            branchStatePlaceholder: "जैसे, पंजाब",
            branchPincode: "पिनकोड",
            branchPincodePlaceholder: "147201",
            branchPhone: "शाखा फोन",
            branchPhonePlaceholder: "9876543211",
            branchEmail: "शाखा ईमेल",
            branchEmailPlaceholder: "branch@example.com",
            branchLicenseNo: "शाखा लाइसेंस नंबर",
            branchLicensePlaceholder: "जैसे, BR-PHARM-2024-001",
            openingTime: "खुलने का समय",
            closingTime: "बंद होने का समय",
            detectLocation: "स्थान का पता लगाएं",
            detectingLocation: "पता लगा रहे हैं...",
            locationDetected: "स्थान का पता चला!",
            latitude: "अक्षांश",
            longitude: "देशांतर",
            saveAndContinue: "ऑनबोर्डिंग पूर्ण करें",
            offline: "ऑफलाइन मोड सक्रिय",
            online: "जुड़ा हुआ",
            optional: "(वैकल्पिक)",
            newPharmacyDesc: "अपनी पहली शाखा के साथ एक नई फार्मेसी पंजीकृत करें",
            existingPharmacyDesc: "मौजूदा फार्मेसी में एक नई शाखा जोड़ें",
        },
        pa: {
            title: "ਨਾਭਾ ਟੈਲੀਮੈਡਿਸਿਨ ਪਲੈਟਫਾਰਮ",
            subtitle: "ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਨੂੰ ਗੁਣਵੱਤਾ ਭਰਪੂਰ ਸਿਹਤ ਸੇਵਾ ਨਾਲ ਜੋੜਨਾ",
            welcome: "ਫਾਰਮੇਸੀ ਆਨਬੋਰਡਿੰਗ",
            description: "ਆਪਣੀ ਫਾਰਮੇਸੀ ਅਤੇ ਬ੍ਰਾਂਚ ਰਜਿਸਟਰ ਕਰੋ",
            pharmacyType: "ਫਾਰਮੇਸੀ ਕਿਸਮ",
            newPharmacy: "ਨਵੀਂ ਫਾਰਮੇਸੀ",
            existingPharmacy: "ਮੌਜੂਦਾ ਫਾਰਮੇਸੀ",
            searchPharmacy: "ਆਈਡੀ ਦੁਆਰਾ ਫਾਰਮੇਸੀ ਖੋਜੋ",
            searchPlaceholder: "ਫਾਰਮੇਸੀ ਆਈਡੀ ਦਰਜ ਕਰੋ (ਜਿਵੇਂ, PH001)",
            search: "ਖੋਜੋ",
            searching: "ਖੋਜ ਰਹੇ ਹਨ...",
            pharmacyFound: "ਫਾਰਮੇਸੀ ਮਿਲੀ! ਵੇਰਵੇ ਆਟੋ-ਭਰੋ।",
            pharmacyNotFound: "ਫਾਰਮੇਸੀ ਨਹੀਂ ਮਿਲੀ",
            pharmacyInfo: "ਫਾਰਮੇਸੀ ਵੇਰਵੇ",
            branchInfo: "ਬ੍ਰਾਂਚ ਜਾਣਕਾਰੀ",
            contactInfo: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
            operationalInfo: "ਆਪਰੇਸ਼ਨਲ ਸੈਟਿੰਗਜ਼",
            locationInfo: "ਸਥਾਨ ਵੇਰਵੇ",
            pharmacyName: "ਫਾਰਮੇਸੀ ਦਾ ਨਾਮ",
            pharmacyNamePlaceholder: "ਜਿਵੇਂ, ਨੇਕਸਕੇਅਰ ਫਾਰਮੇਸੀ",
            pharmacyPhone: "ਫਾਰਮੇਸੀ ਫ਼ੋਨ",
            pharmacyPhonePlaceholder: "9876543210",
            pharmacyEmail: "ਫਾਰਮੇਸੀ ਈਮੇਲ",
            pharmacyEmailPlaceholder: "pharmacy@example.com",
            pharmacyLicenseNumber: "ਫਾਰਮੇਸੀ ਲਾਇਸੈਂਸ ਨੰਬਰ",
            pharmacyLicensePlaceholder: "ਜਿਵੇਂ, PHARM-2024-001",
            pharmacyGstNumber: "ਜੀਐਸਟੀ ਨੰਬਰ (ਵਿਕਲਪਿਕ)",
            pharmacyGstPlaceholder: "ਜਿਵੇਂ, 22AAAAA0000A1Z5",
            ownerId: "ਮਾਲਕ ਆਈਡੀ",
            ownerIdPlaceholder: "ਜਿਵੇਂ, OWN-001",
            branchName: "ਬ੍ਰਾਂਚ ਦਾ ਨਾਮ",
            branchNamePlaceholder: "ਜਿਵੇਂ, ਮੁੱਖ ਬ੍ਰਾਂਚ, ਸਿਟੀ ਸੈਂਟਰ",
            branchAddress: "ਬ੍ਰਾਂਚ ਦਾ ਪਤਾ",
            branchAddressPlaceholder: "ਸੜਕ ਪਤਾ, ਇਮਾਰਤ ਦਾ ਨਾਮ",
            branchCity: "ਸ਼ਹਿਰ",
            branchCityPlaceholder: "ਜਿਵੇਂ, ਨਾਭਾ",
            branchState: "ਰਾਜ",
            branchStatePlaceholder: "ਜਿਵੇਂ, ਪੰਜਾਬ",
            branchPincode: "ਪਿੰਨਕੋਡ",
            branchPincodePlaceholder: "147201",
            branchPhone: "ਬ੍ਰਾਂਚ ਫ਼ੋਨ",
            branchPhonePlaceholder: "9876543211",
            branchEmail: "ਬ੍ਰਾਂਚ ਈਮੇਲ",
            branchEmailPlaceholder: "branch@example.com",
            branchLicenseNo: "ਬ੍ਰਾਂਚ ਲਾਇਸੈਂਸ ਨੰਬਰ",
            branchLicensePlaceholder: "ਜਿਵੇਂ, BR-PHARM-2024-001",
            openingTime: "ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ",
            closingTime: "ਬੰਦ ਹੋਣ ਦਾ ਸਮਾਂ",
            detectLocation: "ਸਥਾਨ ਦਾ ਪਤਾ ਲਗਾਓ",
            detectingLocation: "ਪਤਾ ਲਗਾ ਰਹੇ ਹਨ...",
            locationDetected: "ਸਥਾਨ ਦਾ ਪਤਾ ਲੱਗ ਗਿਆ!",
            latitude: "ਅਕਸ਼ਾਂਸ਼",
            longitude: "ਦੇਸ਼ਾਂਤਰ",
            saveAndContinue: "ਆਨਬੋਰਡਿੰਗ ਪੂਰੀ ਕਰੋ",
            offline: "ਔਫਲਾਈਨ ਮੋਡ ਸਰਗਰਮ",
            online: "ਜੁੜਿਆ ਹੋਇਆ",
            optional: "(ਵਿਕਲਪਿਕ)",
            newPharmacyDesc: "ਆਪਣੀ ਪਹਿਲੀ ਬ੍ਰਾਂਚ ਨਾਲ ਇੱਕ ਨਵੀਂ ਫਾਰਮੇਸੀ ਰਜਿਸਟਰ ਕਰੋ",
            existingPharmacyDesc: "ਮੌਜੂਦਾ ਫਾਰਮੇਸੀ ਵਿੱਚ ਇੱਕ ਨਵੀਂ ਬ੍ਰਾਂਚ ਸ਼ਾਮਲ ਕਰੋ",
        }
    };

    const t = translations[language];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {t.title}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {t.subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                            <div className="flex items-center space-x-2">
                                <Wifi
                                    className={`h-4 w-4 ${isOnline ? "text-green-500" : "text-red-500"}`}
                                />
                                <span className="text-sm text-gray-600">
                                    {isOnline ? t.online : t.offline}
                                </span>
                            </div>

                            {/* Language Selector */}
                            <div className="flex space-x-1">
                                {(["en", "hi", "pa"] as const).map((lang) => {
                                    const languageLabels = {
                                        en: "English",
                                        hi: "हिंदी",
                                        pa: "ਪੰਜਾਬੀ",
                                    };
                                    return (
                                        <Button
                                            key={lang}
                                            variant={language === lang ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                document.cookie = `language=${lang}; path=/; max-age=31536000`;
                                                setLanguage(lang);
                                            }}
                                            className="px-3 py-1"
                                        >
                                            {languageLabels[lang]}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="max-w-3xl w-full shadow-xl border-white/50 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-6 border-b text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 mx-auto">
                            <Store className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {t.welcome}
                        </CardTitle>
                        <CardDescription>
                            {t.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Pharmacy Type Selection */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {t.pharmacyType}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handlePharmacyTypeChange("new")}
                                        className={`p-4 border-2 border-slate-900 text-left transition-all ${pharmacyType === "new"
                                            ? "bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-x-[-2px] translate-y-[-2px]"
                                            : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <PlusCircle className={`h-6 w-6 mb-2 ${pharmacyType === "new" ? "text-white" : "text-blue-600"}`} />
                                                <h4 className="font-black text-sm uppercase tracking-wide">{t.newPharmacy}</h4>
                                                <p className={`text-xs mt-1 ${pharmacyType === "new" ? "text-blue-100" : "text-gray-500"}`}>
                                                    {t.newPharmacyDesc}
                                                </p>
                                            </div>
                                            <div className={`h-6 w-6 border-2 border-slate-900 flex items-center justify-center flex-shrink-0 ${pharmacyType === "new" ? "bg-white" : "bg-transparent"
                                                }`}>
                                                {pharmacyType === "new" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handlePharmacyTypeChange("existing")}
                                        className={`p-4 border-2 border-slate-900 text-left transition-all ${pharmacyType === "existing"
                                            ? "bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-x-[-2px] translate-y-[-2px]"
                                            : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Search className={`h-6 w-6 mb-2 ${pharmacyType === "existing" ? "text-white" : "text-blue-600"}`} />
                                                <h4 className="font-black text-sm uppercase tracking-wide">{t.existingPharmacy}</h4>
                                                <p className={`text-xs mt-1 ${pharmacyType === "existing" ? "text-blue-100" : "text-gray-500"}`}>
                                                    {t.existingPharmacyDesc}
                                                </p>
                                            </div>
                                            <div className={`h-6 w-6 border-2 border-slate-900 flex items-center justify-center flex-shrink-0 ${pharmacyType === "existing" ? "bg-white" : "bg-transparent"
                                                }`}>
                                                {pharmacyType === "existing" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            {/* Search Existing Pharmacy */}
                            {pharmacyType === "existing" && (
                                <section className="space-y-4">
                                    <div className="h-3"></div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                        <Search className="h-4 w-4" />
                                        {t.searchPharmacy}
                                    </h3>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <Input
                                                placeholder={t.searchPlaceholder}
                                                value={searchPharmacyId}
                                                onChange={(e) => setSearchPharmacyId(e.target.value)}
                                                className="!rounded-none border-2 border-slate-900"
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        {!isPharmacyFound ? (
                                            <Button
                                                type="button"
                                                onClick={handleSearchPharmacy}
                                                disabled={isSearching}
                                                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white !rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                            >
                                                {isSearching ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        {t.searching}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Search className="h-4 w-4" />
                                                        {t.search}
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setIsPharmacyFound(false);
                                                    setSearchPharmacyId("");
                                                }}
                                                className="gap-2 bg-red-600 hover:bg-red-700 text-white !rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    {isPharmacyFound && (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-600">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-bold text-green-800">{t.pharmacyFound}</span>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Pharmacy Details */}
                            {(pharmacyType === "new" || isPharmacyFound) && (
                                <section className="space-y-4">
                                    <div className="h-3"></div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        {t.pharmacyInfo}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.pharmacyName}</Label>
                                            <Input
                                                placeholder={t.pharmacyNamePlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("pharmacyName")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.ownerId}</Label>
                                            <Input
                                                placeholder={t.ownerIdPlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("ownerId")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.pharmacyPhone}</Label>
                                            <Input
                                                type="tel"
                                                placeholder={t.pharmacyPhonePlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("pharmacyPhone")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.pharmacyEmail}</Label>
                                            <Input
                                                type="email"
                                                placeholder={t.pharmacyEmailPlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("pharmacyEmail")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.pharmacyLicenseNumber}</Label>
                                            <Input
                                                placeholder={t.pharmacyLicensePlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("pharmacyLicenseNumber")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.pharmacyGstNumber} <span className="text-gray-400 font-normal text-sm">{t.optional}</span></Label>
                                            <Input
                                                placeholder={t.pharmacyGstPlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("pharmacyGstNumber")}
                                                disabled={isPharmacyFound}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Branch Information */}
                            <section className="space-y-4">
                                <div className="h-3"></div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <Store className="h-4 w-4" />
                                    {t.branchInfo}
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">{t.branchName}</Label>
                                        <Input
                                            placeholder={t.branchNamePlaceholder}
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("branchName")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">{t.branchAddress}</Label>
                                        <Input
                                            placeholder={t.branchAddressPlaceholder}
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("branchAddress")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.branchCity}</Label>
                                            <Input
                                                placeholder={t.branchCityPlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("branchCity")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.branchState}</Label>
                                            <Input
                                                placeholder={t.branchStatePlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("branchState")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.branchPincode}</Label>
                                            <Input
                                                type="number"
                                                placeholder={t.branchPincodePlaceholder}
                                                className="!rounded-none border-2 border-slate-900"
                                                {...register("branchPincode")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section className="space-y-4">
                                <div className="h-3"></div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {t.contactInfo}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">{t.branchPhone}</Label>
                                        <Input
                                            type="tel"
                                            placeholder={t.branchPhonePlaceholder}
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("branchPhone")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">{t.branchEmail}</Label>
                                        <Input
                                            type="email"
                                            placeholder={t.branchEmailPlaceholder}
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("branchEmail")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">{t.branchLicenseNo}</Label>
                                        <Input
                                            placeholder={t.branchLicensePlaceholder}
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("branchLicenseNo")}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Operational & Location Settings */}
                            <section className="space-y-4 mb-8">
                                <div className="h-3"></div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {t.operationalInfo}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-sm">{t.openingTime}</Label>
                                        <Input
                                            type="time"
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("openingTime")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-sm">{t.closingTime}</Label>
                                        <Input
                                            type="time"
                                            className="!rounded-none border-2 border-slate-900"
                                            {...register("closingTime")}
                                        />
                                    </div>
                                </div>

                                {/* Location Detection */}
                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {t.locationInfo}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.latitude}</Label>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="0.000000"
                                                className="!rounded-none border-2 border-slate-900 bg-gray-50"
                                                {...register("latitude")}
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">{t.longitude}</Label>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="0.000000"
                                                className="!rounded-none border-2 border-slate-900 bg-gray-50"
                                                {...register("longitude")}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={isDetectingLocation}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white !rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                        >
                                            {isDetectingLocation ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    {t.detectingLocation}
                                                </>
                                            ) : (
                                                <>
                                                    <Navigation className="h-4 w-4" />
                                                    {t.detectLocation}
                                                </>
                                            )}
                                        </Button>
                                        {watchLatitude !== null && watchLongitude !== null && (
                                            <div className="flex items-center gap-2 p-2 bg-green-50 border-2 border-green-600 flex-1">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                <span className="text-sm font-bold text-green-800">{t.locationDetected}</span>
                                            </div>
                                        )}
                                    </div>
                                    {locationError && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-600">
                                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            <span className="text-sm font-bold text-red-800">{locationError}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Submit Button */}
                            <div className="text-right pt-6 border-t">
                                <Button
                                    type="submit"
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white !rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                >
                                    {t.saveAndContinue}
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default PharmacyOnboarding;