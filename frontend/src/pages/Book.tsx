import { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';



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

    const [service, setService] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    //handle appointment form submit
    const handleSubmit = async() => {
        //check all required fields have value
        if (!service || !date || !timeSlot || !name || !email || !phone){
            setMessage("Please fill in fields")
            return;
        }
        setLoading(true);
        setMessage(null);

        try {
            //convert "10:00Am" to 24-hours format
            const [time, modifier] = timeSlot.split(' ');
            const [rawHours, minutes] = time.split(':').map(Number);
            let hours = rawHours;

            if(modifier === 'PM' && hours !== 12) hours += 12;
            if(modifier === 'AM' && hours === 12) hours = 0;

            const formattedTime = `${hours.toString().padStart(2,"0")}:${minutes
                .toString()
                .padStart(2,"0")}:00`; 

            await api.post('/appointments/',{
                client_name:name,
                client_email:email,
                phone,
                service_type:service,
                appointment_date:date,
                appointment_time:formattedTime,
            });

            //setting up states once booked successfully (setting back to empty field)
            setMessage("Congrats,Appointment booked successfully!!!");
            setService("");
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

    return (
        <div className='max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md'>
            <h2 className='text-3xl font-bold mb-6 text-center'>
                Book an Appointment
            </h2>
            {/* Form will go here */}
            {/* Service dropdown */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Service</label>
                <select 
                    value={service}
                    onChange = {(e) => setService(e.target.value)}
                    className='w-full border-rounded-lg px-4 py-2'
                >
                    <option value="">Choose a serivce</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Gel Extention">Gel Extention</option>
                    <option value="Minimal Art">Minimal Art</option>
                    <option value="Custom Design">Custom Design</option>
                </select>
            </div>
            {/* Date picker */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Date</label>
                <input 
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setDate(e.target.value)}
                    className='w-full border-rounded-lg px-4 py-2'
                />
            </div>

            {/* render time slots */}
            <div className='mb-6'>
                <label className='block mb-2 font-medium'>Select Time</label>
                <div className='grid grid-cols-3 gap-3'>
                    {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`py-2 rounded-lg border ${
                                timeSlot === slot
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`
                            }
                        >
                            {slot}

                        </button>
                    ))}
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
            className='w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition'
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