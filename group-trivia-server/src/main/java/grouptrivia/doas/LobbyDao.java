package grouptrivia.doas;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class LobbyDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public LobbyDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void createLobby(String lobbyCode) {
        namedParameterJdbcTemplate.update("INSERT INTO lobby (code) VALUES :lobbyCode", new MapSqlParameterSource().addValue("lobbyCode", lobbyCode));
    }

    public boolean doesLobbyExist(String lobbyCode) {
        String sql = "SELECT COUNT(*) FROM lobby WHERE code = :lobbyCode";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("lobbyCode", lobbyCode);
        Integer count = namedParameterJdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public boolean areAllPlayersAnswered(String lobbyCode, int questionId) {
        String sql = "SELECT COUNT(*) = total_players AS all_players_answered " +
                "FROM ( " +
                "    SELECT COUNT(*) AS total_players " +
                "    FROM player " +
                "    WHERE lobby_code = :lobbyCode " +
                ") p " +
                "LEFT JOIN answer a ON a.question_id = :questionId " +
                "WHERE a.question_id = :questionId " +
                "GROUP BY a.question_id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("lobbyCode", lobbyCode)
                .addValue("questionId", questionId);

        Boolean allPlayersAnswered = namedParameterJdbcTemplate.queryForObject(sql, params, Boolean.class);
        return allPlayersAnswered != null && allPlayersAnswered;
    }

}