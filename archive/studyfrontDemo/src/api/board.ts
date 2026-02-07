import axios from "axios"; 
import type { Board } from "../types/Board";   
import type { BoardWriteInput } from "../types/Board";

const BASE_URL = "http://localhost:8080";

export const fetchBoards = async (): Promise<Board[]> => {
    const response = await axios.get(`${BASE_URL}/board`);
    return response.data;
};

export const fetchBoardById = async (id: number): Promise<Board> => {
    const response = await axios.get(`${BASE_URL}/board/${id}`);
    return response.data;
};

export async function postBoard(data: BoardWriteInput): Promise<Board> {
    const response = await axios.post(`${BASE_URL}/board`, data);
    return response.data;
};

export const patchBoard = async (id: number, data: BoardWriteInput): Promise<void> => {
    await axios.patch(`${BASE_URL}/board/${id}`, data);
};

export const deleteBoard = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/board/${id}`);
};