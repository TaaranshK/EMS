import { getRoleFromToken } from "./jwt";

export function getStoredToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (token === "undefined" || token === "null") return null;
  // very light sanity check for JWT-like string
  if (token.split(".").length !== 3) return null;
  return token;
}

export function getStoredRole() {
  const storedRole = localStorage.getItem("role");
  if (storedRole) return storedRole;

  const token = getStoredToken();
  const tokenRole = token ? getRoleFromToken(token) : null;

  if (tokenRole) {
    localStorage.setItem("role", tokenRole);
  }

  return tokenRole;
}

export function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
