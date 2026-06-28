// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import {
//     Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
//     FileText, Activity, User, Heart, Settings, Maximize2, Shield
// } from 'lucide-react';

// interface ConsultationRoomProps {
//     appointmentId: string;
//     userRole: 'patient' | 'doctor';
//     userName: string;
// }

// export default function ConsultationRoom({ appointmentId, userRole, userName }: ConsultationRoomProps) {
//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);
//     const [callDuration, setCallDuration] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const formatTime = (seconds: number) => {
//         const m = Math.floor(seconds / 60).toString().padStart(2, '0');
//         const s = (seconds % 60).toString().padStart(2, '0');
//         return `${m}:${s}`;
//     };

//     const handleEndCall = () => {
//         if (window.confirm("Are you sure you want to end this consultation?")) {
//             window.close();
//         }
//     };

//     return (
//         <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col font-sans overflow-hidden z-50">

//             {/* Platform Header */}
//             <header className="h-16 bg-white/80 backdrop-blur-md border-b shadow-sm flex items-center justify-between px-6 z-10">
//                 <div className="flex items-center space-x-3">
//                     <div className="p-1.5 bg-blue-600 rounded-md">
//                         <Heart className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                         <h1 className="text-md font-bold text-gray-900 flex items-center gap-2">
//                             NexCare Live Consultation
//                             <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-100 animate-pulse">
//                                 Connected
//                             </Badge>
//                         </h1>
//                     </div>
//                 </div>

//                 <div className="flex items-center space-x-6">
//                     <div className="bg-gray-100 px-4 py-1.5 rounded-full font-mono text-sm font-semibold text-gray-700 tracking-wider">
//                         Time elapsed: {formatTime(callDuration)}
//                     </div>
//                     <span className="text-gray-400 text-xs hidden sm:inline">Session: {appointmentId}</span>
//                 </div>
//             </header>

//             {/* Main Workspace Frame */}
//             <div className="flex-1 flex overflow-hidden p-4 gap-4">

//                 {/* Left Side: Video Feed Dashboard */}
//                 <div className="flex-1 flex flex-col gap-4">

//                     {/* Main Display Window */}
//                     <div className="flex-1 bg-slate-900 rounded-2xl relative shadow-inner overflow-hidden border border-slate-800 flex items-center justify-center">

//                         {/* Main Stream View (Doctor or Patient) */}
//                         <div className="text-center space-y-3 z-0">
//                             <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700">
//                                 <User className="h-10 w-10 text-slate-400" />
//                             </div>
//                             <p className="text-slate-300 font-medium">
//                                 {userRole === 'doctor' ? 'Waiting for Patient to toggle video...' : 'Connecting with Doctor...'}
//                             </p>
//                             <p className="text-xs text-slate-500">Low-bandwidth optimization engine active</p>
//                         </div>

//                         {/* Picture-in-Picture (Your Own Camera View) */}
//                         <div className="absolute bottom-4 right-4 w-44 h-28 bg-slate-950 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between p-3">
//                             <div className="text-[10px] bg-black/40 text-slate-300 px-1.5 py-0.5 rounded w-fit backdrop-blur-xs">
//                                 You ({userName})
//                             </div>
//                             <div className="flex justify-end">
//                                 {isMuted && <MicOff className="h-3 w-3 text-red-400" />}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Clean Controls Dashboard Box */}
//                     <div className="h-20 bg-white rounded-2xl border shadow-sm flex items-center justify-between px-8">
//                         <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
//                             <Shield className="h-4 w-4 text-emerald-600" />
//                             <span>End-to-End Encrypted</span>
//                         </div>

//                         <div className="flex items-center space-x-4">
//                             <Button
//                                 variant={isMuted ? "destructive" : "outline"}
//                                 size="icon"
//                                 className="h-11 w-11 rounded-full shadow-xs"
//                                 onClick={() => setIsMuted(!isMuted)}
//                             >
//                                 {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-gray-600" />}
//                             </Button>

//                             <Button
//                                 variant={isVideoOff ? "destructive" : "outline"}
//                                 size="icon"
//                                 className="h-11 w-11 rounded-full shadow-xs"
//                                 onClick={() => setIsVideoOff(!isVideoOff)}
//                             >
//                                 {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5 text-gray-600" />}
//                             </Button>

//                             <Button
//                                 variant="destructive"
//                                 className="h-11 px-6 rounded-full font-medium shadow-md transition-all hover:bg-red-700"
//                                 onClick={handleEndCall}
//                             >
//                                 <PhoneOff className="h-4 w-4 mr-2" />
//                                 Disconnect
//                             </Button>
//                         </div>

