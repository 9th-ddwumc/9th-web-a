import { z } from 'zod';
import { apiClient } from './apiClient';
import type {
  UserUpdateForm,
  UserUpdateResponse,
  UserDetailResponse, 
} from './types';

export type SignupForm = {
  name: string;
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginForm = z.infer<typeof loginSchema>;

export interface AuthResponse {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

// 회원가입 API 
export const postSignup = async (signupData: SignupForm) => {
  const response = await apiClient.post('/v1/auth/signup', signupData);
  return response.data;
};

// 로그인 API 
export const postLogin = async (loginData: LoginForm): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/auth/signin', loginData);
  return response.data.data;
};

// 로그아웃 API 
export const postLogout = (): Promise<void> => {
  return apiClient.post('/v1/auth/signout');
};

// 유저 정보 수정 API 
export const patchUser = async (
  userData: UserUpdateForm,
): Promise<UserUpdateResponse> => {
  const response = await apiClient.patch<UserUpdateResponse>(
    '/v1/users',
    userData,
  );
  return response.data;
};

export const getUserInfo = () => {
  return apiClient.get<UserDetailResponse>('/v1/users/me');
};

// 회원 탈퇴 API
export const deleteUser = async (): Promise<void> => {
  await apiClient.delete('/v1/users');
};