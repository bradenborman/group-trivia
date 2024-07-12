package grouptrivia.validators;

import grouptrivia.exceptions.InvalidQuestionUserProvided;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class QuestionValidator {

    private static final Logger logger = LoggerFactory.getLogger(QuestionValidator.class);

    private static final String[] questionKeywords = {
            "who", "what", "where", "when", "why", "how", "can", "could",
            "should", "would", "is", "are", "will", "did", "do", "does", "may",
            "might", "must", "have", "has", "had", "which", "whose", "whom",
            "whether", "whenever", "wherever", "however", "whatsoever", "how come", "true", "false"
    };

    public static void validateQuestion(String question) {
        if(question == null || question.length() < 5)
            throw new InvalidQuestionUserProvided(question);

        boolean valid = Arrays.stream(question.split(" "))
                .map(String::toLowerCase)
                .anyMatch(QuestionValidator::hasKeyWord);

        if(!valid)
            throw new InvalidQuestionUserProvided(question);
    }

    private static boolean hasKeyWord(String word) {
        boolean result = Arrays.stream(questionKeywords)
                .anyMatch(keyword -> word.contains(keyword.toLowerCase()));

        if(result)
            logger.debug("Keyword found: {}", word);

        return result;
    }


}