//                         <div className="w-24 hidden md:block" /> {/* Layout balancer */}
//                     </div>
//                 </div>

//                 {/* Right Side: Collapsible Workspace Sidebar */}
//                 <div className="w-[320px] min-w-[320px] max-w-[320px] bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
//                     <Tabs defaultValue="overview" className="flex-1 flex flex-col">
//                         <div className="p-3 border-b bg-gray-50">
//                             <TabsList className="grid w-full grid-cols-2 bg-gray-200/60">
//                                 <TabsTrigger value="overview" className="text-xs">
//                                     <Activity className="h-3.5 w-3.5 mr-1.5" /> Workspace
//                                 </TabsTrigger>
//                                 <TabsTrigger value="chat" className="text-xs">
//                                     <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Live Chat
//                                 </TabsTrigger>
//                             </TabsList>
//                         </div>

//                         {/* Workspace Content View */}
//                         <TabsContent value="overview" className="flex-1 w-full flex flex-col p-4 m-0 overflow-y-auto space-y-4">
//                             <Card className="border-dashed shadow-none bg-blue-50/40">
//                                 <CardHeader className="p-3 pb-1">
//                                     <CardTitle className="text-xs font-semibold text-blue-950 flex items-center gap-1.5">
//                                         <FileText className="h-3.5 w-3.5 text-blue-600" /> Consultation Notes
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="p-3 pt-0">
//                                     <p className="text-xs text-blue-900/80 leading-relaxed">
//                                         Use this dedicated panel to review symptoms or prepare active observations safely during the call session.
//                                     </p>
//                                 </CardContent>
//                             </Card>

//                             {userRole === 'doctor' ? (
//                                 <div className="space-y-3 pt-2">
//                                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Clinical Actions</span>
//                                     <Button className="w-full justify-start text-xs bg-blue-600 hover:bg-blue-700" size="sm">
//                                         ＋ Prescribe Medication
//                                     </Button>
//                                     <Button className="w-full justify-start text-xs" variant="outline" size="sm">
//                                         📋 Request Lab Work
//                                     </Button>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3 pt-2">
//                                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Patient Checklist</span>
//                                     <div className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2 text-gray-600">
//                                         <p className="flex items-center gap-2">✓ Keep prescriptions nearby</p>
//                                         <p className="flex items-center gap-2">✓ Speak into your microphone clearly</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </TabsContent>

//                         {/* Integrated Messaging View */}
//                         <TabsContent value="chat" className="flex-1 w-full flex flex-col p-4 m-0 overflow-y-auto space-y-4">
//                             <div className="flex-1 p-4 bg-gray-50/50 space-y-3 overflow-y-auto text-center pt-8">
//                                 <MessageSquare className="h-8 w-8 text-gray-300 mx-auto" />
//                                 <p className="text-xs text-gray-400">Text messaging is fully synchronized.</p>
//                             </div>
//                             <div className="p-3 border-t bg-white">
//                                 <input
//                                     type="text"
//                                     placeholder="Type notes or message..."
//                                     className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                 </div>

//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
    FileText, Activity, User, Heart, Settings, Maximize2, Shield
} from 'lucide-react';

interface ConsultationRoomProps {
    appointmentId: string;
    userRole: 'patient' | 'doctor';
    userName: string;
}

