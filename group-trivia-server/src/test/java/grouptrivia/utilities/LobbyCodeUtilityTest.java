package grouptrivia.utilities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LobbyCodeUtilityTest {

    @Test
    void testGenerateLobbyCode() {
        String lobbyCode = LobbyCodeUtility.generateLobbyCode();
        System.out.println("Lobby Code: " + lobbyCode);
        // Check if the generated code is exactly 8 characters long
        assertEquals(8, lobbyCode.length());

        // Count numbers and consonants in the lobby code
        int numCount = 0;
        int consonantCount = 0;

        for (char c : lobbyCode.toCharArray()) {
            if (Character.isDigit(c)) {
                numCount++;
            } else if (isConsonant(c)) {
                consonantCount++;
            }
        }

        // Check if there are exactly 2 numbers
        assertEquals(2, numCount);

        // Check if there are exactly 6 consonants
        assertEquals(6, consonantCount);
    }

    private boolean isConsonant(char c) {
        // Define a set of consonants (non-vowels)
        String consonants = "BCDFGHJKLMNPQRSTVWXYZ";

        return consonants.indexOf(Character.toUpperCase(c)) != -1;
    }

}