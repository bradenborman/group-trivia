-- Example data for lobby
INSERT INTO lobby (code) VALUES ('ABCD1234');

-- Example data for players
INSERT INTO player (display_name, lobby_code) VALUES ('Player1', 'ABCD1234');
INSERT INTO player (display_name, lobby_code) VALUES ('Player2', 'ABCD1234');

-- Example data for questions
INSERT INTO question (lobby_code, text) VALUES ('ABCD1234', 'What is the capital of France?');
INSERT INTO question (lobby_code, text) VALUES ('ABCD1234', 'What is 2 + 2?');

-- Example data for answers
INSERT INTO answer (user_id, question_id, answer_text) VALUES (1, 1, 'Paris');
INSERT INTO answer (user_id, question_id, answer_text) VALUES (2, 1, 'Paris');
INSERT INTO answer (user_id, question_id, answer_text) VALUES (2, 2, '4');
