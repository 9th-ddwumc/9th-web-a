import { z } from 'zod';
import { apiClient } from './apiClient';

export type SignupForm = {
  name: string;
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginForm = z.infer<typeof loginSchema>;



// 회원가입 API 
export const postSignup = async (signupData: SignupForm) => {
  const response = await apiClient.post('/v1/auth/signup', signupData);
  return response.data;
};


// 로그인 API 
export const postLogin = async (loginData: LoginForm): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await apiClient.post('/v1/auth/signin', loginData);
  return response.data.data; 
};


// 토큰 인증 테스트 API
export const getUserInfo = () => {
  return apiClient.get('/v1/auth/protected'); 
};


// 로그아웃 API
export const postLogout = (): Promise<void> => {
  return apiClient.post('/v1/auth/signout'); 
};