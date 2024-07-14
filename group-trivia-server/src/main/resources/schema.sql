CREATE TABLE lobby (
    code CHAR(8) PRIMARY KEY,
    creation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    lobby_code CHAR(8) NOT NULL,
    last_activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lobby_code) REFERENCES lobby(code)
);

CREATE TABLE question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lobby_code CHAR(8) NOT NULL,
    text VARCHAR(255) NOT NULL,
    playerIdWhoCreated VARCHAR(50) NOT NULL,
    FOREIGN KEY (lobby_code) REFERENCES lobby(code)
);

CREATE TABLE answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES player(user_id),
    FOREIGN KEY (question_id) REFERENCES question(id)
);
