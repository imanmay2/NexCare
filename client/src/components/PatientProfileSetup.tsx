import React, { useState } from "react";
import axios from "axios";

interface FirstTimeProfileModalProps {
    open: boolean;
    onClose: () => void;
}

export default function FirstTimeProfileModal({
    open,
    onClose,
}: FirstTimeProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        phn_no: "",
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(
                "http://localhost:8090/patient/updatePatientProfile",
                formData,
                {
                    withCredentials: true,
                }
            );
            console.log(response.data);
            setLoading(false);
            onClose();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-[95%] max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Complete Profile
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Please enter your details to continue
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Age */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Age
                        </label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" required

                        />
                    </div>
                    {/* Gender */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phn_no"
                            placeholder="Enter phone number"
                            value={formData.phn_no}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" required
                        />
                    </div>
                    {/* Button */}
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 rounded-xl mt-4"
                    >
                        {
                            loading
                                ? "Saving..."
                                : "Save Details"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}