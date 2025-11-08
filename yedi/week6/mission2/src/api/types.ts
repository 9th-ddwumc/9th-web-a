interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
  author?: User; 
}

export type LpDetailResponse = ApiResponse<Lp>;

export type LpListResponse = ApiResponse<{
  data: Lp[];
  nextCursor: number;
  hasNext: boolean;
}>;

export type UserDetailResponse = ApiResponse<User>;

export interface LpCreateForm {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export type LpCreateResponse = ApiResponse<Lp>;

export interface UserUpdateForm {
  name?: string;
  bio?: string;
  avatar?: string;
}

export type UserUpdateResponse = ApiResponse<User>;

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: User; 
}

export type CommentListResponse = ApiResponse<{
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
}>;

export interface CommentCreateForm {
  content: string;
}

export type CommentResponse = ApiResponse<Comment>;

export interface CommentUpdateForm {
  content: string;
}

export type CommentDeleteResponse = ApiResponse<{
  message: string;
}>;