import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Activity, Thermometer, Droplets, HeartPulse, Scale, Ruler } from "lucide-react";
import axios from "axios";
import { useError } from "./ui/Toast";

interface HealthMetricsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    oldHealthRecord: any;
    onUpdate?: (updatedVitals: any) => void;
}



export const HealthMetricsOverlay = ({ isOpen, onClose, patientId, oldHealthRecord, onUpdate }: HealthMetricsOverlayProps) => {
    const { showToast } = useError();
    const [bpSys, setBpSys] = useState<string>("");
    const [bpDia, setBpDia] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [spo2, setSpo2] = useState<string>("");
    const [temp, setTemp] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [heartRate, setHeartRate] = useState<string>("");

    const saveHealthRecords = async () => {
        try {
            const vitalsData = {
                bp: { sys: parseInt(bpSys, 10), dia: parseInt(bpDia, 10) },
                weight: parseFloat(weight),
                spo2: parseInt(spo2, 10),
                temp: parseFloat(temp),
                height: parseFloat(height),
                heart_rate: parseInt(heartRate, 10),
                gen_id: patientId
            };

            const res = await axios.post(`http://localhost:8090/doctor/addVitals?gen_id=${patientId}`, vitalsData, { withCredentials: true });

            if (res.status === 200 && res.data.success) {
                showToast("Vitals added successfully!", true);
                if (onUpdate) {
                    onUpdate({
                        bp: { sys: bpSys, dia: bpDia },
                        weight: parseFloat(weight),
                        spo2: parseFloat(spo2),
                        temp: parseFloat(temp),
                        height: parseFloat(height),
                        heart_rate: parseFloat(heartRate)
                    });
                }
                onClose();
            } else {
                showToast("Failed to add vitals", false);
            }
        } catch (err) {
            showToast("Error adding vitals", false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white border-none shadow-2xl sm:rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-emerald-600" />
                        Record Vitals: {patientId}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the latest physiological data. Ensure units are correct for rural clinical standards.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    {/* BP & Heart Rate Group */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-red-500" /> Blood Pressure (Sys/Dia)</Label>
                            <div className="flex gap-2">
                                <Input placeholder="120" className="bg-gray-50 border-gray-200" value={bpSys} onChange={(e) => setBpSys(e.target.value)} />
                                <Input placeholder="80" className="bg-gray-50 border-gray-200" value={bpDia} onChange={(e) => setBpDia(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Scale className="h-4 w-4 text-emerald-500" /> Weight (kg)</Label>
                            <Input type="number" placeholder="65" className="bg-gray-50 border-gray-200" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500" /> SpO2 (%)</Label>
                            <Input type="number" placeholder="98" className="bg-gray-50 border-gray-200" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
                        </div>
                    </div>

                    {/* Temp, Height, Heart Rate Group */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-orange-500" /> Temperature (°F)</Label>
                            <Input type="number" step="0.1" placeholder="98.6" className="bg-gray-50 border-gray-200" value={temp} onChange={(e) => setTemp(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Ruler className="h-4 w-4 text-indigo-500" /> Height (cm)</Label>
                            <Input type="number" placeholder="170" className="bg-gray-50 border-gray-200" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Activity className="h-4 w-4 text-purple-500" /> Heart Rate (bpm)</Label>
                            <Input type="number" placeholder="72" className="bg-gray-50 border-gray-200" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="ghost" onClick={onClose} className="text-gray-500">Cancel</Button>
                    <Button onClick={saveHealthRecords} className="bg-primary hover:bg-emerald-700 text-white">Save Metrics</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};