export const TOKEN_KEY = "accessToken";
export const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveSession = (accessToken: string, user: unknown) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
