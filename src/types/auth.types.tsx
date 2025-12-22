import { UserRole } from "./roles.types";

export interface RegisterDto{
    email:string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginDto{
    email:string;
    password: string;
}

export interface AuthResponseDto{
    id:string;
    email: string;  
    firstName:string;
    lastName:string;
    role : UserRole;
    token:string;
}


