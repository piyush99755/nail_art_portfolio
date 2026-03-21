import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import axios from 'axios';
import {  useNavigate, useLocation } from 'react-router-dom';
import type { Service } from '../types';



const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];


const Book = () => {

    //state management
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [services, setServices] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState<number | null>(null);

    const [date, setDate] = useState<string>("");
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [bookedSlots, setBookedSlots] = useState<string[]>([])

    const navigate = useNavigate();
    const location = useLocation();

    const selectedServiceId = location.state?.selectedServiceId;
    const selectedNail = location.state?.selectedNail;

    //fetch services on load
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get<Service[]>('/services/');
                setServices(response.data);
            }catch(error){
                console.error("Failed to fetch services", error);
            }

        };
        fetchServices();
    },[])

    useEffect(() => {
        if (selectedServiceId) {
            setServiceId(selectedServiceId);
        }
    }, [selectedServiceId]);

    //making function reference stable by using useCallback hook
    const fetchBookedSlots = useCallback(async (selectedDate: string) => {

            try {
                const response =  await api.get<string[]>(
                    `/appointments/booked-slots/${selectedDate}`
                );
                setBookedSlots(response.data);
            } catch(error) {
                console.error(`Failed to fetch booked slot for ${selectedDate}`, error)
            }
        }, []);

    //useEffect books to handle booked slots...
    useEffect(() => {
        if(date) fetchBookedSlots(date);
    }, [date, fetchBookedSlots]);

    //convert slot to 24hours for comparison
    const convertTo24Hour = (slot:string) => {
        if(!slot) return "";

        const parts = slot.split(' ');
        if(parts.length !== 2) return "";
        
        const [time, modifier] = parts;

        const timeParts = time.split(":");
        if(timeParts.length !== 2) return "";

        const [rawHours, minutes] = timeParts.map(Number); //convert time to number
        let hours = rawHours;

        if(modifier === "PM" && hours !== 12) hours += 12;
        if(modifier === "AM" && hours === 12) hours = 0;

        return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:00`;

    };

    //format current time slot to 24 hours format.. 
    const formattedTime = convertTo24Hour(timeSlot); 
    

    //handle appointment form submit
    const handleSubmit = async() => {
        //check all required fields have value
        if (!serviceId || !date || !timeSlot || !name || !email || !phone){
            setMessage("Please fill in fields")
            return;
        }
        setLoading(true);
        setMessage(null);

        try {
            
            
            const response = await api.post('/appointments/',{
                client_name:name,
                client_email:email,
                phone,
                service_id:serviceId,
                appointment_date:date,
                appointment_time:formattedTime,
            });

            const appointmentId = response.data.id;

            //redirect to payment page
            navigate(`/payment/${appointmentId}`)

            //setting up states once booked successfully (setting back to empty field)
            
            await fetchBookedSlots(date);
            setServiceId(null);
            setTimeSlot("");
            setDate("");
            setName("");
            setEmail("");
            setPhone("");
        }catch(error){
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.detail || "Something went wrong");
            } else {
                setMessage("Something went wrong");
            }
            
        }
        finally{
            setLoading(false);
        }
    
    };
 
    const selectedService = services.find(
        (service) => service.id === serviceId
    );

    return (
        <div className='relative max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md'>
            {/*  close button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
                ✕
            </button>
            
            <h2 className='text-3xl font-bold mb-6 text-center'>
                Book an Appointment
            </h2>
            {/* Show selected Nail preview */}
            {selectedNail && (
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Selected Style:</p>
                    <img
                    src={selectedNail.image_url}
                    alt={selectedNail.title}
                    className="w-32 h-32 object-cover rounded-lg shadow"
                    />
                    <p className="text-sm mt-2 font-medium">
                    {selectedNail.title}
                    </p>
                </div>
            )}
            {/* Form will go here */}
            {/* Service dropdown */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Service</label>
                <select 
                    value={serviceId ?? ""}
                    onChange = {(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
                    className='w-full border rounded-lg px-4 py-2'
                >
                    <option value="">Choose a Service</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name} -{" "}
                            {new Intl.NumberFormat("en-CA",{
                                style:"currency",
                                currency:"CAD"
                            }).format(service.price/100)}

                        </option>

                    ))}
                    
                </select>
                {selectedService && (
                    <p className="mt-2 font-semibold text-pink-600">
                        Total:{" "}
                        {new Intl.NumberFormat("en-CA", {
                            style:"currency",
                            currency:"CAD"

                        }).format(selectedService.price /100)}
                    </p>
                )}
            </div>
            {/* Date picker */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Date</label>
                <input 
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setDate(e.target.value)}
                    className='w-full border rounded-lg px-4 py-2'
                />
            </div>

            {/* render time slots */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Time</label>
                <div className='grid grid-cols-3 gap-3'>
                    {timeSlots.map((slot) => {
                        const formatted = convertTo24Hour(slot);
                        const isBooked = bookedSlots.includes(formatted);
                        return <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setTimeSlot(slot)}
                            //booked slots are visibly disabled..
                            className={`py-2 rounded-lg border ${
                                isBooked
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                :  timeSlot===slot
                                ? "bg-brand-primary text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`
                            }
                        >
                            {slot}

                        </button>
                    })}
                </div>

            </div>
            
            {/* contact details section*/}
            <div className='mb-4'>
                <input 
                type="text"
                placeholder='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full border rounded-lg px-4 py-2 mb-3' 
                />

                <input 
                type="text"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className='w-full border rounded-lg px-4 py-2 mb-3'
                />

                <input 
                type="tel"
                placeholder='Phone Number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
                className='w-full border rounded-lg px-4 py-2 mb-3'
                />
            </div>
            
            {/* submit button*/}
            <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full bg-brand-primary text-white py-3 rounded-lg hover:bg-black transition disabled:opacity-50'
            >
               {loading ? 'Booking...' : 'Confirm Booking'}
            </button>

            {message && (
                <p className='mt-4 text-center text-sm text-gray-700'>
                    {message}
                </p>
            )}


        </div>
    )
}

export default Book;