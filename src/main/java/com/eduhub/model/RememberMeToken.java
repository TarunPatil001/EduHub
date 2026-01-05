package com.eduhub.model;

import java.sql.Timestamp;

public class RememberMeToken {
    private String seriesId;
    private String userId;
    private String tokenHash;
    private Timestamp lastUsed;
    private Timestamp expiryTime;

    public RememberMeToken() {}

    public RememberMeToken(String seriesId, String userId, String tokenHash, Timestamp expiryTime) {
        this.seriesId = seriesId;
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiryTime = expiryTime;
    }

    public String getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(String seriesId) {
        this.seriesId = seriesId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public Timestamp getLastUsed() {
        return lastUsed;
    }

    public void setLastUsed(Timestamp lastUsed) {
        this.lastUsed = lastUsed;
    }

    public Timestamp getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(Timestamp expiryTime) {
        this.expiryTime = expiryTime;
    }
}
