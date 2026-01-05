package com.eduhub.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class GoogleAuthUtil {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthUtil.class);
    
    private static String CLIENT_ID;
    private static String CLIENT_SECRET;
    private static String REDIRECT_URI;
    
    static {
        // Load from properties or env
        try {
            Properties props = new Properties();
            props.load(GoogleAuthUtil.class.getClassLoader().getResourceAsStream("db.properties"));
            
            CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID");
            if (CLIENT_ID == null) CLIENT_ID = props.getProperty("google.client.id");
            
            CLIENT_SECRET = System.getenv("GOOGLE_CLIENT_SECRET");
            if (CLIENT_SECRET == null) CLIENT_SECRET = props.getProperty("google.client.secret");
            
            REDIRECT_URI = System.getenv("GOOGLE_REDIRECT_URI");
            if (REDIRECT_URI == null) REDIRECT_URI = props.getProperty("google.redirect.uri", "http://localhost:8080/auth/google/callback");
            
        } catch (Exception e) {
            logger.error("Failed to load Google Auth config", e);
        }
    }

    public static String getAuthorizationUrl() {
        try {
            return "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + URLEncoder.encode(CLIENT_ID, "UTF-8") +
                    "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, "UTF-8") +
                    "&response_type=code" +
                    "&scope=email%20profile";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String getAccessToken(String code) throws IOException {
        String url = "https://oauth2.googleapis.com/token";
        
        HttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(url);
        
        // Build JSON body or Form params. Google supports both.
        // Using URL parameters for simplicity in this raw implementation
        String params = "code=" + code +
                "&client_id=" + CLIENT_ID +
                "&client_secret=" + CLIENT_SECRET +
                "&redirect_uri=" + REDIRECT_URI +
                "&grant_type=authorization_code";
        
        post.setEntity(new StringEntity(params, org.apache.http.entity.ContentType.APPLICATION_FORM_URLENCODED));

        HttpResponse response = client.execute(post);
        String jsonResponse = EntityUtils.toString(response.getEntity());
        
        JsonObject json = new Gson().fromJson(jsonResponse, JsonObject.class);
        if (json.has("access_token")) {
            return json.get("access_token").getAsString();
        }
        logger.error("Failed to get access token: {}", jsonResponse);
        return null;
    }

    public static GoogleUser getUserInfo(String accessToken) throws IOException {
        String url = "https://www.googleapis.com/oauth2/v2/userinfo";
        
        HttpClient client = HttpClients.createDefault();
        HttpGet get = new HttpGet(url);
        get.setHeader("Authorization", "Bearer " + accessToken);
        
        HttpResponse response = client.execute(get);
        String jsonResponse = EntityUtils.toString(response.getEntity());
        
        return new Gson().fromJson(jsonResponse, GoogleUser.class);
    }

    public static class GoogleUser {
        public String id;
        public String email;
        public String verified_email;
        public String name;
        public String given_name;
        public String family_name;
        public String picture;
    }
}
