//frontend-backend alignment 
//it defines shape of an object
export interface  LoginResponse {
    access_token: string;
    token_type: string;
}

export interface NailArt {
    id:number;
    title:string;
    description: string;
    catgory: string;
    image_url:string;
    created_at:string;
}