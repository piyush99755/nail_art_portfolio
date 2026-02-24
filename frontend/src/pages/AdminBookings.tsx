import {useState, useEffect} from "react";
import api from '../api/axios';
import type { Appointment } from "../types";

const AdminBookings = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchAppointments = async() => {
        const response = await api.get('/appointments/');
        setAppointments(response.data);
    };

    fetchAppointments();

    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                All Appointments
            </h2>
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Client</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="border-t">
                                <td className="p-4">
                                    {appt.client_name}
                                    <div className="text-sm text-gray-500">
                                        {appt.client_email}
                                    </div>
                                </td>
                                <td className="p-4">{appt.service_type}</td>
                                <td className="p-4">{appt.appointment_date}</td>
                                <td className="p-4">{appt.appointment_time}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-yellow-200 rounded-full text-sm">
                                        {appt.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
