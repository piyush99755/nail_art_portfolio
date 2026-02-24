//frontend-backend alignment 
//it defines shape of an object
export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface NailArt {
    id:number;
    title:string;
    description: string;
    category: string;
    image_url:string;
    created_at:string;
}

export interface Appointment {
    id: number,
    client_name: string,
    client_email: string,
    phone: string,
    service_type: string,
    appointment_date:string,
    appointment_time:string,
    status:string
}