import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './menu.scss';
import Lobby from 'models/lobby';
import { isValidGameCode, isValidDisplayName, isValidPlayerName } from '../../utilities/validation';
import JoinGamePopup from './components/joinGamePopup';
import MenuButton from './components/menuButton';
import StartGamePopup from './components/startGamePopup';

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showJoinGamePopup, setShowJoinGamePopup] = useState(false);
    const [showStartGamePopup, setShowStartGamePopup] = useState(false);
    const [showRules, setShowRules] = useState(true);
    const [joinGameData, setJoinGameData] = useState({ gameCode: '', displayName: '' });
    const [playerName, setPlayerName] = useState('');

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

    const handleShowRules = () => {
        setShowRules(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const filteredValue = value.replace(/\s/g, ''); // Remove spaces
        setJoinGameData(prevData => ({
            ...prevData,
            [name]: filteredValue,
        }));
    };

    const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\s/g, ''); // Remove spaces
        setPlayerName(filteredValue);
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

        if (isValidGameCode(gameCode) && isValidDisplayName(displayName)) {
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
        } else {
            console.error('Invalid game code or display name');
        }
    };

    const handleStartGameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValidPlayerName(playerName)) {
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
        } else {
            console.error('Invalid player name');
        }
    };

    return (
        <div id="menu-page">
            <div className="menu-wrapper">
                <h1 className="menu-title">Group Trivia</h1>
                <div className="menu-options">
                    <MenuButton onClick={handleStartGame}>
                        New Game
                    </MenuButton>
                    <MenuButton onClick={handleJoinGame}>
                        Join Game
                    </MenuButton>
                    <MenuButton onClick={handleShowRules}>
                        How to Play
                    </MenuButton>
                </div>
                <div className={'how-to-play-wrapper ' + (showRules ? 'show' : '')}>
                    <div className="content">
                        <h4>How to Play</h4>
                        <ul>
                            <li>Start by joining an already established game or create your own!</li>
                            <li>Once you join a lobby, click the 'Create Trivia Questiion' button to add any questions</li>
                            <li>As Players join, new rows will be added to the screen</li>
                            <li>As Trivia Questions come in, new columns will be added to the screen</li>
                            <li>Click the 'Anser' button to submit an answer.</li>
                        </ul>
                        <button className="close-button" onClick={() => setShowRules(false)}>Close</button>
                    </div>
                </div>
            </div>

            {showJoinGamePopup && (
                <JoinGamePopup
                    joinGameData={joinGameData}
                    handleChange={handleChange}
                    handleClose={handleCloseJoinGamePopup}
                    handleSubmit={handleJoinGameSubmit}
                />
            )}

            {showStartGamePopup && (
                <StartGamePopup
                    playerName={playerName}
                    handlePlayerNameChange={handlePlayerNameChange}
                    handleClose={handleCloseStartGamePopup}
                    handleSubmit={handleStartGameSubmit}
                />
            )}
        </div>
    );
};

export default Menu;