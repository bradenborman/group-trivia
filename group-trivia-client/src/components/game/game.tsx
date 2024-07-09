import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Question } from 'models/question';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHome } from '@fortawesome/free-solid-svg-icons';
import { Player } from 'models/player';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import Answer from 'models/answer';

// Define the LocationState interface
interface LocationState {
    displayName: string;
    userId: string;
}

const Game = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameCode } = useParams<{ gameCode: string }>();

    let displayName = "";
    let userId = "";

    try {
        const state = location.state as LocationState;
        displayName = state.displayName;
        userId = state.userId;
    } catch {
        return <Navigate to="/home" replace />;
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<Player[]>([]);

    // WebSocket setup
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const wsClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {},
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => {
                return new SockJS('http://localhost:8080/ws');
            }
        });

        wsClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers.message);
            console.error('Additional details: ' + frame.body);
        };

        setClient(wsClient);

        return () => {
            wsClient.deactivate();
        };
    }, []);


    useEffect(() => {
        if (!client) return;

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            // Subscribe to WebSocket topics
            client.subscribe(`/topic/${gameCode}/player-joined`, (message: IMessage) => {
                const newPlayer: Player = JSON.parse(message.body);
                setUsers(prevUsers => [...prevUsers, newPlayer]);
            });

            client.subscribe(`/topic/${gameCode}/question-added`, (message: IMessage) => {
                const newQuestion: Question = JSON.parse(message.body);
                setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
            });

            client.subscribe(`/topic/${gameCode}/question-answered`, (message: IMessage) => {
                const newAnswerIncoming: Answer = JSON.parse(message.body);
                setQuestions(prevQuestions => {
                    const index = prevQuestions.findIndex(question => question.id === newAnswerIncoming.questionId);

                    if (index !== -1) {
                        const updatedQuestion = { ...prevQuestions[index] };
                        const updatedAnswersList = [
                            ...updatedQuestion.answersGivenList,
                            newAnswerIncoming
                        ];
                        const updatedQuestions = [
                            ...prevQuestions.slice(0, index),
                            {
                                ...updatedQuestion,
                                answersGivenList: updatedAnswersList
                            },
                            ...prevQuestions.slice(index + 1)
                        ];

                        return updatedQuestions;
                    }

                    // Return previous questions if no question was found (should not happen in typical usage)
                    return prevQuestions;
                });
            });
        };

        client.activate();

        // Clean up: Disconnect WebSocket on component unmount
        return () => {
            client.deactivate();
        };
    }, [client]);

    useEffect(() => {
        axios.get(`/api/lobby/${gameCode}`).then(response => {
            if (response.status === 200) {
                console.log(response.data);
                setQuestions(response.data.questionList || []);
                setUsers(response.data.playerList || []);
            } else {
                navigate('/');
            }
        }).catch(() => {
            navigate('/');
        });
    }, [gameCode, navigate]);


    const handleAddQuestionSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (newQuestion.trim() !== '') {
            axios.post(`/api/question`, { lobbyCode: gameCode, text: newQuestion.trim() })
                .then(response => {
                    if (response.status === 200) {
                        // worked
                    }
                })
                .catch(error => {
                    console.error("Error submitting answer:", error);
                }).finally(() => {
                    setNewQuestion('');
                    setIsModalOpen(false);
                });
        }
    };

    const handleAnswerQuestion = (questionId: number) => {
        const answer = prompt("Please enter your answer:");
        if (answer !== null) {
            const requestData = {
                userId: parseInt(userId),
                questionId: questionId,
                lobbyCode: gameCode,
                answerText: answer
            };

            axios.post(`/api/answer`, requestData)
                .then(response => {
                    if (response.status === 200) {
                        const lobby = response.data;
                        // setQuestions(lobby.questionList || []);
                    }
                })
                .catch(error => {
                    console.error("Error submitting answer:", error);
                });
        }
    };

    const renderCellContent = (question: Question, user: Player) => {
        const userIdNumber = Number.parseInt(user.userId);
        const userAnswer = question.answersGivenList?.find(answer => answer.userId === userIdNumber);

        if (question.showAnswers) {
            return userAnswer ? userAnswer.answerText : "";
        }

        if (userAnswer) {
            return <FontAwesomeIcon icon={faCheck} className="checkmark" />;
        }

        if (user.userId === userId) {
            return <button onClick={() => handleAnswerQuestion(question.id)}>Answer</button>;
        }

        return "";
    };

    return (
        <div id="game-page">
            <div className="settings-bar">
                <FontAwesomeIcon icon={faHome} className="home-icon" onClick={() => navigate('/home')} />
                <div className="add-question-button">
                    <button onClick={() => setIsModalOpen(true)}>Add Trivia Question</button>
                </div>
                <div className='game-code'>Game Code: {gameCode}</div>
            </div>
            <div className="game-container">
                <div className="players-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Question</th>
                                {users.map((user) => (
                                    <th key={user.userId}>{user.displayName}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr key={question.id}>
                                    <td className='question'>{question.questionText}</td>
                                    {users.map((user) => (
                                        <td key={user.userId}>
                                            {renderCellContent(question, user)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isModalOpen && (
                    <div className="modal">
                        <form onSubmit={handleAddQuestionSubmit}>
                            <div className="modal-content">
                                <h3>Add New Question</h3>
                                <input
                                    type="text"
                                    id="new-question-input"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    autoComplete='off'
                                />
                                <div className="modal-buttons">
                                    <button type="submit">Create</button>
                                    <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    );
};

export default Game;
