import type { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

 interface Props {
    children: ReactNode;
 }

 const StripeProvider = ({children}: Props) => {
    return <Elements stripe={stripePromise}>{children}</Elements>

 }

 export default StripeProvider;