package com.eduhub.service.impl;

import com.eduhub.service.interfaces.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.InputStream;
import java.util.Properties;

public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private Properties mailProps;
    private String username;
    private String password;

    public EmailServiceImpl() {
        loadConfig();
    }

    private void loadConfig() {
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("db.properties")) {
            Properties props = new Properties();
            if (input != null) {
                props.load(input);
            }

            // Load mail properties
            mailProps = new Properties();
            mailProps.put("mail.smtp.auth", props.getProperty("mail.smtp.auth", "true"));
            mailProps.put("mail.smtp.starttls.enable", props.getProperty("mail.smtp.starttls.enable", "true"));
            mailProps.put("mail.smtp.host", props.getProperty("mail.smtp.host", "smtp.gmail.com"));
            mailProps.put("mail.smtp.port", props.getProperty("mail.smtp.port", "587"));

            // Get credentials (prefer env vars, fallback to properties)
            this.username = System.getenv("MAIL_USERNAME");
            if (this.username == null) {
                this.username = props.getProperty("mail.username");
            }

            this.password = System.getenv("MAIL_PASSWORD");
            if (this.password == null) {
                this.password = props.getProperty("mail.password");
            }

        } catch (Exception e) {
            logger.error("Failed to load email configuration", e);
        }
    }

    @Override
    public boolean sendEmail(String to, String subject, String content) {
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
            logger.info("Email sent successfully to: {}", to);
            return true;

        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
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
