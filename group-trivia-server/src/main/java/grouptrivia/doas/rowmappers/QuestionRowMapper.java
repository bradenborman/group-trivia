package grouptrivia.doas.rowmappers;

import grouptrivia.models.Question;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuestionRowMapper implements RowMapper<Question> {

    @Override
    public Question mapRow(ResultSet rs, int rowNum) throws SQLException {
        Question question = new Question();
        question.setId(rs.getInt("id"));
        question.setLobbyCode(rs.getString("lobby_code"));
        question.setQuestionText(rs.getString("text"));
        return question;
    }

}