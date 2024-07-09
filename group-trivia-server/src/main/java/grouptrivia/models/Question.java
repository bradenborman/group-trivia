package grouptrivia.models;

import java.util.List;

public class Question {

    private int id;
    private String lobbyCode;
    private String questionText;
    private List<Answer> answersGivenList;
    private boolean showAnswers;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLobbyCode() {
        return lobbyCode;
    }

    public void setLobbyCode(String lobbyCode) {
        this.lobbyCode = lobbyCode;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<Answer> getAnswersGivenList() {
        return answersGivenList;
    }

    public void setAnswersGivenList(List<Answer> answersGivenList) {
        this.answersGivenList = answersGivenList;
    }

    public boolean isShowAnswers() {
        return showAnswers;
    }

    public void setShowAnswers(boolean showAnswers) {
        this.showAnswers = showAnswers;
    }
}