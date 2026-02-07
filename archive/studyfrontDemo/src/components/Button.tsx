type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
};

function Button({ children, onClick, type = "button", disabled }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: "8px 12px",
                margin: "4px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: disabled ? "not-allowed" : "pointer"
            }}
        >
            {children}
        </button>
    )
}

export default Button;