package grouptrivia.models.requests;

public class NewQuestionRequest {

    private String lobbyCode;
    private String text;
    private int playerIdWhoCreated;

    public String getLobbyCode() {
        return lobbyCode;
    }

    public void setLobbyCode(String lobbyCode) {
        this.lobbyCode = lobbyCode;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getPlayerIdWhoCreated() {
        return playerIdWhoCreated;
    }

    public void setPlayerIdWhoCreated(int playerIdWhoCreated) {
        this.playerIdWhoCreated = playerIdWhoCreated;
    }
}