import axios from "axios";
import type { MemberInfo } from "../types/Member";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMyInfo = async (): Promise<MemberInfo> => {
    const response = await axios.get(`${BASE_URL}/member/my`);
    return response.data;
}