import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//adding type safety
interface Props {
    appointmentId: number;

}

const Payment = ({appointmentId} : Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const navigate = useNavigate();

    const handlePayment = async() => {
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage(null);

        try {
            //get client_secret from backend
            const response = await api.post(`/appointments/${appointmentId}/create-payment-intent`);

            const clientSecret = response.data.client_secret;

            //confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method:{
                    card: elements.getElement(CardElement)!,
                },
            });

            if(result.error){
                setMessage(result.error.message || "Payment failed");
                setStatus("error");
            } else if (result.paymentIntent?.status === "succeeded"){
                setStatus("success");
                setMessage("Payment Successful!!!");

                //auto-redirect
                setTimeout(() => {
                    navigate('/gallery', {replace: true});
                }, 2000);
                }
            }
         catch (error){
            if(axios.isAxiosError(error)){
                setMessage("Payment Error");
                setStatus("error");
            }
            
        }finally {
            setLoading(false);
        }

    };

    //Success UI
    if(status === "success"){
        return (
            <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto text-center">
                <h2 className='text-2xl font-bold mb-2'>Payment Successful</h2>
                <p className='text-gray-600 mb-4'>
                     Your appointment is confirmed.
                </p>
                <button
                onClick={() => navigate('/gallery', {replace:true})}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg"
                >
                    Back to gallery
                </button>

            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            {/*  Close Button  */}
            <button
            onClick={() => navigate('/gallery')}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
                ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

            <div className="border p-3 rounded mb-4">
                <CardElement />
            </div>

            <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-brand-primary text-white py-2 rounded"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>

            {status == "error" && message && (
                <p className="mt-4 text-center text-sm">{message}</p>
            )}

        </div>
    );
};

export default Payment;