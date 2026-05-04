import React from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { ClipboardList, ShieldAlert, Pill, Activity, UserCog } from "lucide-react";

interface EditProfileProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
}

export const EditClinicalProfile = ({ isOpen, onClose, patientId }: EditProfileProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl !rounded-none border-2 border-slate-900 bg-white p-0 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <DialogHeader className="p-6 border-b-2 border-slate-900 bg-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border-2 border-slate-900 bg-white">
                            <UserCog className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Edit Clinical Profile</DialogTitle>
                            <DialogDescription className="text-slate-600 font-medium">
                                Updating Master Records for Patient: <span className="text-blue-700 font-bold">{patientId}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] p-6">
                    <div className="space-y-8">

                        {/* Section 1: Basic Clinical Identity */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Baseline Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center ">
                                <div className="space-y-2">
                                    <Label className="font-bold">Blood Group</Label>
                                    <Select>
                                        <SelectTrigger className="!rounded-none border-2 border-slate-900 !bg-white">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold">Primary Language (for Consultation)</Label>
                                    <Input className="!rounded-none border-2 border-slate-900" placeholder="e.g. Punjabi, Hindi" />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Critical Risks */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2 mt-2">
                                <ShieldAlert className="h-4 w-4" /> Medical Alerts
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 border-2 border-red-200 bg-red-50/30">
                                    <Label className="font-bold text-red-700">Drug Allergies</Label>
                                    <Textarea
                                        className="mt-2 !rounded-none border-2 border-slate-900 bg-white"
                                        placeholder="List specific medications (e.g., Penicillin, Sulfa drugs)"
                                    />
                                </div>
                                <div className="p-4 border-2 border-slate-900">
                                    <Label className="font-bold">Chronic Conditions</Label>
                                    <Textarea
                                        className="mt-2 !rounded-none border-2 border-slate-900 bg-white"
                                        placeholder="Diabetes Type 2, Hypertension, Asthma, etc."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Medication & History */}
                        <section className="space-y-4 pb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pt-6">
                                <Pill className="h-4 w-4" /> Current Management
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-bold">Current Medications</Label>
                                    <Textarea
                                        className="!rounded-none border-2 border-slate-900"
                                        placeholder="Drug Name - Dosage - Frequency"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Family History</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="Cardiac issues, Cancer history..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Surgical History</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="Appendectomy 2018, etc." />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 border-t-2 border-slate-900 bg-slate-50">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="!rounded-none font-bold text-slate-500 hover:bg-slate-200"
                    >
                        Discard
                    </Button>
                    <Button
                        className="
              !bg-blue-600 !text-white !rounded-none font-black uppercase !px-10 border-2 border-slate-900
              shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]
              hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all
            "
                    >
                        Update Clinical Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};