import React, { useMemo, useState } from 'react';
import {
    X,
    Pill,
    User,
    Stethoscope,
    CalendarDays,
    FileText,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    AlertCircle,
    ClipboardList,
} from 'lucide-react';

interface PatientInfo {
    name?: string;
    age?: number | string;
    gender?: string;
    patientId?: string;
}

interface PrescriptionEditorProps {
    appointmentId: string;
    doctorName?: string;
    patient?: PatientInfo;
    onClose: () => void;
}

interface Medicine {
    id: string;
    medicineName: string;
    dosage: string;
    dosageUnit: string;
    form: string;
    route: string;
    frequency: string;
    duration: string;
    durationUnit: string;
    foodInstruction: string;
    instructions: string;
}

type PrescriptionStatus = 'DRAFT' | 'FINALIZED';

interface PrescriptionPayload {
    a_id: string;
    title: string;
    symptoms: string;
    diagnosis: string;
    treatment: string; //treatment is same as general instruction
    physical_examination: string;
    drug: Medicine[];
    investigation: string;
    summary: string;
    follow_up_date?: Date | string;

}

const createMedicine = (): Medicine => ({
    id:
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
    medicineName: '',
    dosage: '',
    dosageUnit: 'mg',
    form: 'Tablet',
    route: 'Oral',
    frequency: 'Once daily',
    duration: '',
    durationUnit: 'Days',
    foodInstruction: 'After food',
    instructions: '',
});

const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 38,
    padding: '0 11px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    background: '#fff',
    color: '#0f172a',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontSize: 11,
    fontWeight: 600,
    color: '#334155',
};

const sectionTitleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
};

const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: 90,
    padding: '10px 11px',
    resize: 'vertical',
};