export default function ConsultationRoom({ appointmentId, userRole, userName }: ConsultationRoomProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleEndCall = () => {
        if (window.confirm("Are you sure you want to end this consultation?")) {
            window.close();
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col font-sans overflow-hidden z-50">

            {/* Platform Header */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b shadow-sm flex items-center justify-between px-6 z-10">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-600 rounded-md">
                        <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-md font-bold text-gray-900 flex items-center gap-2">
                            NexCare Live Consultation
                            <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-100 animate-pulse">
                                Connected
                            </Badge>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="bg-gray-100 px-4 py-1.5 rounded-full font-mono text-sm font-semibold text-gray-700 tracking-wider">
                        Time elapsed: {formatTime(callDuration)}
                    </div>
                    <span className="text-gray-400 text-xs hidden sm:inline">Session: {appointmentId}</span>
                </div>
            </header>

            {/* Main Workspace Frame */}
            <div className="flex-1 flex overflow-hidden p-4 gap-4">

                {/* Left Side: Video Feed Dashboard */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Main Display Window */}
                    <div className="flex-1 bg-slate-900 rounded-2xl relative shadow-inner overflow-hidden border border-slate-800 flex items-center justify-center">

                        {/* Main Stream View (Doctor or Patient) */}
                        <div className="text-center space-y-3 z-0">
                            <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700">
                                <User className="h-10 w-10 text-slate-400" />
                            </div>
                            <p className="text-slate-300 font-medium">
                                {userRole === 'doctor' ? 'Waiting for Patient to toggle video...' : 'Connecting with Doctor...'}
                            </p>
                            <p className="text-xs text-slate-500">Low-bandwidth optimization engine active</p>
                        </div>

                        {/* Picture-in-Picture (Your Own Camera View) */}
                        <div className="absolute bottom-4 right-4 w-44 h-28 bg-slate-950 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between p-3">
                            <div className="text-[10px] bg-black/40 text-slate-300 px-1.5 py-0.5 rounded w-fit backdrop-blur-xs">
                                You ({userName})
                            </div>
                            <div className="flex justify-end">
                                {isMuted && <MicOff className="h-3 w-3 text-red-400" />}
                            </div>
                        </div>
                    </div>

                    {/* Clean Controls Dashboard Box */}
                    <div style={{ height: "4rem", padding: "1rem" }} className="bg-white rounded-2xl border shadow-sm flex items-center justify-between px-8">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
                            <Shield className="h-4 w-4 text-emerald-600" />
                            <span>End-to-End Encrypted</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant={isMuted ? "destructive" : "outline"}
                                size="icon"
                                className="h-11 w-11 rounded-full shadow-xs"
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-gray-600" />}
                            </Button>

                            <Button
                                variant={isVideoOff ? "destructive" : "outline"}
                                size="icon"
                                className="h-11 w-11 rounded-full shadow-xs"
                                onClick={() => setIsVideoOff(!isVideoOff)}
                            >
                                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5 text-gray-600" />}
                            </Button>

                            <Button
                                variant="destructive"
                                className="h-11 px-6 rounded-full font-medium shadow-md transition-all hover:bg-red-700"
                                onClick={handleEndCall}
                            >
                                <PhoneOff className="h-4 w-4 mr-2" />
                                Disconnect
                            </Button>
                        </div>

                        <div className="w-24 hidden md:block" /> {/* Layout balancer */}
                    </div>
                </div>

                {/* Right Side: Collapsible Workspace Sidebar */}
                <div className="w-[320px] min-w-[320px] max-w-[320px] bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
                    <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
                        <div className="p-3 border-b bg-gray-50">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-200/60">
                                <TabsTrigger value="overview" className="text-xs">
                                    <Activity className="h-3.5 w-3.5 mr-1.5" /> Workspace
                                </TabsTrigger>
                                <TabsTrigger value="chat" className="text-xs">
                                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Live Chat
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Workspace Content View */}
                        <TabsContent value="overview" className="flex-1 flex flex-col p-4 m-0 overflow-y-auto space-y-4 w-[320px] shrink-0">
                            <Card className="border-dashed shadow-none bg-blue-50/40">
                                <CardHeader className="p-3 pb-1">
                                    <CardTitle className="text-xs font-semibold text-blue-950 flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-blue-600" /> Consultation Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    <p className="text-xs text-blue-900/80 leading-relaxed">
                                        Use this dedicated panel to review symptoms or prepare active observations safely during the call session.
                                    </p>
                                </CardContent>
                            </Card>

                            {userRole === 'doctor' ? (
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Clinical Actions</span>
                                    <Button className="w-full justify-start text-xs bg-blue-600 hover:bg-blue-700" size="sm">
                                        ＋ Prescribe Medication
                                    </Button>
                                    <Button className="w-full justify-start text-xs" variant="outline" size="sm">
                                        📋 Request Lab Work
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Patient Checklist</span>
                                    <div className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2 text-gray-600">
                                        <p className="flex items-center gap-2">✓ Keep prescriptions nearby</p>
                                        <p className="flex items-center gap-2">✓ Speak into your microphone clearly</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Integrated Messaging View */}
                        <TabsContent value="chat" className="flex-1 flex flex-col p-4 m-0 overflow-y-auto space-y-4 w-[320px] shrink-0">
                            <div className="flex-1 p-4 bg-gray-50/50 space-y-3 overflow-y-auto text-center pt-8">
                                <MessageSquare className="h-8 w-8 text-gray-300 mx-auto" />
                                <p className="text-xs text-gray-400">Text messaging is fully synchronized.</p>
                            </div>
                            <div className="p-3 border-t bg-white">
                                <input
                                    type="text"
                                    placeholder="Type notes or message..."
                                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </div>
    );
}