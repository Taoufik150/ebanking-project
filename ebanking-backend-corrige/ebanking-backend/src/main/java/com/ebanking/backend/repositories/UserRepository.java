package com.ebanking.backend.repositories;

import com.ebanking.backend.entities.Role;
import com.ebanking.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByRole(Role role);
    List<User> findByNomContainingIgnoreCase(String keyword);
}