export default function PrescriptionEditor({
    appointmentId,
    doctorName = 'Doctor',
    patient,
    onClose,
}: PrescriptionEditorProps) {
    // ─────────────────────────────────────────────
    // Basic prescription information
    // ─────────────────────────────────────────────

    const [title, setTitle] = useState('');

    // ─────────────────────────────────────────────
    // Clinical information
    // ─────────────────────────────────────────────

    const [chiefComplaint, setChiefComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');

    // ─────────────────────────────────────────────
    // Medicines
    // ─────────────────────────────────────────────

    const [medicines, setMedicines] = useState<Medicine[]>([
        createMedicine(),
    ]);

    // ─────────────────────────────────────────────
    // General instructions
    // ─────────────────────────────────────────────

    const [generalInstructions, setGeneralInstructions] = useState('');

    // ─────────────────────────────────────────────
    // Investigation / follow-up / summary
    // ─────────────────────────────────────────────

    const [investigation, setInvestigation] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [summary, setSummary] = useState('');

    // ─────────────────────────────────────────────
    // Status / messages
    // ─────────────────────────────────────────────

    const [status, setStatus] =
        useState<PrescriptionStatus>('DRAFT');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // ─────────────────────────────────────────────
    // Consultation date
    // ─────────────────────────────────────────────

    const consultationDate = useMemo(() => {
        return new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }, []);

    // ─────────────────────────────────────────────
    // Medicine helpers
    // ─────────────────────────────────────────────

    const updateMedicine = (
        id: string,
        field: keyof Medicine,
        value: string
    ) => {
        setMedicines((current) =>
            current.map((medicine) =>
                medicine.id === id
                    ? { ...medicine, [field]: value }
                    : medicine
            )
        );
    };

    const addMedicine = () => {
        setMedicines((current) => [
            ...current,
            createMedicine(),
        ]);

        setError('');
    };

    const removeMedicine = (id: string) => {
        if (medicines.length === 1) {
            setError('At least one medicine entry is required.');
            return;
        }

        setMedicines((current) =>
            current.filter((medicine) => medicine.id !== id)
        );

        setError('');
    };

    // ─────────────────────────────────────────────
    // Convert medicine objects → DB drug field
    // ─────────────────────────────────────────────

    const buildDrugString = () => {
        return medicines;
        // return medicines
        //     .filter((medicine) => medicine.medicineName.trim())
        //     .map((medicine, index) => {
        //         const parts: string[] = [];

        //         parts.push(
        //             `${index + 1}. ${medicine.medicineName.trim()}`
        //         );

        //         if (medicine.dosage.trim()) {
        //             parts.push(
        //                 `Dosage: ${medicine.dosage.trim()} ${medicine.dosageUnit}`
        //             );
        //         }

        //         if (medicine.form) {
        //             parts.push(`Form: ${medicine.form}`);
        //         }

        //         if (medicine.route) {
        //             parts.push(`Route: ${medicine.route}`);
        //         }

        //         if (medicine.frequency) {
        //             parts.push(
        //                 `Frequency: ${medicine.frequency}`
        //             );
        //         }

        //         if (medicine.duration.trim()) {
        //             parts.push(
        //                 `Duration: ${medicine.duration.trim()} ${medicine.durationUnit}`
        //             );
        //         }

        //         if (medicine.foodInstruction) {
        //             parts.push(
        //                 `Food: ${medicine.foodInstruction}`
        //             );
        //         }

        //         if (medicine.instructions.trim()) {
        //             parts.push(
        //                 `Instructions: ${medicine.instructions.trim()}`
        //             );
        //         }

        //         return parts.join(' | ');
        //     })
        //     .join('\n');
    };

    // ─────────────────────────────────────────────
    // Build payload matching current DB
    // ─────────────────────────────────────────────

    const buildPayload = (): PrescriptionPayload => {
        /*
         * Current DB:
         *
         * created_at
         * a_id
         * title
         * symptoms
         * diagnosis
         * treatment (kept empty; treatment UI removed)
         * physical_examination
         * drug
         * investigation
         * summary
         *follow_up_date
         *
         * generalInstructions and followUpDate are currently
         * UI-only because your current DB does not have
         * corresponding columns.
         */

        // const combinedTreatment = [
        //     treatment.trim()
        //         ? `Treatment:\n${treatment.trim()}`
        //         : '',
        //     generalInstructions.trim()
        //         ? `General Instructions:\n${generalInstructions.trim()}`
        //         : '',
        //     followUpDate
        //         ? `Follow-up Date: ${followUpDate}`
        //         : '',
        // ]
        //     .filter(Boolean)
        //     .join('\n\n');

        return {
            a_id: appointmentId,
            title: title.trim(),
            symptoms: chiefComplaint.trim(),
            diagnosis: diagnosis.trim(),
            treatment: generalInstructions.trim(),
            physical_examination: clinicalNotes.trim(),
            drug: buildDrugString(),
            investigation: investigation.trim(),
            summary: summary.trim(),
            follow_up_date: followUpDate,
        };
    };

    // ─────────────────────────────────────────────
    // Validation
    // ─────────────────────────────────────────────

    const validatePrescription = () => {
        if (!title.trim()) {
            setError('Prescription title is required.');
            return false;
        }

        if (!chiefComplaint.trim()) {
            setError(
                'Chief complaint / symptoms are required.'
            );
            return false;
        }

        if (!diagnosis.trim()) {
            setError('Diagnosis is required.');
            return false;
        }

        for (let i = 0; i < medicines.length; i++) {
            const medicine = medicines[i];

            if (!medicine.medicineName.trim()) {
                setError(
                    `Medicine name is required for Medicine ${i + 1
                    }.`
                );
                return false;
            }

            if (!medicine.dosage.trim()) {
                setError(
                    `Dosage is required for Medicine ${i + 1
                    }.`
                );
                return false;
            }

            if (!medicine.duration.trim()) {
                setError(
                    `Duration is required for Medicine ${i + 1
                    }.`
                );
                return false;
            }
        }

        setError('');
        return true;
    };

    // ─────────────────────────────────────────────
    // Save draft
    // ─────────────────────────────────────────────

    const handleSaveDraft = () => {
        setError('');

        const payload = buildPayload();

        //call the add prescription API here to save the draft in the backend.

        console.log('Prescription draft:', {
            ...payload,
            status: 'DRAFT',
            patient,
            doctorName,
        });
        setStatus('DRAFT');
        setMessage('Prescription draft prepared successfully.');
    };

    // ─────────────────────────────────────────────
    // Finalize
    // ─────────────────────────────────────────────

    const handleFinalize = () => {
        if (!validatePrescription()) {
            return;
        }

        const confirmed = window.confirm(
            'Once finalized, this prescription should be treated as issued and no longer editable. Continue?'
        );

        if (!confirmed) {
            return;
        }

        const payload = buildPayload();
        //Call the Add Prescription API here for the finalized prescription to be saved in the backend.

        console.log('Prescription finalized:', {
            ...payload,
            status: 'FINALIZED',
            patient,
            doctorName,
            finalizedAt: new Date().toISOString(),
        });

        setStatus('FINALIZED');

        setMessage(
            'Prescription finalized successfully.'
        );
    };

    const isFinalized = status === 'FINALIZED';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 980,
                    maxHeight: '92vh',
                    background: '#fff',
                    borderRadius: 18,
                    border: '1px solid #e2e8f0',
                    boxShadow:
                        '0 20px 60px rgba(15, 23, 42, 0.20)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* ═══════════════════════════════════════
                    HEADER
                ═══════════════════════════════════════ */}

                <div
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 11,
                        }}
                    >
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                background: '#eff6ff',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Pill size={19} />
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#0f172a',
                                }}
                            >
                                Prescription
                            </div>

                            <div
                                style={{
                                    marginTop: 2,
                                    fontSize: 11,
                                    color: '#64748b',
                                }}
                            >
                                Create and issue a prescription
                                for this consultation
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <span
                            style={{
                                padding: '5px 9px',
                                borderRadius: 7,
                                background: isFinalized
                                    ? '#f0fdf4'
                                    : '#eff6ff',
                                color: isFinalized
                                    ? '#15803d'
                                    : '#2563eb',
                                border: `1px solid ${isFinalized
                                        ? '#bbf7d0'
                                        : '#bfdbfe'
                                    }`,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                            }}
                        >
                            {status}
                        </span>

                        <button
                            onClick={onClose}
                            style={{
                                width: 34,
                                height: 34,
                                border:
                                    '1px solid #e2e8f0',
                                borderRadius: 8,
                                background: '#fff',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                            aria-label="Close prescription"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                    BODY
                ═══════════════════════════════════════ */}

                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 20,
                        background: '#f8fafc',
                    }}
                >
                    {/* ═══════════════════════════════════
                        PATIENT / CONSULTATION INFO
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <User
                                size={15}
                                color="#2563eb"
                            />
                            Patient & Consultation
                            Information
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: 12,
                            }}
                        >
                            <InfoBox
                                label="Patient Name"
                                value={
                                    patient?.name ||
                                    'Patient information will be loaded'
                                }
                            />

                            <InfoBox
                                label="Age"
                                value={
                                    patient?.age !==
                                        undefined
                                        ? `${patient.age} years`
                                        : '—'
                                }
                            />

                            <InfoBox
                                label="Gender"
                                value={
                                    patient?.gender || '—'
                                }
                            />

                            <InfoBox
                                label="Patient ID"
                                value={
                                    patient?.patientId ||
                                    '—'
                                }
                            />

                            <InfoBox
                                label="Doctor"
                                value={doctorName}
                            />

                            <InfoBox
                                label="Consultation Date"
                                value={consultationDate}
                            />

                            <InfoBox
                                label="Appointment ID"
                                value={appointmentId}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        PRESCRIPTION INFORMATION
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <FileText
                                size={15}
                                color="#2563eb"
                            />
                            Prescription Information
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Title *
                            </label>

                            <input
                                value={title}
                                disabled={isFinalized}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="e.g. General Consultation"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        CLINICAL ASSESSMENT
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <Stethoscope
                                size={15}
                                color="#2563eb"
                            />
                            Clinical Assessment
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: 14,
                            }}
                        >
                            {/* Chief complaint / symptoms */}

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    Chief Complaint /
                                    Symptoms *
                                </label>

                                <textarea
                                    value={
                                        chiefComplaint
                                    }
                                    onChange={(e) =>
                                        setChiefComplaint(
                                            e.target.value
                                        )
                                    }
                                    disabled={isFinalized}
                                    placeholder="Describe the patient's main complaint and reported symptoms..."
                                    style={{
                                        ...textareaStyle,
                                        height: 76,
                                    }}
                                />
                            </div>

                            {/* Diagnosis */}

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    Diagnosis *
                                </label>

                                <textarea
                                    value={diagnosis}
                                    onChange={(e) =>
                                        setDiagnosis(
                                            e.target.value
                                        )
                                    }
                                    disabled={isFinalized}
                                    placeholder="Enter the clinical diagnosis..."
                                    style={{
                                        ...textareaStyle,
                                        height: 76,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Clinical Notes */}

                        <div
                            style={{
                                ...fieldStyle,
                                marginTop: 14,
                            }}
                        >
                            <label style={labelStyle}>
                                Clinical Notes
                            </label>

                            <textarea
                                value={clinicalNotes}
                                onChange={(e) =>
                                    setClinicalNotes(
                                        e.target.value
                                    )
                                }
                                disabled={isFinalized}
                                placeholder="Record relevant clinical observations, examination findings, vitals, or other notes..."
                                style={{
                                    ...textareaStyle,
                                    height: 78,
                                }}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        MEDICINES
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:
                                    'space-between',
                                marginBottom: 14,
                            }}
                        >
                            <div
                                style={{
                                    ...sectionTitleStyle,
                                    marginBottom: 0,
                                }}
                            >
                                <Pill
                                    size={15}
                                    color="#2563eb"
                                />
                                Medicines
                            </div>

                            {!isFinalized && (
                                <button
                                    onClick={addMedicine}
                                    style={{
                                        height: 32,
                                        padding: '0 10px',
                                        border:
                                            '1px solid #bfdbfe',
                                        borderRadius: 8,
                                        background:
                                            '#eff6ff',
                                        color: '#2563eb',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Plus size={14} />
                                    Add Medicine
                                </button>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                            }}
                        >
                            {medicines.map(
                                (medicine, index) => (
                                    <div
                                        key={medicine.id}
                                        style={{
                                            border:
                                                '1px solid #e2e8f0',
                                            borderRadius: 10,
                                            padding: 14,
                                            background:
                                                '#f8fafc',
                                        }}
                                    >
                                        {/* Medicine heading */}

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems:
                                                    'center',
                                                justifyContent:
                                                    'space-between',
                                                marginBottom: 13,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        'flex',
                                                    alignItems:
                                                        'center',
                                                    gap: 7,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: '#334155',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 22,
                                                        height: 22,
                                                        borderRadius: 6,
                                                        background:
                                                            '#dbeafe',
                                                        color: '#2563eb',
                                                        display:
                                                            'flex',
                                                        alignItems:
                                                            'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {index + 1}
                                                </span>

                                                Medicine{' '}
                                                {index + 1}
                                            </div>

                                            {!isFinalized &&
                                                medicines.length >
                                                1 && (
                                                    <button
                                                        onClick={() =>
                                                            removeMedicine(
                                                                medicine.id
                                                            )
                                                        }
                                                        style={{
                                                            border:
                                                                'none',
                                                            background:
                                                                'transparent',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 4,
                                                            fontSize: 10,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <Trash2
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Remove
                                                    </button>
                                                )}
                                        </div>

                                        {/* Row 1 */}

                                        <div
                                            style={{
                                                display:
                                                    'grid',
                                                gridTemplateColumns:
                                                    '2fr 1fr 1fr',
                                                gap: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Medicine
                                                    Name *
                                                </label>

                                                <input
                                                    value={
                                                        medicine.medicineName
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'medicineName',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="e.g. Paracetamol"
                                                    style={
                                                        inputStyle
                                                    }
                                                />
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Dosage *
                                                </label>

                                                <input
                                                    value={
                                                        medicine.dosage
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'dosage',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="500"
                                                    style={
                                                        inputStyle
                                                    }
                                                />
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Dosage Unit *
                                                </label>

                                                <select
                                                    value={
                                                        medicine.dosageUnit
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'dosageUnit',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        mg
                                                    </option>
                                                    <option>
                                                        g
                                                    </option>
                                                    <option>
                                                        mcg
                                                    </option>
                                                    <option>
                                                        mL
                                                    </option>
                                                    <option>
                                                        IU
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Row 2 */}

                                        <div
                                            style={{
                                                display:
                                                    'grid',
                                                gridTemplateColumns:
                                                    '1fr 1fr 1.4fr',
                                                gap: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Form *
                                                </label>

                                                <select
                                                    value={
                                                        medicine.form
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'form',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        Tablet
                                                    </option>
                                                    <option>
                                                        Capsule
                                                    </option>
                                                    <option>
                                                        Syrup
                                                    </option>
                                                    <option>
                                                        Injection
                                                    </option>
                                                    <option>
                                                        Cream
                                                    </option>
                                                    <option>
                                                        Ointment
                                                    </option>
                                                    <option>
                                                        Drops
                                                    </option>
                                                    <option>
                                                        Inhaler
                                                    </option>
                                                    <option>
                                                        Powder
                                                    </option>
                                                </select>
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Route *
                                                </label>

                                                <select
                                                    value={
                                                        medicine.route
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'route',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        Oral
                                                    </option>
                                                    <option>
                                                        Topical
                                                    </option>
                                                    <option>
                                                        Intravenous
                                                    </option>
                                                    <option>
                                                        Intramuscular
                                                    </option>
                                                    <option>
                                                        Subcutaneous
                                                    </option>
                                                    <option>
                                                        Ophthalmic
                                                    </option>
                                                    <option>
                                                        Nasal
                                                    </option>
                                                    <option>
                                                        Inhalation
                                                    </option>
                                                </select>
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Frequency *
                                                </label>

                                                <select
                                                    value={
                                                        medicine.frequency
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'frequency',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        Once daily
                                                    </option>
                                                    <option>
                                                        Twice daily
                                                    </option>
                                                    <option>
                                                        Three times daily
                                                    </option>
                                                    <option>
                                                        Four times daily
                                                    </option>
                                                    <option>
                                                        Every 4 hours
                                                    </option>
                                                    <option>
                                                        Every 6 hours
                                                    </option>
                                                    <option>
                                                        Every 8 hours
                                                    </option>
                                                    <option>
                                                        Every 12 hours
                                                    </option>
                                                    <option>
                                                        At bedtime
                                                    </option>
                                                    <option>
                                                        As needed
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Row 3 */}

                                        <div
                                            style={{
                                                display:
                                                    'grid',
                                                gridTemplateColumns:
                                                    '1fr 1fr 1.5fr',
                                                gap: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Duration *
                                                </label>

                                                <input
                                                    value={
                                                        medicine.duration
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'duration',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="5"
                                                    style={
                                                        inputStyle
                                                    }
                                                />
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Duration Unit *
                                                </label>

                                                <select
                                                    value={
                                                        medicine.durationUnit
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'durationUnit',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        Days
                                                    </option>
                                                    <option>
                                                        Weeks
                                                    </option>
                                                    <option>
                                                        Months
                                                    </option>
                                                </select>
                                            </div>

                                            <div
                                                style={
                                                    fieldStyle
                                                }
                                            >
                                                <label
                                                    style={
                                                        labelStyle
                                                    }
                                                >
                                                    Food
                                                    Instruction
                                                </label>

                                                <select
                                                    value={
                                                        medicine.foodInstruction
                                                    }
                                                    disabled={
                                                        isFinalized
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'foodInstruction',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={
                                                        inputStyle
                                                    }
                                                >
                                                    <option>
                                                        After food
                                                    </option>
                                                    <option>
                                                        Before food
                                                    </option>
                                                    <option>
                                                        With food
                                                    </option>
                                                    <option>
                                                        Empty stomach
                                                    </option>
                                                    <option>
                                                        Any time
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Medicine instructions */}

                                        <div
                                            style={
                                                fieldStyle
                                            }
                                        >
                                            <label
                                                style={
                                                    labelStyle
                                                }
                                            >
                                                Medicine
                                                Instructions
                                            </label>

                                            <textarea
                                                value={
                                                    medicine.instructions
                                                }
                                                disabled={
                                                    isFinalized
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateMedicine(
                                                        medicine.id,
                                                        'instructions',
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="e.g. Take with a full glass of water..."
                                                style={{
                                                    ...inputStyle,
                                                    height: 60,
                                                    padding:
                                                        '9px 11px',
                                                    resize: 'vertical',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        GENERAL INSTRUCTIONS
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <FileText size={15} color="#2563eb" />
                            General Instructions
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Instructions for Patient
                            </label>

                            <textarea
                                value={generalInstructions}
                                disabled={isFinalized}
                                onChange={(e) =>
                                    setGeneralInstructions(e.target.value)
                                }
                                placeholder="Add advice such as rest, hydration, diet, precautions, or other instructions..."
                                style={{
                                    ...textareaStyle,
                                    height: 82,
                                }}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        INVESTIGATION & FOLLOW-UP
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 14,
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <ClipboardList
                                size={15}
                                color="#2563eb"
                            />
                            Investigations & Follow-up
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    '1fr 280px',
                                gap: 14,
                            }}
                        >
                            {/* Investigation */}

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    Investigations / Lab
                                    Tests Required
                                </label>

                                <textarea
                                    value={investigation}
                                    disabled={isFinalized}
                                    onChange={(e) =>
                                        setInvestigation(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. CBC, blood glucose, lipid profile, X-ray, urine test..."
                                    style={{
                                        ...textareaStyle,
                                        height: 90,
                                    }}
                                />
                            </div>

                            {/* Follow-up date */}

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    Follow-up Date
                                </label>

                                <input
                                    type="date"
                                    value={followUpDate}
                                    disabled={isFinalized}
                                    onChange={(e) =>
                                        setFollowUpDate(
                                            e.target.value
                                        )
                                    }
                                    style={inputStyle}
                                />

                                <div
                                    style={{
                                        marginTop: 7,
                                        fontSize: 10,
                                        color: '#94a3b8',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    Select the recommended
                                    date for the patient's
                                    next consultation.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        SUMMARY
                    ═══════════════════════════════════ */}

                    <div
                        style={{
                            background: '#fff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 4,
                        }}
                    >
                        <div style={sectionTitleStyle}>
                            <FileText
                                size={15}
                                color="#2563eb"
                            />
                            Consultation Summary
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Summary
                            </label>

                            <textarea
                                value={summary}
                                disabled={isFinalized}
                                onChange={(e) =>
                                    setSummary(
                                        e.target.value
                                    )
                                }
                                placeholder="Provide a concise summary of the consultation, diagnosis, treatment plan, and recommendations..."
                                style={{
                                    ...textareaStyle,
                                    height: 88,
                                }}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        ERROR
                    ═══════════════════════════════════ */}

                    {error && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: '10px 12px',
                                borderRadius: 8,
                                border:
                                    '1px solid #fecaca',
                                background: '#fef2f2',
                                color: '#b91c1c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    {/* ═══════════════════════════════════
                        SUCCESS MESSAGE
                    ═══════════════════════════════════ */}

                    {message && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: '10px 12px',
                                borderRadius: 8,
                                border:
                                    '1px solid #bbf7d0',
                                background: '#f0fdf4',
                                color: '#15803d',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            <CheckCircle2 size={14} />
                            {message}
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════
                    FOOTER
                ═══════════════════════════════════════ */}

                <div
                    style={{
                        padding: '13px 20px',
                        borderTop:
                            '1px solid #e2e8f0',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',
                        gap: 10,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            fontSize: 10,
                            color: '#94a3b8',
                        }}
                    >
                        {isFinalized
                            ? 'Prescription has been finalized.'
                            : 'Required fields are marked with *.'}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                height: 36,
                                padding: '0 14px',
                                border:
                                    '1px solid #cbd5e1',
                                borderRadius: 8,
                                background: '#fff',
                                color: '#475569',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>

                        {!isFinalized && (
                            <>
                                <button
                                    onClick={
                                        handleSaveDraft
                                    }
                                    style={{
                                        height: 36,
                                        padding: '0 14px',
                                        border:
                                            '1px solid #bfdbfe',
                                        borderRadius: 8,
                                        background:
                                            '#eff6ff',
                                        color: '#2563eb',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems:
                                            'center',
                                        gap: 6,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Save size={14} />
                                    Save Draft
                                </button>

                                <button
                                    onClick={
                                        handleFinalize
                                    }
                                    style={{
                                        height: 36,
                                        padding: '0 16px',
                                        border:
                                            '1px solid #2563eb',
                                        borderRadius: 8,
                                        background:
                                            '#2563eb',
                                        color: '#fff',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems:
                                            'center',
                                        gap: 6,
                                        cursor: 'pointer',
                                        boxShadow:
                                            '0 2px 5px rgba(37, 99, 235, 0.18)',
                                    }}
                                >
                                    <CheckCircle2
                                        size={14}
                                    />
                                    Finalize Prescription
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═════════════════════════════════════════════════
   READ-ONLY INFORMATION BOX
═════════════════════════════════════════════════ */

function InfoBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                padding: '9px 10px',
                borderRadius: 8,
                background: '#f8fafc',
                border:
                    '1px solid #e2e8f0',
            }}
        >
            <div
                style={{
                    fontSize: 9,
                    color: '#94a3b8',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 11,
                    color: '#334155',
                    fontWeight: 600,
                    wordBreak: 'break-word',
                }}
            >
                {value}
            </div>
        </div>
    );
}