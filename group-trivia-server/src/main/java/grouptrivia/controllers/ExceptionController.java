package grouptrivia.controllers;

import grouptrivia.exceptions.InvalidPlayerNameException;
import grouptrivia.exceptions.InvalidQuestionUserProvided;
import grouptrivia.exceptions.LobbyDoesNotExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionController {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionController.class);

    @ExceptionHandler(LobbyDoesNotExistException.class)
    public ResponseEntity<String> handleLobbyDoesNotExistException(LobbyDoesNotExistException ex) {
        logger.error("Lobby does not exist: {}", ex.getLobbyCode());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidQuestionUserProvided.class)
    public ResponseEntity<String> handleInvalidQuestionUserProvidedException(InvalidQuestionUserProvided ex) {
        logger.error("Invalid Question provided: {}", ex.getQuestionProvided());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidPlayerNameException.class)
    public ResponseEntity<String> handleInvalidPlayerNameException(InvalidPlayerNameException ex) {
        logger.error("Invalid player name provided: {}", ex.getPlayerNameEntered());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }


}