package com.eduhub.controller;

import com.eduhub.dao.impl.UserDAOImpl;
import com.eduhub.dao.interfaces.UserDAO;
import com.eduhub.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/api/user/update")
public class UserUpdateServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAOImpl();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Unauthorized\"}");
            return;
        }

        String userId = (String) session.getAttribute("userId");
        String fullName = req.getParameter("fullName");
        String email = req.getParameter("email");
        String phone = req.getParameter("phone");

        if (fullName == null || fullName.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Full Name and Email are required.\"}");
            return;
        }

        try {
            User user = userDAO.getUserById(userId);
            if (user == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"status\":\"error\", \"message\":\"User not found.\"}");
                return;
            }

            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhone(phone);

            // You need a method in your DAO to update a user.
            // Let's assume you have a method like `updateUser(User user)` in UserDAO.
            // I will add this method to the DAO.

            userDAO.updateUser(user); // This method needs to be created.

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write("{\"status\":\"success\", \"message\":\"Account updated successfully.\"}");

        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\", \"message\":\"Database error occurred.\"}");
        }
    }
}
