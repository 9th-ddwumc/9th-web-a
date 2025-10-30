// src/api/auth.ts

import { z } from 'zod';

// Signup.tsx에서 사용하는 Zod 스키마와 타입을 가져옵니다.
// (실제로는 별도 types 파일로 분리하는 것이 좋습니다.)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginForm = z.infer<typeof loginSchema>;

interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

// --- Mock API 함수 ---

/**
 * (가상) 로그인 API
 * localStorage의 'userData'와 일치하면 가짜 토큰을 발급합니다.
 */
export const postLogin = (loginData: LoginForm): Promise<{ accessToken: string }> => {
  return new Promise((resolve, reject) => {
    // 0.1초 뒤에 서버가 응답한 것처럼 시뮬레이션
    setTimeout(() => {
      // 1. 로컬 스토리지에서 'DB' 역할을 하는 userData를 가져옵니다.
      const storedData = window.localStorage.getItem('userData');
      if (!storedData) {
        return reject(new Error('등록된 사용자가 없습니다.'));
      }

      const userData: SignupData = JSON.parse(storedData);

      // 2. 이메일과 비밀번호가 일치하는지 확인
      if (userData.email === loginData.email && userData.password === loginData.password) {
        // 3. 일치하면 가짜 토큰 발급
        const fakeAccessToken = `fake-token-for-${userData.nickname}-${Date.now()}`;
        console.log('Mock API: 로그인 성공, 토큰 발급:', fakeAccessToken);
        resolve({ accessToken: fakeAccessToken });
      } else {
        // 4. 불일치 시 에러
        reject(new Error('이메일 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 100);
  });
};

/**
 * (가상) 로그아웃 API
 * 서버에 토큰을 무효화하라고 알리는 함수입니다. (지금은 비어있음)
 */
export const postLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock API: 서버 로그아웃 처리됨');
      resolve();
    }, 100);
  });
};