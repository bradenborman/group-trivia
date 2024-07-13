package grouptrivia.exceptions;

public class InvalidPlayerNameException extends RuntimeException {

    private final String playerNameEntered;

    public InvalidPlayerNameException(String playerNameEntered) {
        super("Invalid Player Name");
        this.playerNameEntered = playerNameEntered;
    }

    public String getPlayerNameEntered() {
        return playerNameEntered;
    }
}