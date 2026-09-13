package com.ebanking.backend.services;

import com.ebanking.backend.dtos.LoginRequest;
import com.ebanking.backend.dtos.LoginResponse;
import com.ebanking.backend.entities.User;
import com.ebanking.backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Nom d'utilisateur introuvable"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe incorrect");
        }

        return new LoginResponse(user.getId(), user.getUsername(), user.getRole());
    }
}
