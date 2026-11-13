package com.fishery.controller;

import com.fishery.model.User;
import com.fishery.repository.UserRepository;
import com.fishery.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Lets the logged-in user change their own username and/or password. */
@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AccountController(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public record UpdateRequest(String currentPassword, String newUsername, String newPassword) {}

    private static ResponseEntity<?> bad(String message) {
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody UpdateRequest req, Authentication auth) {
        User user = users.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        if (req.currentPassword() == null || !encoder.matches(req.currentPassword(), user.getPassword())) {
            return bad("Current password is incorrect");
        }

        String newUsername = req.newUsername() == null ? "" : req.newUsername().trim();
        String newPassword = req.newPassword() == null ? "" : req.newPassword();
        boolean changeName = !newUsername.isEmpty() && !newUsername.equals(user.getUsername());
        boolean changePass = !newPassword.isEmpty();

        if (!changeName && !changePass) return bad("Nothing to update");

        if (changeName) {
            if (newUsername.length() < 3 || newUsername.length() > 50) {
                return bad("Username must be 3 to 50 characters");
            }
            if (users.findByUsername(newUsername).isPresent()) {
                return bad("That username is already taken");
            }
        }
        if (changePass && newPassword.length() < 6) {
            return bad("New password must be at least 6 characters");
        }

        if (changeName) user.setUsername(newUsername);
        if (changePass) user.setPassword(encoder.encode(newPassword));
        users.save(user);

        // the old token carries the old username, so issue a fresh one
        String token = jwt.generate(user.getUsername(), user.getRole());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "role", user.getRole()));
    }
}
