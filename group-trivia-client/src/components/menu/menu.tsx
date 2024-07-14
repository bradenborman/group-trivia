import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './menu.scss';
import Lobby from 'models/lobby';

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showJoinGamePopup, setShowJoinGamePopup] = useState(false);
    const [showStartGamePopup, setShowStartGamePopup] = useState(false);
    const [joinGameData, setJoinGameData] = useState({ gameCode: '', displayName: '' });
    const [playerName, setPlayerName] = useState('');

    // useEffect to check for join parameter in URL on component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const joinCode = params.get('join');

        if (joinCode) {
            setShowJoinGamePopup(true);
            setJoinGameData(prevData => ({
                ...prevData,
                gameCode: joinCode,
            }));
        }
    }, [location.search]);

    const handleJoinGame = () => {
        setShowJoinGamePopup(true);
    };

    const handleStartGame = () => {
        setShowStartGamePopup(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Ensure no spaces in the value
        if (!/\s/.test(value)) {
            setJoinGameData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Ensure no spaces in the value
        if (!/\s/.test(value)) {
            setPlayerName(value);
        }
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

        // Validate gameCode and displayName (no spaces)
        if (gameCode && gameCode.length >= 3 && !/\s/.test(gameCode) &&
            displayName && displayName.length >= 3 && !/\s/.test(displayName)) {
            axios.put('/api/lobby', { lobbyCode: gameCode, displayName })
                .then(response => {
                    const userId: number = response.data;
                    if (response.status === 200) {
                        navigate(`/game/${gameCode}`, { state: { displayName: playerName, userId } });
                    }
                })
                .catch(error => {
                    console.error('Error joining lobby:', error);
                })
                .finally(() => {
                    setShowJoinGamePopup(false);
                });
        }
    };

    const handleStartGameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate playerName (no spaces)
        if (playerName && playerName.length >= 3 && !/\s/.test(playerName)) {
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
                                maxLength={18}
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
                                maxLength={18}
                            />
                            <div className="popup-buttons">
                                <button type="button" className="popup-button" onClick={handleCloseStartGamePopup}>
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
            )}
        </div>
    );
};

export default Menu;