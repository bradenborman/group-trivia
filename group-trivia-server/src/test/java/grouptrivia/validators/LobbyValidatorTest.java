package grouptrivia.validators;

import grouptrivia.exceptions.InvalidPlayerNameException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LobbyValidatorTest {

    @Test
    void validatePlayerName_ValidName() {
        assertDoesNotThrow(() -> LobbyValidator.validatePlayerName("JohnDoe"));
    }

    @Test
    void validatePlayerName_InValidName() {
        assertThrows(InvalidPlayerNameException.class, () -> LobbyValidator.validatePlayerName("wankshaft"));
    }

    @Test
    void validatePlayerName_InValidNestedName() {
        assertThrows(InvalidPlayerNameException.class, () -> LobbyValidator.validatePlayerName("xxwankshaftxx"));
    }

}