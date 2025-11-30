package com.eduhub.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class CloudinaryUtil {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryUtil.class);
    private static Cloudinary cloudinary;

    static {
        try {
            Properties props = new Properties();
            InputStream input = CloudinaryUtil.class.getClassLoader().getResourceAsStream("db.properties");

            if (input != null) {
                props.load(input);
            } else {
                logger.warn("db.properties not found. Relying on environment variables.");
            }

            String cloudName = getValue(props, "cloudinary.cloud_name", "CLOUDINARY_CLOUD_NAME");
            String apiKey = getValue(props, "cloudinary.api_key", "CLOUDINARY_API_KEY");
            String apiSecret = getValue(props, "cloudinary.api_secret", "CLOUDINARY_API_SECRET");

            if (cloudName != null && apiKey != null && apiSecret != null) {
                Map<String, String> config = new HashMap<>();
                config.put("cloud_name", cloudName);
                config.put("api_key", apiKey);
                config.put("api_secret", apiSecret);
                cloudinary = new Cloudinary(config);
                logger.info("Cloudinary initialized successfully for cloud: {}", cloudName);
            } else {
                logger.error("Cloudinary configuration missing. Please check db.properties or environment variables.");
            }

        } catch (Exception e) {
            logger.error("Failed to initialize Cloudinary", e);
        }
    }

    private static String getValue(Properties props, String propKey, String envKey) {
        String value = System.getenv(envKey);
        if (value != null && !value.trim().isEmpty()) {
            return value;
        }
        value = props.getProperty(propKey);
        if (value != null && !value.trim().isEmpty()) {
            return value;
        }
        return null;
    }

    public static Cloudinary getCloudinary() {
        return cloudinary;
    }
}
