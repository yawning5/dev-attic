type TextareaProps = {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
}

function Textarea({ name, value, onChange, placeholder, rows = 4 }: TextareaProps) {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            style={{
                padding: "8px",
                margin: "4px 0",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical"
            }}
        />
    );
} 

export default Textarea;
