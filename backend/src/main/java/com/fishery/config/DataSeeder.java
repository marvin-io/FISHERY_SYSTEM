package com.fishery.config;

import com.fishery.model.User;
import com.fishery.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates two demo accounts the first time the app starts. Change/remove them for production. */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUsers(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.findByUsername("admin").isEmpty()) {
                repo.save(new User("admin", encoder.encode("admin123"), "Fishery Personnel", "ADMIN"));
            }
            if (repo.findByUsername("staff").isEmpty()) {
                repo.save(new User("staff", encoder.encode("staff123"), "Authorized Staff", "STAFF"));
            }
        };
    }
}
