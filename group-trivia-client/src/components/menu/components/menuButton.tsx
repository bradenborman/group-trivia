import React from 'react';

interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children }) => {
    return (
        <button className="menu-button" onClick={onClick}>
            {children}
        </button>
    );
};

export default MenuButton;