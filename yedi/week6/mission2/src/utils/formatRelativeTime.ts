// src/utils/formatRelativeTime.ts

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  // KST (UTC+9)를 고려하여 현재 시간에서 9시간(ms)을 빼줍니다.
  // (참고: 서버 시간이 UTC 표준시(Z)로 오기 때문에 필요)
  const diff = now.getTime() - date.getTime() - (9 * 60 * 60 * 1000);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  if (seconds < 10) return `방금 전`;

  return `${seconds}초 전`;
}