import { useParams } from "react-router-dom";
import Payment from "./Payment";

const PaymentWrapper = () => {
    const {id} = useParams(); //read dynamic values from url

    if (!id) return <div>Invalid Appointment</div>
    return <Payment appointmentId={Number(id)} />;
};

export default PaymentWrapper;