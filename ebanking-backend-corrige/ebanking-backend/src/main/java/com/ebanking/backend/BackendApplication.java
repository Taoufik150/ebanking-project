package com.ebanking.backend;

import com.ebanking.backend.dtos.UserDto;
import com.ebanking.backend.entities.Admin;
import com.ebanking.backend.entities.Role;
import com.ebanking.backend.entities.User;
import com.ebanking.backend.repositories.AdminRepository;
import com.ebanking.backend.repositories.UserRepository;
import com.ebanking.backend.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner init(
			BankAccountService service,
			AdminRepository adminRepository,
			UserRepository userRepository
	) {
		return args -> {

			// =========================
			// Création des clients
			// =========================

			if (service.listUsers().isEmpty()) {

				UserDto c1 = new UserDto();
				c1.setNom("Hassan");
				c1.setPrenom("HAssan");
				c1.setEmail("hassan@gmail.com");
				c1.setUsername("hassan");
				c1.setPassword("hassan123");
				c1.setPhone(611111111L);
				c1.setRole(Role.CUSTOMER);
				service.saveUser(c1);

				UserDto c2 = new UserDto();
				c2.setNom("Imane");
				c2.setPrenom("Imane");
				c2.setEmail("imane@gmail.com");
				c2.setUsername("imane");
				c2.setPassword("imane123");
				c2.setPhone(622222222L);
				c2.setRole(Role.CUSTOMER);
				service.saveUser(c2);
			}

			// =========================
			// Création de l'admin
			// =========================

			if (userRepository.findByRole(Role.ADMIN).isEmpty()) {

				User admin = new Admin();
				admin.setUsername("admin");
				admin.setPassword("admin123");
				admin.setPhone(600000000L);
				admin.setRole(Role.ADMIN);
				admin.setNom("Mansouri");
				admin.setPrenom("Taoufik");
				admin.setEmail("admin@gmail.com");

				userRepository.save(admin);
			}
		};
	}
}
