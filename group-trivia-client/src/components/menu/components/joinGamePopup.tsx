import React from 'react';

interface JoinGamePopupProps {
    joinGameData: { gameCode: string, displayName: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClose: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const JoinGamePopup: React.FC<JoinGamePopupProps> = ({ joinGameData, handleChange, handleClose, handleSubmit }) => {
    return (
        <div className="popup-backdrop">
            <div className="popup">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="gameCode"
                        placeholder="Game Code"
                        value={joinGameData.gameCode}
                        onChange={handleChange}
                        required
                        autoComplete='off'
                        minLength={8}
                        maxLength={8}
                    />
                    <input
                        type="text"
                        name="displayName"
                        placeholder="Player Name"
                        value={joinGameData.displayName}
                        onChange={handleChange}
                        autoComplete='off'
                        required
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
                            disabled={
                                !joinGameData.gameCode ||
                                joinGameData.gameCode.length != 8 ||
                                /\s/.test(joinGameData.gameCode) ||
                                !joinGameData.displayName ||
                                joinGameData.displayName.length <= 3 ||
                                /\s/.test(joinGameData.displayName)
                            }
                        >
                            Join
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinGamePopup;