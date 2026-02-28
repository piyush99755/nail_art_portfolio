import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { useState } from 'react';
import axios from 'axios';

//adding type safety
interface Props {
    appointmentId: number;

}

const Payment = ({appointmentId} : Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handlePayment = async() => {
        if (!stripe || !elements) return;

        setLoading(true);

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
            } else {
                if(result.paymentIntent?.status === "succeeded"){
                    setMessage("Payment Successful!!!");
                }
            }
        }catch (error){
            if(axios.isAxiosError(error)){
                setMessage("Payment Error");
            }
            
        }finally {
            setLoading(false);
        }

    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

            <div className="border p-3 rounded mb-4">
                <CardElement />
            </div>

            <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>

            {message && (
                <p className="mt-4 text-center text-sm">{message}</p>
            )}

        </div>
    );
};

export default Payment;