// src/hooks/useUploadImage.ts
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../api/lps';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
      alert(`이미지 업로드에 실패했습니다: ${error.message}`);
    },
  });
};