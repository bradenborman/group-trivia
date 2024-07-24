import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Question } from 'models/question';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHome, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Player } from 'models/player';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import Answer from 'models/answer';

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

        if (gameCode)
            return <Navigate to={`/home?join=${gameCode}`} replace />;

        return <Navigate to="/home" replace />;
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<Player[]>([]);

    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        let wsUrl;
        const devPort = 8080;

        if (process.env.NODE_ENV === 'production') {
            wsUrl = `${protocol}://${window.location.host}/ws`;
        } else {
            wsUrl = `${protocol}://localhost:${devPort}/ws`;
        }

        const wsClient = new Client({
            brokerURL: wsUrl,
            connectHeaders: {},
            debug: function (str) {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => {
                const sockJsProtocol = window.location.protocol === 'https:' ? 'https' : 'http';
                let sockJsUrl;

                if (process.env.NODE_ENV === 'production') {
                    sockJsUrl = `${sockJsProtocol}://${window.location.host}/ws`;
                } else {
                    sockJsUrl = `${sockJsProtocol}://localhost:${devPort}/ws`;
                }

                return new SockJS(sockJsUrl);
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
            client.subscribe(`/topic/${gameCode}/player-joined`, (message: IMessage) => {
                const newPlayer: Player = JSON.parse(message.body);
                setUsers(prevUsers => [...prevUsers, newPlayer]);
            });

            client.subscribe(`/topic/${gameCode}/question-added`, (message: IMessage) => {
                const newQuestion: Question = JSON.parse(message.body);
                setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
            });

            client.subscribe(`/topic/${gameCode}/player-deleted`, (message: IMessage) => {
                const playerRemovedId: number = JSON.parse(message.body);
                setUsers(prevUsers => prevUsers.filter(player => Number.parseInt(player.userId) != playerRemovedId));
            });

            client.subscribe(`/topic/${gameCode}/question-deleted`, (message: IMessage) => {
                const deletedQuestionId: number = JSON.parse(message.body);
                setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== deletedQuestionId));
            });

            client.subscribe(`/topic/${gameCode}/show-answer`, (message: IMessage) => {
                const questionIdToShowAnswers: number = JSON.parse(message.body);
                setQuestions(prevQuestions =>
                    prevQuestions.map(question =>
                        question.id === questionIdToShowAnswers ? { ...question, showAnswers: true } : question
                    )
                );
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

                    return prevQuestions;
                });
            });
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [client]);

    useEffect(() => {
        axios.get(`/api/lobby/${gameCode}`).then(response => {
            if (response.status === 200) {
                setQuestions(response.data.questionList || []);
                setUsers(response.data.playerList || []);
            } else {
                navigate('/');
            }
        }).catch(() => {
            navigate('/');
        });
    }, [gameCode, navigate]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // alert("You have switched tabs or minimized the window!");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        //updates my backend tables to say user is still here
        const interval = setInterval(() => {
            axios.get(`/api/lobby/${gameCode}/player-check-in/${userId}`).then(response => { }).catch(() => { });
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, [gameCode, navigate]);




    const handleAddQuestionSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (newQuestion.trim() !== '') {
            axios.post(`/api/question`, { lobbyCode: gameCode, text: newQuestion.trim(), playerIdWhoCreated: userId })
                .then(response => {
                    if (response.status === 200) {
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
                    }
                })
                .catch(error => {
                    console.error("Error submitting answer:", error);
                });
        }
    };

    const handleDeleteQuestion = (questionId: number) => {
        axios.delete(`/api/question/${questionId}`, { params: { lobbyCode: gameCode } })
            .then(response => {
                if (response.status === 200) {
                    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
                }
            })
            .catch(error => {
                console.error("Error deleting question:", error);
            });
    };

    const renderUserContent = (question: Question, user: Player) => {
        const userIdNumber = Number.parseInt(user.userId);
        const userAnswer = question.answersGivenList?.find(answer => answer.userId === userIdNumber);

        if (question.showAnswers) {
            return userAnswer ? (
                <div className={(question.playerIdCreated == userAnswer.userId) ? "correct-answer" : ""}>
                    {userAnswer.answerText}
                </div>
            ) : null;
        }

        if (userAnswer) {
            return <FontAwesomeIcon icon={faCheck} className="checkmark" />;
        }

        if (user.userId === userId) {
            return (
                <>
                    <button onClick={() => handleAnswerQuestion(question.id)}>Answer</button>
                    {question.playerIdCreated.toString() == userId && (
                        <button className="delete-button" onClick={() => handleDeleteQuestion(question.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                </>
            );
        }

        return null;
    };



    if (questions.length === 0) {
        return (
            <div id="game-page">
                <div className="settings-bar">
                    <FontAwesomeIcon icon={faHome} className="home-icon" onClick={() => navigate('/home')} />
                    <div className='game-code'>Game Code: {gameCode}</div>
                </div>
                <div className="game-container">
                    <div className="add-question-button">
                        <button onClick={() => setIsModalOpen(true)}>Add Trivia Question</button>
                    </div>
                    <div className="no-questions-message">
                        Add a question to begin
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
    }

    return (
        <div id="game-page">
            <div className="settings-bar">
                <FontAwesomeIcon icon={faHome} className="home-icon" onClick={() => navigate('/home')} />
                <div className='game-code'>Game Code: {gameCode}</div>
            </div>
            <div className="game-container">
                <div className="add-question-button">
                    <button onClick={() => setIsModalOpen(true)}>Add Trivia Question</button>
                </div>
                {questions.map((question) => (
                    <div key={question.id} className="question-container">
                        <h3>{question.questionText}</h3>
                        <table className="users-data">
                            <thead>
                                <tr>
                                    {users.map((user) => (
                                        <th key={user.userId}>{user.displayName} {user.userId === userId && <span className="star">⭐</span>}</th>
                                    ))}
                                    {users.length < 4 && Array.from({ length: 4 - users.length }, (_, index) => (
                                        <th key={`placeholder-${index}`}></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {users.map((user) => (
                                        <td key={user.userId}>
                                            {renderUserContent(question, user)}
                                        </td>
                                    ))}
                                    {users.length < 4 && Array.from({ length: 4 - users.length }, (_, index) => (
                                        <th key={`placeholder-${index}`}></th>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            {isModalOpen && (
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
            )}
        </div>
    );



}

export default Game;
