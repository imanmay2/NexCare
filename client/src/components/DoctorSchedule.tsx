import React, { useState } from 'react';
import {
    Clock, Plus, Trash2, Calendar,
    Zap, ShieldAlert, Activity,
    ArrowRight, Info, CheckCircle2,
    Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import SOSOverrideModal from './SOSOverrideModal';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type TimeSlot = { id: number, start: string; end: string };
type TimeSlots = Record<string, TimeSlot[]>;

export default function PremiumSchedule({ timeSlots, setTimeSlots }: { timeSlots: TimeSlots, setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlots>> }) {

    const [isSOSOpen, setIsSOSOpen] = useState(false);


    const addShift = (day: string) => {
        // Adding a new default slot (9am-5pm) for the specified day
        setTimeSlots((prev) => ({
            ...prev,
            [day]: [...prev[day], { id: Date.now(), start: "09:00", end: "17:00" }],
        }));
    };

    const deleteShift = (day: string, index: number) => {
        //Deleting the time slots based on the day and index received
        setTimeSlots((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index),
        }));
    }


    return (
        <div className="max-w-[1400px] mx-auto p-8 space-y-8 animate-in fade-in duration-700">



            <div className="grid grid-cols-2 gap-6">

                {/* LEFT COLUMN: The Schedule Engine */}
                <div className="col-span-12 lg:col-span-8 space-y-4">
                    {DAYS.map((day) => (
                        <Card key={day} className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-600 bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-stretch">

                                    {/* Day Label Area */}
                                    <div className="w-full md:w-56 p-6 bg-slate-50/50 flex flex-row md:flex-col justify-between md:justify-center border-r border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900">{day}</h3>
                                        <div className="mt-3 hidden md:flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">{timeSlots[day].length > 0 ? "Active" : "Closed"}</span>
                                        </div>
                                    </div>

                                    <Button onClick={() => addShift(day)} variant="ghost" style={{ margin: '0 24px 0 24px' }} className="h-14 px-6 border-2 border-dashed border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 text-slate-400 hover:text-blue-600 transition-all rounded-xl group">
                                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Add Shift</span>
                                    </Button>

                                    {/* Slot Configuration Canvas */}
                                    {timeSlots[day].map((slot: TimeSlot, sidx) => (
                                        <div key={slot.id} className="flex-1 px-6 pt-6 flex flex-col gap-4">
                                            {slot.start !== "Closed" ? <div style={{ padding: '6px' }} className="flex items-center justify-between gap-2 p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    <input type="time" value={slot.start} // controlled
                                                        onChange={(e) => {
                                                            const updatedSlots = [...timeSlots[day]];
                                                            updatedSlots[sidx] = { ...slot, start: e.target.value };
                                                            setTimeSlots({ ...timeSlots, [day]: updatedSlots });
                                                        }} className="bg-transparent font-bold text-sm outline-none" />
                                                    <ArrowRight className="h-3 w-3 text-slate-300" />
                                                    <input type="time" value={slot.end} // controlled
                                                        onChange={(e) => {
                                                            const updatedSlots = [...timeSlots[day]];
                                                            updatedSlots[sidx] = { ...slot, end: e.target.value };
                                                            setTimeSlots({ ...timeSlots, [day]: updatedSlots });
                                                        }} className="bg-transparent font-bold text-sm outline-none" />
                                                </div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button onClick={() => deleteShift(day, sidx)} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Remove this slot</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div> : null}


                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* RIGHT COLUMN: Configuration HUD */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* <Card className="border-none bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="h-32 w-32 rotate-12 fill-white" />
                        </div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl font-bold tracking-tight">Smart Buffer Engine</CardTitle>
                            <CardDescription className="text-slate-400 font-medium">Auto-insert recovery windows between patients.</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {['10m', '15m', '20m', '30m'].map(m => (
                                    <Button key={m} variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-white hover:text-slate-900 font-bold transition-all h-12">
                                        {m} Buffer
                                    </Button>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                                    Buffers ensure high-quality care and prevent burnout during high-volume surgical days.
                                </p>
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card className="border-2 border-slate-100 shadow-xl p-8 space-y-6 bg-white/50 backdrop-blur-md">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Protocol Statistics</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Weekly Consult Hours", value: "38.5 Hrs", icon: Activity },
                                { label: "Average Daily Capacity", value: "14 Patients", icon: CheckCircle2 },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <stat.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <div className="flex items-center gap-2 mb-2 text-red-600">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Emergency Override</span>
                            </div>
                            <p className="text-[11px] text-red-500/80 font-medium mb-4">Temporarily mark all slots as unavailable for the next 24-48 hours.</p>
                            <Button onClick={() => setIsSOSOpen(true)} variant="destructive" className="w-full h-10 font-bold tracking-tight rounded-lg">
                                Activate SOS Block
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>

            <SOSOverrideModal isOpen={isSOSOpen} setIsOpen={setIsSOSOpen} />
        </div>
    );
}