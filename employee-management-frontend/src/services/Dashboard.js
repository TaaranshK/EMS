import { API_BASE_URL } from "../config/api";

import { getStoredToken } from "../utils/authStorage";

const BASE_URL = API_BASE_URL;

const getToken = () => getStoredToken();

const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const throwIfNotOk = async (res) => {
  if (res.ok) return;

  let details = "";
  try {
    details = await res.text();
  } catch {
    // ignore
  }

  const error = new Error(`Request failed (${res.status})${details ? `: ${details}` : ""}`);
  error.status = res.status;
  throw error;
};

export const getDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const getEmployees = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/employees?${query}`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const getEmployeeById = async (id) => {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const inviteSingleEmployee = async (data) => {
  const res = await fetch(`${BASE_URL}/invite/single`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const inviteBulkEmployees = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/invite/bulk`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  await throwIfNotOk(res);
  return res.json();
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const updateEmployee = async (id, data) => {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const getOnboardingTasksByEmployee = async (employeeId) => {
  const res = await fetch(`${BASE_URL}/onboarding-tasks/employee/${employeeId}`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const scheduleMeeting = async (payload) => {
  const res = await fetch(`${BASE_URL}/onboarding-tasks/schedule-meeting`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const getMeetingsForDate = async (date) => {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const res = await fetch(`${BASE_URL}/onboarding-tasks/meetings${query}`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const getRecentMeetings = async (take = 10) => {
  const res = await fetch(`${BASE_URL}/onboarding-tasks/meetings/recent?take=${take}`, {
    headers: getHeaders(),
  });
  await throwIfNotOk(res);
  return res.json();
};
