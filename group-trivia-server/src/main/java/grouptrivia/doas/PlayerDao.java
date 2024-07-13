package grouptrivia.doas;

import grouptrivia.doas.rowmappers.PlayerRowMapper;
import grouptrivia.models.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public class PlayerDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    public PlayerDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public int insertPlayer(String displayName, String lobbyCode) {
        String sql = "INSERT INTO player (display_name, lobby_code) " +
                "VALUES (:displayName, :lobbyCode)";

        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("displayName", displayName.trim())
                .addValue("lobbyCode", lobbyCode.trim());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        namedParameterJdbcTemplate.update(sql, parameters, keyHolder, new String[]{"user_id"});

        return Objects.requireNonNull(keyHolder.getKey()).intValue();
    }

    public List<Player> findPlayersByLobbyCode(String lobbyCode) {
        String sql = "SELECT * FROM player WHERE lobby_code = :lobbyCode";

        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("lobbyCode", lobbyCode);

        return namedParameterJdbcTemplate.query(sql, parameters, new PlayerRowMapper());
    }

    public void deletePlayerByIdAndLobbyCode(String userId, String lobbyCode) {
        String sql = "DELETE FROM player WHERE user_id = :userId AND lobby_code = :lobbyCode";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("lobbyCode", lobbyCode);
        namedParameterJdbcTemplate.update(sql, params);
    }

}