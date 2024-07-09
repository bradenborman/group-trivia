package grouptrivia.doas;

import grouptrivia.doas.rowmappers.AnswerRowMapper;
import grouptrivia.models.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public class AnswerDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    public AnswerDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public List<Answer> findAnswersByQuestionId(int questionId) {
        String sql = "SELECT * FROM answer WHERE question_id = :questionId";

        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("questionId", questionId);

        return namedParameterJdbcTemplate.query(sql, parameters, new AnswerRowMapper());
    }

    public int insertAnswer(int questionId, String answerText, int userId) {
        String sql = "INSERT INTO answer (user_id, question_id, answer_text) " +
                "VALUES (:userId, :questionId, :answerText)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("questionId", questionId)
                .addValue("answerText", answerText);

        namedParameterJdbcTemplate.update(sql, parameters,  keyHolder, new String[]{"id"});
        return Objects.requireNonNull(keyHolder.getKey()).intValue();
    }
}