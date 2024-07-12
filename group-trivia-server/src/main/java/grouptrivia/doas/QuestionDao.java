package grouptrivia.doas;

import grouptrivia.doas.rowmappers.QuestionRowMapper;
import grouptrivia.models.Question;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public class QuestionDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public QuestionDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void insertQuestion(String lobbyCode, String question) {
        String sql = "INSERT INTO question (lobby_code, text) " +
                "VALUES (:lobbyCode, :question)";

        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("lobbyCode", lobbyCode)
                .addValue("question", question);

        namedParameterJdbcTemplate.update(sql, parameters);
    }

    public List<Question> findAllQuestionsInLobby(String lobbyCode) {
        return namedParameterJdbcTemplate.query(
                "SELECT * FROM question WHERE lobby_code = :lobbyCode",
                new MapSqlParameterSource().addValue("lobbyCode", lobbyCode),
                new QuestionRowMapper());
    }

    public int createNewQuestion(String lobbyCode, String text, int playerIdWhoCreated) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        String sql = "INSERT INTO question (lobby_code, text, playerIdWhoCreated) VALUES (:lobbyCode, :text, :playerIdWhoCreated)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("lobbyCode", lobbyCode);
        params.addValue("text", text);
        params.addValue("playerIdWhoCreated", playerIdWhoCreated);
        namedParameterJdbcTemplate.update(sql, params, keyHolder, new String[]{"id"});
        return Objects.requireNonNull(keyHolder.getKey()).intValue();
    }

    public void deleteQuestionByIdAndLobbyCode(int questionId, String lobbyCode) {
        String sql = "DELETE FROM question WHERE id = :questionId AND lobby_code = :lobbyCode";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("questionId", questionId)
                .addValue("lobbyCode", lobbyCode);
        namedParameterJdbcTemplate.update(sql, params);
    }

}