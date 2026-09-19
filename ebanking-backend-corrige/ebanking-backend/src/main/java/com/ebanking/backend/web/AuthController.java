package com.ebanking.backend.web;

import com.ebanking.backend.dtos.LoginRequest;
import com.ebanking.backend.dtos.LoginResponse;
import com.ebanking.backend.services.AuthService;
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


    private final AuthenticationManager authenticationManager;
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));


        return "Authentication réussie pour : "+authentication.getName();
    }
}
