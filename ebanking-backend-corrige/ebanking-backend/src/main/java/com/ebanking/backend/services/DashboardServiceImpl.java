package com.ebanking.backend.services;

import com.ebanking.backend.dtos.DashboardDto;
import com.ebanking.backend.dtos.UserDto;
import com.ebanking.backend.entities.Admin;
import com.ebanking.backend.entities.BankAccount;
import com.ebanking.backend.entities.User;
import com.ebanking.backend.mappers.BankAccountMapper;
import com.ebanking.backend.repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BankAccountRepository bankAccountRepository;
    private final AccountOperationRepository accountOperationRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final BankAccountMapper mapper;

    @Override
    public DashboardDto getDashboard() {
        long totalCustomers = customerRepository.count();
        long totalAccounts = bankAccountRepository.count();
        long totalOperations = accountOperationRepository.count();

        Double totalBalance = bankAccountRepository.findAll()
                .stream()
                .map(BankAccount::getBalance)
                .reduce(0.0, Double::sum);

        return new DashboardDto(totalCustomers, totalAccounts, totalBalance, totalOperations);
    }

    @Override
    public UserDto getUserProfile(Long id) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("user introuvable"));

        return mapper.fromUser(admin);
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        User admin = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new RuntimeException("user not found"));

        admin.setEmail(userDto.getEmail());
        admin.setUsername(userDto.getUsername());
        admin.setPhone(userDto.getPhone());
        admin.setNom(userDto.getNom());
        admin.setPrenom(userDto.getPrenom());

        User savedAdmin = userRepository.save(admin);

        return mapper.fromUser(savedAdmin);
    }
}
