package grouptrivia.controllers;

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

}