package com.eduhub.dao.interfaces;

import com.eduhub.model.RememberMeToken;
import java.sql.SQLException;

public interface RememberMeDAO {
    void saveToken(RememberMeToken token) throws SQLException;
    RememberMeToken getToken(String seriesId) throws SQLException;
    void updateToken(String seriesId, String newTokenHash, java.sql.Timestamp lastUsed) throws SQLException;
    void deleteToken(String seriesId) throws SQLException;
    void deleteTokensForUser(String userId) throws SQLException;
    void cleanupExpiredTokens() throws SQLException;
}
