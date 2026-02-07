import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "2rem",
                fontFamily: "sans-serif",
            }}
        >
            {children}
        </div>
    );
};

export default Layout;