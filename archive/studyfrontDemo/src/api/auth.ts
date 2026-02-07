import axios from "axios";
import type { LoginInput, JwtResponse } from "../types/Auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (data: LoginInput): Promise<JwtResponse> => {
    const response = await axios.post<JwtResponse>(`${BASE_URL}/login`, data);
    return response.data;
};

export const setAuthToken = (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}