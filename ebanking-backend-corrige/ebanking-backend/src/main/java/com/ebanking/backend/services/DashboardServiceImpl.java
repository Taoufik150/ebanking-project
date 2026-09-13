package com.ebanking.backend.services;

import com.ebanking.backend.dtos.DashboardDto;
import com.ebanking.backend.dtos.UserDto;
import com.ebanking.backend.entities.Admin;
import com.ebanking.backend.entities.BankAccount;
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
    public UserDto getAdminProfile(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        return mapper.fromAdmin(admin);
    }

    @Override
    public UserDto updateAdmin(UserDto userDto) {
        Admin admin = adminRepository.findById(userDto.getId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setEmail(userDto.getEmail());
        admin.setUsername(userDto.getUsername());
        admin.setPhone(userDto.getPhone());
        admin.setNom(userDto.getNom());
        admin.setPrenom(userDto.getPrenom());

        Admin savedAdmin = adminRepository.save(admin);

        return mapper.fromAdmin(savedAdmin);
    }
}
