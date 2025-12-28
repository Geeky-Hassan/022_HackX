import { UserType } from "@/types";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  [key: string]: any; // Allow additional fields
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export type User = UserType;

export interface AuthResponse {
  message: string;
  status: number;
  token?: string;
  user?: User;
  data?: any;
}

export interface APIResponse<T = any> {
  message: string;
  status: number;
  data?: T;
  error?: string;
}