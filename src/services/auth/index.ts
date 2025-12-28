import { api } from '@/lib/apiClient';
import { AxiosResponse } from 'axios';
import {
  RegisterRequest,
  LoginRequest,
  OTPRequest,
  ResendOTPRequest,
  AuthResponse,
  APIResponse,
} from './interfaces';
import Cookies from 'js-cookie';

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with registration response
 */
export const registerUser = async (userData: RegisterRequest): Promise<APIResponse<AuthResponse>> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.POST('/v1/auth/register', userData);

    return {
      message: response.data.message,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || error.message || 'Registration failed',
      status: error.response?.status || 500,
      error: error.message,
    };
  }
};

/**
 * Login user with email and password
 * @param credentials - User login credentials
 * @returns Promise with login response
 */
export const loginUser = async (credentials: LoginRequest): Promise<APIResponse<AuthResponse>> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.POST('/v1/auth/login', credentials);

    return {
      message: response.data.message,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    const status = error.response?.status;

    return {
      message: error.response?.data?.message || error.message || 'Login failed',
      status: status || 500,
      error: error.message,
    };
  }
};

/**
 * Validate OTP for email verification
 * @param otpData - Email and OTP code
 * @returns Promise with validation response
 */
export const verifyOTP = async (otpData: OTPRequest): Promise<APIResponse<AuthResponse>> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.POST(
      '/v1/auth/verify-email',
      otpData
    );

    return {
      message: response.data.message,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || error.message || 'OTP validation failed',
      status: error.response?.status || 500,
      error: error.message,
    };
  }
};

/**
 * Resend OTP to user's email
 * @param email - User's email address
 * @returns Promise with resend response
 */
export const resendOTPCode = async (email: string): Promise<APIResponse<AuthResponse>> => {
  try {
    const requestData: ResendOTPRequest = { email };

    const response: AxiosResponse<AuthResponse> = await api.POST(
      '/api/v1/auth/resend-otp',
      requestData
    );

    return {
      message: response.data.message,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || error.message || 'Failed to resend OTP',
      status: error.response?.status || 500,
      error: error.message,
    };
  }
};

export const logout = (): void => {
  Cookies.remove('serviceToken');
  localStorage.clear();
  location.reload();
}

// Legacy Support - Export individual functions for backward compatibility
export {
  registerUser as UserRegisterHandler,
  loginUser as UserLoginHandler,
  verifyOTP as validateOTP,
  resendOTPCode as resendOTP,
};
