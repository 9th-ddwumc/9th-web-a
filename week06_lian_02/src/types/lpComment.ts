export interface LpComment {  // Comment -> LpComment로 변경
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CommentsResponse {
  data: LpComment[];
  nextCursor: number | null;
  hasNext: boolean;
}