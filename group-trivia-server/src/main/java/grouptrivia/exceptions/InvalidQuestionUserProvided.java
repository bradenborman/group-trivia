package grouptrivia.exceptions;

public class InvalidQuestionUserProvided extends RuntimeException {

    private final String questionProvided;

    public InvalidQuestionUserProvided(String questionProvided) {
        super("Invalid Question provided");
        this.questionProvided = questionProvided;
    }

    public String getQuestionProvided() {
        return questionProvided;
    }

}
