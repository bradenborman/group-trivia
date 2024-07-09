package grouptrivia.utilities;

import java.util.Random;

public class LobbyCodeUtility {

    private static final Random RANDOM = new Random();
    private static final String CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";

    public static String generateLobbyCode() {
        StringBuilder code = new StringBuilder("--------"); // Initialize with dashes

        // Generate 2 random indices for placing numbers (0-7)
        int index1 = RANDOM.nextInt(8); // Random position for the first number
        int index2;

        do {
            index2 = RANDOM.nextInt(8); // Random position for the second number
        } while (index2 == index1); // Ensure index2 is different from index1

        // Place numbers at the randomly chosen indices
        code.setCharAt(index1, Character.forDigit(generateRandomNumber(), 10));
        code.setCharAt(index2, Character.forDigit(generateRandomNumber(), 10));

        // Fill remaining positions with random consonants
        for (int i = 0; i < 8; i++) {
            if (code.charAt(i) == '-') { // Only replace dashes
                code.setCharAt(i, generateRandomConsonant());
            }
        }

        return code.toString();
    }

    private static int generateRandomNumber() {
        return RANDOM.nextInt(10); // Generates a random number between 0 and 9
    }

    private static char generateRandomConsonant() {
        int index = RANDOM.nextInt(CONSONANTS.length());
        return CONSONANTS.charAt(index);
    }
}