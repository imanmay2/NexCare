import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Stethoscope, Globe2, Briefcase, IndianRupee, GraduationCap, ChevronRight, Heart, Wifi, ChevronsUpDown, Check, X, Search, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";

interface OnboardingProps {
    onComplete: (data: any) => void;
    language: "en" | "hi" | "pa";
    onLogout: () => void;
    isOnline: boolean;
    setLanguage: (lang: "en" | "hi" | "pa") => void;
}

interface OnboardingForm {
    languages: string[];
    experience: string;
    domain: string;
    fee: string;
}

export const DoctorOnboarding = ({ onComplete, language, onLogout, isOnline, setLanguage }: OnboardingProps) => {
    const { register, setValue, watch } = useForm<OnboardingForm>({
        defaultValues: {
            languages: [],
            experience: "",
            domain: "",
            fee: ""
        }
    });

    // const selectedLanguages = ["en", "hi"];
    const selectedLanguages = watch("languages");



    const toggleLanguage = (lang: string) => {
        const current = selectedLanguages;
        const next = current.includes(lang)
            ? current.filter(l => l !== lang)
            : [...current, lang];
        setValue("languages", next);
    };

    const handleSubmit = () => (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            domain: watch("domain"),
            experience: watch("experience"),
            fee: watch("fee"),
            languages: watch("languages")
        };
        onComplete(formData);
    }

    const translations = {
        en: {
            title: "NexCare Telemedicine Platform",
            subtitle:
                "Connecting rural communities to quality healthcare",
            loginPrompt: "Welcome to Healthcare Access",
            features: "Platform Features",
            offline: "Offline Mode Active",
            online: "Connected",
            stats: "Platform Statistics",
        },
        hi: {
            title: "नाभा टेलीमेडिसिन प्लेटफॉर्म",
            subtitle:
                "ग्रामीण समुदायों को गुणवत्तापूर्ण स्वास्थ्य सेवा से जोड़ना",
            loginPrompt: "स्वास्थ्य सेवा पहुंच में आपका स्वागत है",
            features: "प्लेटफॉर्म सुविधाएं",
            offline: "ऑफलाइन मोड सक्रिय",
            online: "जुड़ा हुआ",
            stats: "प्लेटफॉर्म आंकड़े",
        },
        pa: {
            title: "ਨਾਭਾ ਟੈਲੀਮੈਡਿਸਿਨ ਪਲੈਟਫਾਰਮ",
            subtitle:
                "ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਨੂੰ ਗੁਣਵੱਤਾ ਭਰਪੂਰ ਸਿਹਤ ਸੇਵਾ ਨਾਲ ਜੋੜਨਾ",
            loginPrompt: "ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
            features: "ਪਲੈਟਫਾਰਮ ਸੁਵਿਧਾਵਾਂ",
            offline: "ਔਫਲਾਈਨ ਮੋਡ ਸਰਗਰਮ",
            online: "ਜੁੜਿਆ ਹੋਇਆ",
            stats: "ਪਲੈਟਫਾਰਮ ਦੇ ਅੰਕੜੇ",
        },
    };

    const t = translations[language];

    const INDIAN_LANGUAGES = [
        // Major/Commonly Used
        { label: "English", value: "en" },
        { label: "Hindi", value: "hi" },
        { label: "Punjabi", value: "pa" },
        { label: "Bengali", value: "bn" },
        { label: "Marathi", value: "mr" },
        { label: "Telugu", value: "te" },
        { label: "Tamil", value: "ta" },
        { label: "Gujarati", value: "gu" },
        { label: "Urdu", value: "ur" },
        { label: "Kannada", value: "kn" },
        { label: "Odia", value: "or" },
        { label: "Malayalam", value: "ml" },
        // Official Scheduled Languages
        { label: "Assamese", value: "as" },
        { label: "Bodo", value: "brx" },
        { label: "Dogri", value: "doi" },
        { label: "Konkani", value: "kok" },
        { label: "Maithili", value: "mai" },
        { label: "Meitei (Manipuri)", value: "mni" },
        { label: "Nepali", value: "ne" },
        { label: "Santali", value: "sat" },
        { label: "Sindhi", value: "sd" },
        { label: "Kashmiri", value: "ks" },
        { label: "Sanskrit", value: "sa" },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const filteredLanguages = INDIAN_LANGUAGES.filter(lang =>
        lang.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [isLangaugeSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">

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
                                            variant={
                                                language === lang
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() => setLanguage(lang)}
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

            {/* Centered Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <Card style={{ width: "600px" }} className="max-w-2xl shadow-xl border-white/50 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-6 border-b text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 mx-auto">
                            <Stethoscope className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Professional Profile</CardTitle>
                        <CardDescription>
                            Enter your details to finalize your NexCare doctor account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8 min-w-0">
                        <form onSubmit={handleSubmit()} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Specialization</Label>
                                    <Select onValueChange={(val: string) => setValue("domain", val)}>
                                        <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue placeholder="Select Domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Physician</SelectItem>
                                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="gynecology">Gynecology</SelectItem>
                                            {/* Add other domains as needed */}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Years of Experience</Label>
                                    <Input
                                        type="number"
                                        placeholder="10"
                                        {...register("experience")}
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
                                        className="pl-8 bg-white border-gray-200"
                                        {...register("fee")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-black font-bold tracking-widest text-slate-500">
                                    Fluent Languages
                                </Label>

                                {/* 2. The Selected Badges (with Delete button) */}
                                <div className="flex flex-wrap gap-3 mt-4 min-w-0">
                                    {selectedLanguages.map((langValue) => {
                                        const langLabel = INDIAN_LANGUAGES.find((l) => l.value === langValue)?.label || langValue;
                                        return (
                                            <div
                                                key={langValue}
                                                className="
                                                flex text-black
                                                px-4 py-2 rounded-full 
                                                border-2 border-slate-900
                                                items-center justify-center
                                            "
                                            >
                                                <span className="text-sm truncate max-w-[140px]">{langLabel}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleLanguage(langValue)}
                                                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="h-4 w-4 ml-2" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Popover open={isLangaugeSelectorOpen} onOpenChange={setIsLanguageSelectorOpen}>
                                    <PopoverTrigger className="w-full">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full h-12 justify-between !rounded-none border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] data-[state=open]:shadow-none data-[state=open]:translate-x-[1px] data-[state=open]:translate-y-[1px] transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe2 className="h-4 w-4 text-blue-600" />
                                                <span className="font-bold">
                                                    {selectedLanguages.length > 0 ? `${selectedLanguages.length} Selected` : "Select Languages..."}
                                                </span>
                                            </div>
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        side="bottom"
                                        align="start"
                                        sideOffset={8}
                                        avoidCollisions
                                        className="z-[9999] w-full p-0 !rounded-none border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                                    >
                                        <Command className="!rounded-none bg-white">
                                            <div className="flex items-center border-b-2 border-slate-900 px-3 bg-slate-50">
                                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                <CommandInput
                                                    placeholder="Search languages..."
                                                    value={searchQuery}
                                                    onValueChange={setSearchQuery}
                                                    className="h-11 font-bold !border-none !ring-0"
                                                />
                                            </div>
                                            <div className="max-h-[70vh] overflow-auto">
                                                <CommandList>
                                                    <CommandEmpty className="py-6 text-center text-xs font-black uppercase text-slate-400">
                                                        No results found.
                                                    </CommandEmpty>
                                                    <CommandGroup className="p-2">
                                                        {filteredLanguages.map((lang) => {
                                                            const isSelected = selectedLanguages.includes(lang.value);
                                                            return (
                                                                <CommandItem
                                                                    key={lang.value}
                                                                    onSelect={() => toggleLanguage(lang.value)}
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


                            <div className="text-right pt-6 border-t">
                                <Button type="submit" variant="default" className="gap-2">
                                    Save & Enter Dashboard
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div >
    );
};