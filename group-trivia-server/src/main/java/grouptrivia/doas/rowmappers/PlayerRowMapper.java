package grouptrivia.doas.rowmappers;

import grouptrivia.models.Player;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PlayerRowMapper implements RowMapper<Player> {

    @Override
    public Player mapRow(ResultSet rs, int rowNum) throws SQLException {
        Player player = new Player();
        player.setUserId(rs.getInt("user_id"));
        player.setDisplayName(rs.getString("display_name"));
        player.setLobbyCode(rs.getString("lobby_code"));
        return player;
    }

}