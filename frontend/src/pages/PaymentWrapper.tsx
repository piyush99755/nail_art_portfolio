import { useParams } from "react-router-dom";
import Payment from "./Payment";

const PaymentWrapper = () => {
    const {id} = useParams(); //read dynamic values from url

    if (!id) return <div>Invalid Appointment</div>
    return (
        <div className="fixed-inset-0 flex-items-center justify-center bg-black bg-opacity-50">
            <Payment appointmentId={Number(id)} />
        </div>
    ) 
};

export default PaymentWrapper;