import React, { useState } from 'react';
import {
    ShieldAlert,
    Clock,
    AlertTriangle,
    Zap,
    X,
    Info,
    Timer
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export default function SOSOverrideModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
    const [duration, setDuration] = useState('24');

    const durations = [
        { label: "4 Hours", value: "4", desc: "Short-term emergency" },
        { label: "12 Hours", value: "12", desc: "Shift-wide block" },
        { label: "24 Hours", value: "24", desc: "Full day override" },
        { label: "48 Hours", value: "48", desc: "Extended leave" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md border-none p-0 bg-white overflow-hidden shadow-[20px_20px_0px_0px_rgba(220,38,38,0.1)]">

                {/* --- DANGER HEADER --- */}
                <div style={{ background: 'red' }} className="p-8 text-white relative overflow-hidden">
                    <ShieldAlert style={{ position: 'absolute', top: '5px', left: '-10px' }} className=" h-32 w-32 opacity-20 rotate-12" />
                    <div className="relative z-10 space-y-2">
                        <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-black px-3">
                            PROTOCOL: EMERGENCY_OVERRIDE
                        </Badge>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                            Activate SOS Block?
                        </DialogTitle>
                        <DialogDescription className="text-red-100 font-medium leading-tight">
                            This will immediately cancel all upcoming slots and prevent new bookings for the selected duration.
                        </DialogDescription>
                    </div>
                </div>


                <div className="p-8 space-y-6">
                    {/* --- DURATION SELECTOR --- */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-md font-black uppercase tracking-[0.2em] text-slate-400">Select Duration</span>
                            <Timer className="h-4 w-4 text-slate-300" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {durations.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDuration(d.value)}
                                    className={`
                    flex flex-col items-start p-4 border-2 transition-all text-left
                    ${duration === d.value
                                            ? "border-red-600 bg-red-50 ring-2 ring-red-600/10"
                                            : "border-slate-100 bg-white hover:border-slate-300"}
                  `}
                                >
                                    <span className={`font-black text-lg ${duration === d.value ? "text-red-700" : "text-slate-900"}`}>
                                        {d.label}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        {d.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* --- WARNING INFO --- */}
                    <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-black text-amber-900 uppercase">Warning: Patient Impact</p>
                            <p className="text-[11px] text-amber-800/80 font-medium leading-relaxed">
                                Activating this block will trigger automated SMS/Email notifications to patients scheduled within the next <span className="font-bold text-amber-900">{duration} hours</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- ACTIONS --- */}
                <div className="p-8 pt-0 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-12 border-2 border-slate-200 font-bold hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        style={{ background: 'red' }}
                        className="flex-1 h-12 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-lg shadow-red-200"
                    >
                        Confirm Block
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}