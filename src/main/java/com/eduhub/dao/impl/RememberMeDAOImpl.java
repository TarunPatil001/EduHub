package com.eduhub.dao.impl;

import com.eduhub.dao.interfaces.RememberMeDAO;
import com.eduhub.model.RememberMeToken;
import com.eduhub.util.DBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;

public class RememberMeDAOImpl implements RememberMeDAO {

    private static final Logger logger = LoggerFactory.getLogger(RememberMeDAOImpl.class);

    @Override
    public void saveToken(RememberMeToken token) throws SQLException {
        String sql = "INSERT INTO remember_me_tokens (series_id, user_id, token_hash, expiry_time) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, token.getSeriesId());
            pstmt.setString(2, token.getUserId());
            pstmt.setString(3, token.getTokenHash());
            pstmt.setTimestamp(4, token.getExpiryTime());
            pstmt.executeUpdate();
        }
    }

    @Override
    public RememberMeToken getToken(String seriesId) throws SQLException {
        String sql = "SELECT * FROM remember_me_tokens WHERE series_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, seriesId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    RememberMeToken token = new RememberMeToken();
                    token.setSeriesId(rs.getString("series_id"));
                    token.setUserId(rs.getString("user_id"));
                    token.setTokenHash(rs.getString("token_hash"));
                    token.setLastUsed(rs.getTimestamp("last_used"));
                    token.setExpiryTime(rs.getTimestamp("expiry_time"));
                    return token;
                }
            }
        }
        return null;
    }

    @Override
    public void updateToken(String seriesId, String newTokenHash, Timestamp lastUsed) throws SQLException {
        String sql = "UPDATE remember_me_tokens SET token_hash = ?, last_used = ? WHERE series_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, newTokenHash);
            pstmt.setTimestamp(2, lastUsed);
            pstmt.setString(3, seriesId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public void deleteToken(String seriesId) throws SQLException {
        String sql = "DELETE FROM remember_me_tokens WHERE series_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, seriesId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public void deleteTokensForUser(String userId) throws SQLException {
        String sql = "DELETE FROM remember_me_tokens WHERE user_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, userId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public void cleanupExpiredTokens() throws SQLException {
        String sql = "DELETE FROM remember_me_tokens WHERE expiry_time < CURRENT_TIMESTAMP";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.executeUpdate();
        }
    }
}
