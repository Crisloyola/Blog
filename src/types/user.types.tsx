
import type { UserRole } from "./roles.types";

export interface User{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}