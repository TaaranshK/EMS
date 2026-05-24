export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return (
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload.role ??
    null
  );
}

