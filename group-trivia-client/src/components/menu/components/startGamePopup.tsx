import React from 'react';

interface StartGamePopupProps {
    playerName: string;
    handlePlayerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClose: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const StartGamePopup: React.FC<StartGamePopupProps> = ({ playerName, handlePlayerNameChange, handleClose, handleSubmit }) => {
    return (
        <div className="popup-backdrop">
            <div className="popup">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={playerName}
                        onChange={handlePlayerNameChange}
                        required
                        autoComplete='off'
                        minLength={3}
                        maxLength={18}
                    />
                    <div className="popup-buttons">
                        <button type="button" className="popup-button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="popup-button"
                            disabled={!playerName || playerName.length < 3 || /\s/.test(playerName)}
                        >
                            Start Game
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StartGamePopup;