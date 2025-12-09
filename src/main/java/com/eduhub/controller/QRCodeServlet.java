package com.eduhub.controller;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

/**
 * QRCodeServlet - Generates QR codes using ZXing (core-3.5.4) library
 * 
 * Parameters:
 * - text (required): The data to encode in the QR code
 * - width (optional): Width in pixels (default: 300)
 * - height (optional): Height in pixels (default: 300)
 * - color (optional): Foreground color in hex without # (default: 000000 - black)
 * - bgcolor (optional): Background color in hex without # (default: ffffff - white)
 * - transparent (optional): If "true", background will be transparent (overrides bgcolor)
 * - margin (optional): QR code margin/quiet zone (default: 1)
 * - errorCorrection (optional): L, M, Q, H (default: H - highest ~30% recovery)
 * 
 * Example: /QRCodeServlet?text=https://example.com&width=200&height=200&color=0e2a47&bgcolor=ffffff
 */
public class QRCodeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    // Default values
    private static final int DEFAULT_SIZE = 300;
    private static final String DEFAULT_FG_COLOR = "000000";
    private static final String DEFAULT_BG_COLOR = "ffffff";
    private static final int DEFAULT_MARGIN = 1;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get required parameter
        String text = request.getParameter("text");
        if (text == null || text.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Text parameter is required");
            return;
        }

        // Parse dimensions
        int width = parseIntParam(request.getParameter("width"), DEFAULT_SIZE);
        int height = parseIntParam(request.getParameter("height"), DEFAULT_SIZE);
        
        // Validate dimensions (min 50, max 1000)
        width = Math.max(50, Math.min(1000, width));
        height = Math.max(50, Math.min(1000, height));
        
        // Parse colors
        String fgColorParam = request.getParameter("color");
        String bgColorParam = request.getParameter("bgcolor");
        boolean transparentBg = "true".equalsIgnoreCase(request.getParameter("transparent"));
        
        int fgColor = parseColor(fgColorParam, DEFAULT_FG_COLOR, true);  // Foreground with full opacity
        int bgColor = transparentBg ? 0x00000000 : parseColor(bgColorParam, DEFAULT_BG_COLOR, true);  // Background
        
        // Parse margin
        int margin = parseIntParam(request.getParameter("margin"), DEFAULT_MARGIN);
        margin = Math.max(0, Math.min(10, margin));
        
        // Parse error correction level
        ErrorCorrectionLevel errorLevel = parseErrorCorrection(request.getParameter("errorCorrection"));

        try {
            // Configure QR code hints
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, errorLevel);
            hints.put(EncodeHintType.MARGIN, margin);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            // Generate QR code using ZXing
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);

            // Create BufferedImage with custom colors
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? fgColor : bgColor);
                }
            }

            // Set response headers for caching
            response.setContentType("image/png");
            response.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
            response.setHeader("Pragma", "cache");
            
            // Write image to response
            OutputStream out = response.getOutputStream();
            ImageIO.write(image, "png", out);
            out.flush();
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating QR code: " + e.getMessage());
        }
    }
    
    /**
     * Parse integer parameter with default value
     */
    private int parseIntParam(String param, int defaultValue) {
        if (param == null || param.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(param.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    /**
     * Parse hex color string to ARGB integer
     * Supports formats: "0e2a47", "#0e2a47", "0E2A47"
     */
    private int parseColor(String colorParam, String defaultColor, boolean fullOpacity) {
        String color = (colorParam != null && !colorParam.trim().isEmpty()) ? colorParam.trim() : defaultColor;
        
        // Remove # prefix if present
        if (color.startsWith("#")) {
            color = color.substring(1);
        }
        
        try {
            // Parse as RGB hex
            int rgb = Integer.parseInt(color, 16);
            // Add full alpha (0xFF) for opacity
            return fullOpacity ? (0xFF000000 | rgb) : rgb;
        } catch (NumberFormatException e) {
            // Return default black or white
            return fullOpacity ? (defaultColor.equals(DEFAULT_FG_COLOR) ? 0xFF000000 : 0xFFFFFFFF) : 0;
        }
    }
    
    /**
     * Parse error correction level
     * L = ~7% recovery, M = ~15% recovery, Q = ~25% recovery, H = ~30% recovery
     */
    private ErrorCorrectionLevel parseErrorCorrection(String level) {
        if (level == null || level.trim().isEmpty()) {
            return ErrorCorrectionLevel.H; // Default to highest
        }
        switch (level.toUpperCase().trim()) {
            case "L": return ErrorCorrectionLevel.L;
            case "M": return ErrorCorrectionLevel.M;
            case "Q": return ErrorCorrectionLevel.Q;
            case "H": return ErrorCorrectionLevel.H;
            default: return ErrorCorrectionLevel.H;
        }
    }
}
