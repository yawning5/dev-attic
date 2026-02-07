import { useState } from "react";
import { postBoard } from "../api/board";
import type { BoardWriteInput } from "../types/Board";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import Input from "../components/Input";

function BoardWritePage() {
    const [form, setForm] = useState<BoardWriteInput>({
        title: "",
        content: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await postBoard(form);
            console.log("게시글 작성 성공:", response);
            // Redirect or show success message
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            // Show error message
        }
    };

    return (
        <div>
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="제목"
                /><br />
                <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="내용"
                /><br />
                <Button type="submit">작성</Button>
            </form>
        </div>
    );
}
export default BoardWritePage;