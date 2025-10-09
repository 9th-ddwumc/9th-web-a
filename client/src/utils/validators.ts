export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const hasNum = (v: string) => /\d/.test(v);
export const hasLetter = (v: string) => /[a-zA-Z]/.test(v);
export const hasSpecial = (v: string) => /[^a-zA-Z0-9]/.test(v);

export const passwordStrength = (v: string) => {
  let score = 0;
  if (v.length >= 8) score++;
  if (hasLetter(v)) score++;
  if (hasNum(v)) score++;
  if (hasSpecial(v)) score++;
  return score; // 0~4
};
