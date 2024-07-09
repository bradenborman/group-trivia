package grouptrivia.exceptions;

public class LobbyDoesNotExistException extends RuntimeException {

    private final String lobbyCode;

    public LobbyDoesNotExistException(String message, String lobbyCode) {
        super(message);
        this.lobbyCode = lobbyCode;
    }

    public String getLobbyCode() {
        return lobbyCode;
    }

}