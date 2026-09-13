package com.ebanking.backend.dtos;

import com.ebanking.backend.entities.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private Long phone;
    private String password;
    private Role role;
}
