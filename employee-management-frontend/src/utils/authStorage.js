export function getStoredToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (token === "undefined" || token === "null") return null;
  // very light sanity check for JWT-like string
  if (token.split(".").length !== 3) return null;
  return token;
}

export function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

