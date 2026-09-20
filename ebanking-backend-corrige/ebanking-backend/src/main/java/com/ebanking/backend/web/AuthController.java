package com.ebanking.backend.web;

import com.ebanking.backend.dtos.LoginRequest;
import com.ebanking.backend.dtos.LoginResponse;
import com.ebanking.backend.entities.User;
import com.ebanking.backend.repositories.UserRepository;

import com.ebanking.backend.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
        User user=userRepository.findByUsername(request.getUsername()).orElseThrow();
         String token=jwtService.generatorToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());
         String role=authentication.getAuthorities().stream().findFirst().map(auth->auth.getAuthority()).orElse("");
        return new LoginResponse(user.getId(),
                token,
                user.getUsername(),
                user.getRole());
    }
}
