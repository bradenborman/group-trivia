package grouptrivia.doas.rowmappers;

import grouptrivia.models.Lobby;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LobbyRowMapper implements RowMapper<Lobby> {

    @Override
    public Lobby mapRow(ResultSet rs, int rowNum) throws SQLException {
        Lobby lobby = new Lobby();
        lobby.setCode(rs.getString("code"));
        lobby.setCreationDatetime(rs.getTimestamp("creation_datetime").toLocalDateTime());
        return lobby;
    }

}