type inputProps = {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
};

function Input({ name, value, onChange, placeholder, type = "text" }: inputProps) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                padding: "8px",
                margin: "4px 0",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
            }}
        />
    );
}

export default Input;