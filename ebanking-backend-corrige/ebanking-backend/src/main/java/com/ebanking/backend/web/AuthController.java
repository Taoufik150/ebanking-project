package com.ebanking.backend.web;

import com.ebanking.backend.dtos.LoginRequest;
import com.ebanking.backend.dtos.LoginResponse;
import com.ebanking.backend.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
