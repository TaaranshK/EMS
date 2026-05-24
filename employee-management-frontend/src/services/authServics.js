//Doing The API Calls  For all The Authentication


import { API_BASE_URL } from "../config/api";

const BASE_URL = `${API_BASE_URL}/auth`;


// async keyword will work before a function so that the function will work asynchrounously
// await pauses the function until async task finishes
export const loginEmployee = async (FormData) => {
    const response = await fetch(`${BASE_URL}/employee-login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(FormData),
    });
    return response; 
};

export const loginSuperAdmin = async (FormData) => {
    const response = await fetch(`${BASE_URL}/superadmin-login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(FormData),
    });
    return response;
}

export const changePassword = async (formData) => {
    const response = await fetch(`${BASE_URL}/change-password`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
    });
    return response;
};
