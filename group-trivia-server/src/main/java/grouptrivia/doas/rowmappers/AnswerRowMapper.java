package grouptrivia.doas.rowmappers;

import grouptrivia.models.Answer;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AnswerRowMapper implements RowMapper<Answer> {

    @Override
    public Answer mapRow(ResultSet rs, int rowNum) throws SQLException {
        Answer answer = new Answer();
        answer.setId(rs.getInt("id"));
        answer.setUserId(rs.getInt("user_id"));
        answer.setQuestionId(rs.getInt("question_id"));
        answer.setAnswerText(rs.getString("answer_text"));
        return answer;
    }

}