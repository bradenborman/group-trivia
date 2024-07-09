import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import './menu.scss';
import Lobby from 'models/lobby';

const Menu: React.FC = () => {
    const navigate = useNavigate();

    /*
        Comment here lol
    */

    const [showJoinGamePopup, setShowJoinGamePopup] = useState(false);
    const [showStartGamePopup, setShowStartGamePopup] = useState(false);
    const [joinGameData, setJoinGameData] = useState({ gameCode: '', displayName: '' });
    const [playerName, setPlayerName] = useState('');

    const handleJoinGame = () => {
        setShowJoinGamePopup(true);
    };

    const handleStartGame = () => {
        setShowStartGamePopup(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJoinGameData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(e.target.value);
    };

    const handleCloseJoinGamePopup = () => {
        setShowJoinGamePopup(false);
    };

    const handleCloseStartGamePopup = () => {
        setShowStartGamePopup(false);
    };

    const handleJoinGameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { gameCode, displayName } = joinGameData;
        if (gameCode && gameCode.length >= 3 && displayName && displayName.length >= 3) {

            axios.put('/api/lobby', { lobbyCode: gameCode, displayName })
                .then(response => {
                    const userId: number = response.data;
                    if (response.status == 200)
                        navigate(`/game/${gameCode}`, { state: { displayName: playerName, userId } });
                }).catch(error => {
                    console.error('Error joining lobby:', error);
                })
                .finally(() => {
                    setShowStartGamePopup(false);
                });
        }
        setShowJoinGamePopup(false);
    };

    const handleStartGameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (playerName && playerName.length >= 3) {
            axios.post('/api/lobby', { playerName })
                .then(response => {
                    const lobby: Lobby = response.data;
                    navigate(`/game/${lobby.code}`, { state: { displayName: playerName, userId: lobby?.playerList[0].userId } });
                })
                .catch(error => {
                    console.error('Error creating lobby:', error);
                })
                .finally(() => {
                    setShowStartGamePopup(false);
                });
        }
    };

    return (
        <div id="menu-page">
            <div className="menu-wrapper">
                <h1 className="menu-title">Group Trivia</h1>
                <div className="menu-options">
                    <button className="menu-button" onClick={handleStartGame}>
                        New Game
                    </button>
                    <button className="menu-button" onClick={handleJoinGame}>
                        Join Game
                    </button>
                </div>
            </div>

            {showJoinGamePopup && (
                <div className="popup-backdrop">
                    <div className="popup">
                        <form onSubmit={handleJoinGameSubmit}>
                            <input
                                type="text"
                                name="gameCode"
                                placeholder="Game Code"
                                value={joinGameData.gameCode}
                                onChange={handleChange}
                                required
                                autoComplete='off'
                                minLength={8}
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
                            />
                            <div className="popup-buttons">
                                <button type="button" className="popup-button" onClick={handleCloseJoinGamePopup}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="popup-button"
                                    disabled={
                                        !joinGameData.gameCode ||
                                        joinGameData.gameCode.length < 4 ||
                                        !joinGameData.displayName ||
                                        joinGameData.displayName.length <= 3
                                    }
                                >
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStartGamePopup && (
                <div className="popup-backdrop">
                    <div className="popup">
                        <form onSubmit={handleStartGameSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={playerName}
                                onChange={handlePlayerNameChange}
                                required
                                autoComplete='off'
                                minLength={3}
                            />
                            <div className="popup-buttons">
                                <button type="button" className="popup-button" onClick={handleCloseStartGamePopup}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="popup-button"
                                    disabled={!playerName || playerName.length < 3}
                                >
                                    Start Game
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
