export type UserRole = "admin" | "user";

export type User = {
    id: string;
    email: string;
    password?: string; 
    name: string;
    role: UserRole; 
    permissions: string[]; 
    createdAt: string; 
    updatedAt: string; 
  };