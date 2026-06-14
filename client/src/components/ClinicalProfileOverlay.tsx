import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useError } from "./ui/Toast";

interface EditProfileProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    oldHealthRecord: any;
    isNew: boolean;
    onUpdate: (updatedData: any) => void;
}

interface Menstrual {
    flow: string;
    amount: string;
    duration: string;
    menarche: string;
    regularity: string;
    cycle_length: string;
    associated_symptoms: string;
}

export const EditClinicalProfile = ({ isOpen, onClose, patientId, oldHealthRecord, isNew, onUpdate }: EditProfileProps) => {
    const [bloodType, setBloodType] = useState<string>(oldHealthRecord?.blood_type || "");
    const [allergyList, setAllergyList] = useState<string>(oldHealthRecord?.allergies || "");
    const [chronicConditionList, setChronicConditionList] = useState<string>(oldHealthRecord?.medical_conditions || "");
    const [currentMedicationList, setCurrentMedicationList] = useState<string>(oldHealthRecord?.current_medications || "");
    const [familyHistoryList, setFamilyHistoryList] = useState<string>(oldHealthRecord?.family_history || "");
    const [surgicalHistoryList, setSurgicalHistoryList] = useState<string>(oldHealthRecord?.surgical_history || "");
    const [gender, setGender] = useState<string>(oldHealthRecord?.gender || "");
    const [lmp, setLMP] = useState<string>(oldHealthRecord?.lmp || "");
    const [menstrualHistoryList, setMenstrualHistoryList] = useState<Menstrual>(
        oldHealthRecord?.menstrual_history || {
            flow: "",
            amount: "",
            duration: "",
            menarche: "",
            regularity: "",
            cycle_length: "",
            associated_symptoms: ""
        }
    );

    const { showToast } = useError();

    useEffect(() => {
        if (!oldHealthRecord) {
            return;
        }

        setBloodType(oldHealthRecord.blood_type || "");
        setAllergyList(oldHealthRecord.allergies || "");
        setChronicConditionList(oldHealthRecord.medical_conditions || "");
        setCurrentMedicationList(oldHealthRecord.current_medications || "");
        setFamilyHistoryList(oldHealthRecord.family_history || "");
        setSurgicalHistoryList(oldHealthRecord.surgical_history || "");
        setGender(oldHealthRecord.gender || "");
        setLMP(oldHealthRecord.lmp || "");
        setMenstrualHistoryList(oldHealthRecord.menstrual_history || {
            flow: "",
            amount: "",
            duration: "",
            menarche: "",
            regularity: "",
            cycle_length: "",
            associated_symptoms: ""
        });
    }, [oldHealthRecord]);

    const updateClinicalProfile = () => {
        if (!isNew) {
            axios.put("https://nexcare.duckdns.org/doctor/updatePatientMedicalRecords", {
                name: oldHealthRecord.name,
                age: oldHealthRecord.age,
                gender: oldHealthRecord.gender,
                blood_type: bloodType,
                allergies: allergyList,
                medical_conditions: chronicConditionList,
                current_medications: currentMedicationList,
                family_history: familyHistoryList,
                surgical_history: surgicalHistoryList,
                lmp: new Date(lmp),
                menstrual_history: menstrualHistoryList,
                gen_id: patientId
            }, { withCredentials: true }).then((response) => {
                if (response.data.success) {
                    showToast("Clinical profile updated successfully!", true);
                    oldHealthRecord.allergies = allergyList;
                    oldHealthRecord.medical_conditions = chronicConditionList;
                    oldHealthRecord.current_medications = currentMedicationList;
                    oldHealthRecord.family_history = familyHistoryList;
                    oldHealthRecord.surgical_history = surgicalHistoryList;
                    oldHealthRecord.menstrual_history = menstrualHistoryList;
                    oldHealthRecord.lmp = new Date(lmp);
                    oldHealthRecord.blood_type = bloodType;
                    onUpdate({
                        ...oldHealthRecord,
                        blood_type: bloodType,
                        allergies: allergyList,
                        medical_conditions: chronicConditionList,
                        current_medications: currentMedicationList,
                        family_history: familyHistoryList,
                        surgical_history: surgicalHistoryList,
                        lmp: lmp,
                        menstrual_history: menstrualHistoryList
                    });
                    onClose();
                } else {
                    showToast("Failed to update clinical profile. Please try again.", false);
                }
            });
        } else
            axios.post("https://nexcare.duckdns.org/doctor/addPatientMedicalRecords", {
                name: oldHealthRecord.name,
                age: oldHealthRecord.age,
                gender: oldHealthRecord.gender,
                blood_type: bloodType,
                allergies: allergyList,
                medical_conditions: chronicConditionList,
                current_medications: currentMedicationList,
                family_history: familyHistoryList,
                surgical_history: surgicalHistoryList,
                lmp: new Date(lmp),
                menstrual_history: menstrualHistoryList,
                gen_id: patientId
            }, { withCredentials: true }).then((response) => {
                if (response.data.success) {
                    showToast("Clinical profile added successfully!", true);
                    oldHealthRecord.allergies = allergyList;
                    oldHealthRecord.medical_conditions = chronicConditionList;
                    oldHealthRecord.current_medications = currentMedicationList;
                    oldHealthRecord.family_history = familyHistoryList;
                    oldHealthRecord.surgical_history = surgicalHistoryList;
                    oldHealthRecord.menstrual_history = menstrualHistoryList;
                    oldHealthRecord.lmp = new Date(lmp);
                    oldHealthRecord.blood_type = bloodType;
                    onUpdate({
                        ...oldHealthRecord,
                        blood_type: bloodType,
                        allergies: allergyList,
                        medical_conditions: chronicConditionList,
                        current_medications: currentMedicationList,
                        family_history: familyHistoryList,
                        surgical_history: surgicalHistoryList,
                        lmp: lmp,
                        menstrual_history: menstrualHistoryList
                    });
                    onClose();
                } else {
                    showToast("Failed to add clinical profile. Please try again.", false);
                }
            });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                style={{
                    maxHeight: "90dvh",
                    overflowY: "auto",
                }}
                className="max-w-3xl !rounded-none border-2 border-slate-900 bg-white p-0 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
            >
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

                <div className="p-6">
                    <div className="space-y-8">

                        {/* Section 1: Basic Clinical Identity */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Baseline Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center ">
                                <div className="space-y-2">
                                    <Label className="font-bold">Blood Group</Label>
                                    <Select value={bloodType} onValueChange={(value: string) => setBloodType(value)}>
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
                                    <Label className="font-bold">Gender</Label>
                                    <Input className="!rounded-none border-2 border-slate-900" placeholder="e.g. Male, Female" value={gender} disabled />
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
                                        value={allergyList}
                                        onChange={(e) => setAllergyList(e.target.value)}
                                    />
                                </div>
                                <div className="p-4 border-2 border-slate-900">
                                    <Label className="font-bold">Chronic Conditions</Label>
                                    <Textarea
                                        className="mt-2 !rounded-none border-2 border-slate-900 bg-white"
                                        placeholder="Diabetes Type 2, Hypertension, Asthma, etc."
                                        value={chronicConditionList}
                                        onChange={(e) => setChronicConditionList(e.target.value)}
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
                                        value={currentMedicationList}
                                        onChange={(e) => setCurrentMedicationList(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Family History</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="Cardiac issues, Cancer history..." value={familyHistoryList} onChange={(e) => setFamilyHistoryList(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Surgical History</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="Appendectomy 2018, etc." value={surgicalHistoryList} onChange={(e) => setSurgicalHistoryList(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section for mentrual details in case of female only */}
                        {gender === "Female" && (
                            <section className="space-y-4 pb-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pt-6">
                                    <Pill className="h-4 w-4" /> Menstrual Details
                                </h3>
                                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Last Menstrual Period</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="e.g. 2023-10-01" value={lmp.split("T")[0]} onChange={(e) => setLMP(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Menarche (years)</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" type="number" placeholder="e.g. 10 years" value={menstrualHistoryList.menarche} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, menarche: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Amount (pads/day)</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" type="number" placeholder="e.g. 2 pads/day" value={menstrualHistoryList.amount} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, amount: e.target.value })} />
                                    </div>
                                    {/* <div className="space-y-2">
                                        <Label className="font-bold">Flow</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="e.g. light, moderate, heavy" value={menstrualHistoryList.flow} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, flow: e.target.value })} />
                                    </div> */}
                                    <div className="space-y-2">
                                        <Label className="font-bold">
                                            Flow
                                        </Label>

                                        <Select
                                            value={menstrualHistoryList?.flow}
                                            onValueChange={(value: string) => setMenstrualHistoryList({
                                                ...menstrualHistoryList,
                                                flow: value
                                            })}
                                        >
                                            <SelectTrigger className="h-12 !rounded-none border-2 border-slate-900 !bg-white font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none">
                                                <SelectValue placeholder="Select flow matrix" />
                                            </SelectTrigger>

                                            <SelectContent className="!rounded-none border-2 border-slate-900 bg-white">
                                                {['Light', 'Moderate', 'Heavy', 'Spotting'].map((intensity) => (
                                                    <SelectItem
                                                        key={intensity}
                                                        value={intensity}
                                                        className="!rounded-none font-bold hover:bg-slate-100 focus:bg-slate-100 cursor-pointer capitalize"
                                                    >
                                                        {intensity}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Duration (days)</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" type="number" placeholder="e.g. 5 days" value={menstrualHistoryList.duration} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, duration: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Regularity</Label>
                                        <Select
                                            value={menstrualHistoryList?.regularity}
                                            onValueChange={(value: string) => setMenstrualHistoryList({
                                                ...menstrualHistoryList,
                                                regularity: value
                                            })}
                                        >
                                            <SelectTrigger className="h-12 !rounded-none border-2 border-slate-900 !bg-white font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none">
                                                <SelectValue placeholder="Select regularity" />
                                            </SelectTrigger>

                                            <SelectContent className="!rounded-none border-2 border-slate-900 bg-white">
                                                {['Regular', 'Irregular'].map((intensity) => (
                                                    <SelectItem
                                                        key={intensity}
                                                        value={intensity}
                                                        className="!rounded-none font-bold hover:bg-slate-100 focus:bg-slate-100 cursor-pointer capitalize"
                                                    >
                                                        {intensity}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Cycle Length (days)</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" type="number" placeholder="e.g. 28" value={menstrualHistoryList.cycle_length} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, cycle_length: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Associated Symptoms (if any)</Label>
                                        <Input className="!rounded-none border-2 border-slate-900" placeholder="e.g. cramps, bloating" value={menstrualHistoryList.associated_symptoms} onChange={(e) => setMenstrualHistoryList({ ...menstrualHistoryList, associated_symptoms: e.target.value })} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

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
                        onClick={updateClinicalProfile}
                    >
                        Update Clinical Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};