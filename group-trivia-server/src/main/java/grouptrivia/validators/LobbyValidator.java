package grouptrivia.validators;

import grouptrivia.exceptions.InvalidPlayerNameException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

public class LobbyValidator {

    private static final String BAD_WORDS_FILE = "/bad_words.txt";
    private static final Set<String> BAD_WORDS;

    static {
        BAD_WORDS = new HashSet<>();
        try (InputStream inputStream = LobbyValidator.class.getResourceAsStream(BAD_WORDS_FILE);
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                BAD_WORDS.add(line.trim().toLowerCase());
            }
        } catch (IOException e) {
            e.printStackTrace(); // Handle exception properly based on your application's needs
        }
    }

    public static void validatePlayerName(String playerName) {
        if (playerName == null || playerName.length() < 3 || playerName.contains(" ")) {
            throw new InvalidPlayerNameException(playerName);
        }

        // Check for profanity
        if (containsProfanity(playerName)) {
            throw new InvalidPlayerNameException(playerName + " contains profanity.");
        }
    }

    private static boolean containsProfanity(String playerName) {
        String[] words = playerName.toLowerCase().split("\\s+");
        for (String badWord : BAD_WORDS) {
            for (String word : words) {
                if (word.contains(badWord)) {
                    return true;
                }
            }
        }
        return false;
    }

}
