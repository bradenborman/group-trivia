package grouptrivia.validators;

import grouptrivia.exceptions.InvalidQuestionUserProvided;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class QuestionValidatorTest {

    @Test
    void testValidateQuestion_ValidQuestion() {
        // No exception should be thrown for a valid question
        QuestionValidator.validateQuestion("What time is it?");
    }

    @Test
    void testValidateQuestion_NotAQuestion() {
        // Exception should be thrown for a non-question sentence
        assertThrows(InvalidQuestionUserProvided.class, () -> {
            QuestionValidator.validateQuestion("The book be on the table.");
        });
    }

    @Test
    void testValidateQuestion_MultipleWords() {
        // No exception should be thrown for a valid question
        QuestionValidator.validateQuestion("Could you please tell me where the nearest store is?");
    }

    @Test
    void testValidateQuestion_NoKeywords() {
        // Exception should be thrown for a sentence lacking question keywords
        assertThrows(InvalidQuestionUserProvided.class, () -> {
            QuestionValidator.validateQuestion("Sentence lacks question keywords.");
        });
    }

    @Test
    void testValidateQuestion_EmptyString() {
        // Exception should be thrown for an empty string
        assertThrows(InvalidQuestionUserProvided.class, () -> {
            QuestionValidator.validateQuestion("");
        });
    }

    @Test
    void testValidateQuestion_NullString() {
        // Exception should be thrown for a null string
        assertThrows(InvalidQuestionUserProvided.class, () -> {
            QuestionValidator.validateQuestion(null);
        });
    }
}
