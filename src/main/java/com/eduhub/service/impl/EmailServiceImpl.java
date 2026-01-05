package com.eduhub.service.impl;

import com.eduhub.service.interfaces.EmailService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private Properties mailProps;
    private String username;
    private String password;
    
    // Brevo Config
    private boolean useBrevo = false;
    private String brevoApiKey;
    private String brevoSenderEmail;

    public EmailServiceImpl() {
        // Force IPv4 to avoid IPv6 timeout issues in some container environments
        System.setProperty("java.net.preferIPv4Stack", "true");
        loadConfig();
    }

    private void loadConfig() {
        Properties props = new Properties();
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                props.load(input);
            }
        } catch (Exception e) {
            logger.warn("Could not load db.properties (this is expected in production if using Env Vars)", e);
        }

        try {
            // 1. Check for Brevo Configuration (Preferred for Cloud/Render)
            this.brevoApiKey = System.getenv("BREVO_API_KEY");
            if (this.brevoApiKey == null) {
                this.brevoApiKey = props.getProperty("brevo.api.key");
            }

            this.brevoSenderEmail = System.getenv("BREVO_SENDER_EMAIL");
            if (this.brevoSenderEmail == null) {
                this.brevoSenderEmail = props.getProperty("brevo.sender.email");
            }

            if (this.brevoApiKey != null && !this.brevoApiKey.isEmpty()) {
                this.useBrevo = true;
                if (this.brevoSenderEmail == null) {
                    this.brevoSenderEmail = System.getenv("MAIL_USERNAME"); // Fallback to SMTP user
                }
                logger.info("Email Service configured to use Brevo API (HTTP)");
                return;
            }

            // 2. Fallback to SMTP Configuration
            mailProps = new Properties();
            
            // Host
            String host = System.getenv("MAIL_SMTP_HOST");
            if (host == null) host = props.getProperty("mail.smtp.host", "smtp.gmail.com");
            mailProps.put("mail.smtp.host", host);

            // Port
            String port = System.getenv("MAIL_SMTP_PORT");
            if (port == null) port = props.getProperty("mail.smtp.port", "587");
            mailProps.put("mail.smtp.port", port);

            // Auth
            String auth = System.getenv("MAIL_SMTP_AUTH");
            if (auth == null) auth = props.getProperty("mail.smtp.auth", "true");
            mailProps.put("mail.smtp.auth", auth);

            // Configure SSL/TLS based on port
            if ("465".equals(port)) {
                // SMTPS (SSL)
                mailProps.put("mail.smtp.ssl.enable", "true");
                mailProps.put("mail.smtp.socketFactory.port", "465");
                mailProps.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                mailProps.put("mail.smtp.socketFactory.fallback", "false");
                mailProps.put("mail.smtp.starttls.enable", "false");
            } else {
                // STARTTLS (usually port 587)
                String starttls = System.getenv("MAIL_SMTP_STARTTLS");
                if (starttls == null) starttls = props.getProperty("mail.smtp.starttls.enable", "true");
                mailProps.put("mail.smtp.starttls.enable", starttls);
                mailProps.put("mail.smtp.starttls.required", "true");
            }
            
            // Trust all certificates (Critical for cloud environments)
            mailProps.put("mail.smtp.ssl.trust", "*");

            // Improved Gmail/SMTP compatibility
            mailProps.put("mail.smtp.ssl.protocols", "TLSv1.2");
            mailProps.put("mail.smtp.ssl.trust", "*"); // Trust all certs (fixes some handshake issues)
            // Increase timeout to 30s for slower cloud connections
            mailProps.put("mail.smtp.connectiontimeout", "30000"); 
            mailProps.put("mail.smtp.timeout", "30000");
            mailProps.put("mail.smtp.writetimeout", "30000");
            
            // Debugging
            mailProps.put("mail.debug", "true");

            // Credentials (prefer env vars, fallback to properties)
            this.username = System.getenv("MAIL_USERNAME");
            if (this.username == null) {
                this.username = props.getProperty("mail.username");
            }

            this.password = System.getenv("MAIL_PASSWORD");
            if (this.password == null) {
                this.password = props.getProperty("mail.password");
            }
            
            if (this.username == null || this.password == null) {
                logger.error("Email credentials are missing! Set MAIL_USERNAME and MAIL_PASSWORD environment variables.");
            } else {
                logger.info("Email service configured for SMTP user: {}", this.username);
            }

        } catch (Exception e) {
            logger.error("Failed to configure email service", e);
        }
    }

    @Override
    public boolean sendEmail(String to, String subject, String content) {
        if (useBrevo) {
            return sendViaBrevo(to, subject, content);
        } else {
            return sendViaSmtp(to, subject, content);
        }
    }

    private boolean sendViaBrevo(String to, String subject, String content) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost("https://api.brevo.com/v3/smtp/email");
            httpPost.setHeader("api-key", this.brevoApiKey);
            httpPost.setHeader("Content-Type", "application/json");

            // Construct JSON Payload using Gson
            JsonObject json = new JsonObject();
            
            // Sender
            JsonObject sender = new JsonObject();
            sender.addProperty("name", "EduHub");
            sender.addProperty("email", this.brevoSenderEmail);
            json.add("sender", sender);

            // To
            JsonArray toArray = new JsonArray();
            JsonObject toObj = new JsonObject();
            toObj.addProperty("email", to);
            toArray.add(toObj);
            json.add("to", toArray);

            // Subject
            json.addProperty("subject", subject);

            // Content
            json.addProperty("htmlContent", content);

            StringEntity entity = new StringEntity(json.toString(), StandardCharsets.UTF_8);
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = client.execute(httpPost)) {
                int statusCode = response.getStatusLine().getStatusCode();
                String responseBody = EntityUtils.toString(response.getEntity());
                
                if (statusCode >= 200 && statusCode < 300) {
                    logger.info("Email sent successfully via Brevo to: {}", to);
                    return true;
                } else {
                    logger.error("Failed to send email via Brevo. Status: {}, Response: {}", statusCode, responseBody);
                    return false;
                }
            }
        } catch (Exception e) {
            logger.error("Exception sending email via Brevo to: {}", to, e);
            return false;
        }
    }

    private boolean sendViaSmtp(String to, String subject, String content) {
        if (username == null || password == null) {
            logger.error("Email credentials not configured. Cannot send email to: {}", to);
            return false;
        }

        Session session = Session.getInstance(mailProps, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setContent(content, "text/html; charset=utf-8");

            Transport.send(message);
            logger.info("Email sent successfully via SMTP to: {}", to);
            return true;

        } catch (MessagingException e) {
            logger.error("Failed to send email via SMTP to: {}", to, e);
            return false;
        }
    }

    @Override
    public boolean sendPasswordResetOtp(String to, String otp, String refId) {
        String subject = "EduHub Verification Code";
        String bodyContent = "<p>Dear EduHub User,</p>" +
                "<p>We received a request to access your EduHub Account <a href='mailto:" + to + "' style='color: #1a73e8; text-decoration: none;'>" + to + "</a> through your email address. Your EduHub verification code is:</p>" +
                "<div class='otp-box'>" +
                "<span class='otp-code'>" + otp + "</span>" +
                "</div>" +
                "<p>If you did not request this code, it is possible that someone else is trying to access the EduHub Account <a href='mailto:" + to + "' style='color: #1a73e8; text-decoration: none;'>" + to + "</a>. <strong>Do not forward or give this code to anyone.</strong></p>" +
                "<p>Sincerely yours,</p>" +
                "<p>The EduHub Accounts team</p>";
        
        String finalHtml = getModernEmailTemplate("EduHub Verification Code", bodyContent, refId);
        return sendEmail(to, subject, finalHtml);
    }

    private String getModernEmailTemplate(String title, String content, String refId) {
        int currentYear = java.time.Year.now().getValue();
        
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "<meta charset='UTF-8'>" +
               "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "<style>" +
               "body { font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #202124; }" +
               ".container { max-width: 580px; margin: 0 auto; padding: 10px; }" +
               ".card { border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; margin-top: 20px; }" +
               ".header { background-color: #4285f4; padding: 24px 24px; }" +
               ".header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 400; font-family: 'Google Sans', Roboto, sans-serif; }" +
               ".content { padding: 24px 24px 32px 24px; line-height: 1.5; font-size: 14px; color: #3c4043; }" +
               ".otp-box { text-align: center; margin: 32px 0; }" +
               ".otp-code { font-size: 36px; font-weight: 600; letter-spacing: 2px; color: #202124; font-family: 'Google Sans', Roboto, sans-serif; }" +
               ".footer { padding: 16px 24px; background-color: #f8f9fa; border-top: 1px solid #dadce0; font-size: 11px; color: #5f6368; text-align: center; line-height: 1.6; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "<div class='container'>" +
               "<div class='card'>" +
               "<div class='header'>" +
               "<h1>" + title + "</h1>" +
               "</div>" +
               "<div class='content'>" +
               content +
               "</div>" +
               "<div class='footer'>" +
               "<p style='margin: 0 0 8px 0;'>You received this email to let you know about important changes to your EduHub Account and services.</p>" +
               "<p style='margin: 0;'>&copy; " + currentYear + " EduHub Inc., Tech Park, Innovation Street, Digital City</p>" +
               "<p style='margin: 10px 0 0 0; font-size: 10px; color: #9aa0a6;'>Ref: " + refId + "</p>" +
               "</div>" +
               "</div>" +
               "</div>" +
               "</body>" +
               "</html>";
    }
}
