-- Example data for lobby
INSERT INTO lobby (code) VALUES ('ABCD1234');

-- Example data for players
INSERT INTO player (display_name, lobby_code) VALUES ('Player1', 'ABCD1234');
INSERT INTO player (display_name, lobby_code) VALUES ('Player2', 'ABCD1234');

-- Retrieve player IDs (assuming 'id' is the primary key of the 'player' table)
-- You would typically retrieve these IDs from the database or use actual values.

-- Example data for questions (updated to use player IDs)
-- Assuming 'Player1' has id = 1 and 'Player2' has id = 2 in the 'player' table
INSERT INTO question (lobby_code, text, playerIdWhoCreated) VALUES ('ABCD1234', 'What is the capital of France?', 1);
INSERT INTO question (lobby_code, text, playerIdWhoCreated) VALUES ('ABCD1234', 'What is 2 + 2?', 2);

-- Example data for answers
INSERT INTO answer (user_id, question_id, answer_text) VALUES (1, 1, 'Paris');
INSERT INTO answer (user_id, question_id, answer_text) VALUES (2, 1, 'Paris');
INSERT INTO answer (user_id, question_id, answer_text) VALUES (2, 2, '4');
