import { Role } from "@prisma/client";

export interface CreateUserInput {
    id: string;
    name: string;
    email: string;
    password: string;
    image?: string;
    role: Role;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }