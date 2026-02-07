import axios from "axios"
import type { CommentPostInput } from "../types/Comment";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const postComment = async (
    boardId: number,
    data: CommentPostInput
): Promise<void> => {
    await axios.post(`${BASE_URL}/board/${boardId}/comment`, data);
};