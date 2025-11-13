// src/api/lps.ts
import { apiClient } from './apiClient';
import type {
  LpListResponse,
  LpDetailResponse,
  LpCreateForm,
  LpCreateResponse,
  CommentListResponse,
  CommentCreateForm,
  CommentResponse,
  CommentUpdateForm,
  CommentDeleteResponse,
  LpUpdateForm,
  LpUpdateResponse,
  ImageUploadResponse,
} from './types';

export type SortOrder = 'asc' | 'desc';

interface GetLpsParams {
  order: SortOrder;
  search?: string;
  pageParam?: number;
}

export const getLpsList = async ({ order, pageParam }: GetLpsParams) => {
  const response = await apiClient.get<LpListResponse>('/v1/lps', {
    params: {
      order,
      cursor: pageParam,
      limit: 8,
    },
  });
  return response.data;
};

export const getLpById = async (lpid: string) => {
  const response = await apiClient.get<LpDetailResponse>(`/v1/lps/${lpid}`);
  return response.data;
};
export const deleteLpById = async (lpid: string) => {
  const response = await apiClient.delete(`/v1/lps/${lpid}`);
  return response.data;
};
export const createLp = async (
  lpData: LpCreateForm,
): Promise<LpCreateResponse> => {
  const response = await apiClient.post<LpCreateResponse>('/v1/lps', lpData);
  return response.data;
};


 // LP 수정 API
export const updateLp = async ({
  lpid,
  lpData,
}: {
  lpid: string;
  lpData: LpUpdateForm;
}): Promise<LpUpdateResponse> => {
  const response = await apiClient.patch<LpUpdateResponse>(
    `/v1/lps/${lpid}`,
    lpData,
  );
  return response.data;
};


// 이미지 업로드 API 
export const uploadImage = async (
  file: File,
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ImageUploadResponse>(
    '/v1/uploads/public', // 비인증 업로드 엔드포인트 사용
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

//댓글 관련 API
export const getLpComments = async ({
  lpid,
  order,
  pageParam,
}: {
  lpid: string;
  order: SortOrder;
  pageParam?: number;
}) => {
  const response = await apiClient.get<CommentListResponse>(
    `/v1/lps/${lpid}/comments`,
    {
      params: {
        order,
        cursor: pageParam,
        limit: 4,
      },
    },
  );
  return response.data;
};

export const createLpComment = async ({
  lpid,
  content,
}: {
  lpid: string;
  content: string;
}) => {
  const response = await apiClient.post<CommentResponse>(
    `/v1/lps/${lpid}/comments`,
    { content },
  );
  return response.data;
};

export const updateLpComment = async ({
  lpid,
  commentId,
  content,
}: {
  lpid: string;
  commentId: number;
  content: string;
}) => {
  const response = await apiClient.patch<CommentResponse>(
    `/v1/lps/${lpid}/comments/${commentId}`,
    { content },
  );
  return response.data;
};

export const deleteLpComment = async ({
  lpid,
  commentId,
}: {
  lpid: string;
  commentId: number;
}) => {
  const response = await apiClient.delete<CommentDeleteResponse>(
    `/v1/lps/${lpid}/comments/${commentId}`,
  );
  return response.data;
};