package com.ebanking.backend.services;

import com.ebanking.backend.dtos.*;
import com.ebanking.backend.entities.*;
import com.ebanking.backend.exceptions.BankAccountNotFoundException;
import com.ebanking.backend.exceptions.CustomerNotFoundException;
import com.ebanking.backend.exceptions.InsufficientBalanceException;
import com.ebanking.backend.mappers.BankAccountMapper;
import com.ebanking.backend.repositories.AccountOperationRepository;
import com.ebanking.backend.repositories.BankAccountRepository;
import com.ebanking.backend.repositories.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final AccountOperationRepository accountOperationRepository;
    private final BankAccountMapper mapper;
    private final UserRepository userRepository;

    // ============================================================
    // CREER UN USER
    // ============================================================
    @Override
    public UserDto saveUser(UserDto userDto) {
        log.info("Création d'un nouvel utilisateur");

        User user = mapper.fromUserDto(userDto);
        User savedUser = userRepository.save(user);

        return mapper.fromUser(savedUser);
    }

    // ============================================================
    // LISTE DES USERS
    // ============================================================
    @Override
    public List<UserDto> listUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(user->user.getRole()==Role.CUSTOMER)
                .map(mapper::fromUser)
                .collect(Collectors.toList());
    }

    // ============================================================
    // CHERCHER UN USER
    // ============================================================
    @Override
    public UserDto getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Utilisateur introuvable : " + id));

        return mapper.fromUser(user);
    }

    // ============================================================
    // MODIFIER UN USER
    // ============================================================
    @Override
    public UserDto updateUser(UserDto userDto) {
        log.info("Modification de l'utilisateur avec id : {}", userDto.getId());

        User existingUser = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new CustomerNotFoundException("Utilisateur introuvable : " + userDto.getId()));

        // Informations personnelles
        existingUser.setNom(userDto.getNom());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setUsername(userDto.getUsername());
        existingUser.setPhone(userDto.getPhone());

        // Modifier le mot de passe uniquement s'il est fourni
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPassword(userDto.getPassword());
        }

        User updatedUser = userRepository.save(existingUser);

        return mapper.fromUser(updatedUser);
    }

    // ============================================================
    // SUPPRIMER UN USER
    // ============================================================
    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new CustomerNotFoundException("Utilisateur introuvable : " + userId);
        }
        userRepository.deleteById(userId);
    }

    // ============================================================
    // RECHERCHE USER
    // ============================================================
    @Override
    public List<UserDto> searchUsers(String keyword) {
        List<User> users = userRepository.findByNomContainingIgnoreCase(keyword);

        return users.stream()
                .map(mapper::fromUser)
                .collect(Collectors.toList());
    }

    // ============================================================
    // CREER COMPTE COURANT
    // ============================================================
    @Override
    public CurrentBankAccountDto saveCurrentBankAccount(double initialBalance, double overdraft, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(user instanceof Customer)) {
            throw new RuntimeException("Cet utilisateur n'est pas un client");
        }

        Customer customer = (Customer) user;
        CurrentAccount currentAccount = new CurrentAccount();
        currentAccount.setId(UUID.randomUUID().toString());
        currentAccount.setCreationDate(new Date());
        currentAccount.setBalance(initialBalance);
        currentAccount.setStatus(AccountStatus.CREATED);
        currentAccount.setOverdraft(overdraft);
        currentAccount.setCustomer((Customer) user);

        CurrentAccount savedAccount = bankAccountRepository.save(currentAccount);

        return mapper.fromCurrentAccount(savedAccount);
    }

    // ============================================================
    // CREER COMPTE EPARGNE
    // ============================================================
    @Override
    public SavingBankAccountDto saveSavingBankAccount(double initialBalance, double interestRate, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(user instanceof Customer)) {
            throw new RuntimeException("Cet utilisateur n'est pas un client");
        }

        Customer customer = (Customer) user;
        SavingAccount savingAccount = new SavingAccount();
        savingAccount.setId(UUID.randomUUID().toString());
        savingAccount.setCreationDate(new Date());
        savingAccount.setBalance(initialBalance);
        savingAccount.setStatus(AccountStatus.CREATED);
        savingAccount.setInterestRate(interestRate);
        savingAccount.setCustomer((Customer) user);

        SavingAccount savedAccount = bankAccountRepository.save(savingAccount);

        return mapper.fromSavingAccount(savedAccount);
    }

    // ============================================================
    // LISTE DES COMPTES
    // ============================================================
    @Override
    public List<BankAccountDto> bankAccountList() {
        List<BankAccount> bankAccounts = bankAccountRepository.findAll();

        return bankAccounts.stream()
                .map(this::toBankAccountDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // DETAIL D'UN COMPTE
    // ============================================================
    @Override
    public BankAccountDto getBankAccount(String accountId) {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("Bank account not found"));

        return toBankAccountDto(bankAccount);
    }

    // ============================================================
    // DEBIT
    // ============================================================
    @Override
    public void debit(String accountId, double amount, String description) throws InsufficientBalanceException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("Bank account not found"));

        if (amount <= 0) {
            throw new IllegalArgumentException("Le montant doit être supérieur à 0");
        }

        if (bankAccount.getBalance() < amount) {
            throw new InsufficientBalanceException("Solde insuffisant");
        }

        AccountOperation operation = new AccountOperation();
        operation.setType(OperationType.DEBIT);
        operation.setAmount(amount);
        operation.setOperationDate(new Date());
        operation.setDescription(description);
        operation.setBankAccount(bankAccount);

        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() - amount);
        bankAccountRepository.save(bankAccount);
    }

    // ============================================================
    // CREDIT
    // ============================================================
    @Override
    public void credit(String accountId, double amount, String description) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Le montant doit être supérieur à 0");
        }

        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("Bank account not found"));

        AccountOperation operation = new AccountOperation();
        operation.setType(OperationType.CREDIT);
        operation.setAmount(amount);
        operation.setOperationDate(new Date());
        operation.setDescription(description);
        operation.setBankAccount(bankAccount);

        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() + amount);
        bankAccountRepository.save(bankAccount);
    }

    // ============================================================
    // TRANSFERT
    // ============================================================
    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount) throws InsufficientBalanceException {
        if (accountIdSource.equals(accountIdDestination)) {
            throw new IllegalArgumentException("Le compte source et destination doivent être différents");
        }

        debit(accountIdSource, amount, "Transfer to " + accountIdDestination);
        credit(accountIdDestination, amount, "Transfer from " + accountIdSource);
    }

    // ============================================================
    // HISTORIQUE
    // ============================================================
    @Override
    public List<AccountOperationDto> getAccountHistory(String accountId) {
        List<AccountOperation> operations = accountOperationRepository.findByBankAccount_Id(accountId);

        return operations.stream()
                .map(mapper::fromAccountOperation)
                .collect(Collectors.toList());
    }

    // ============================================================
    // HISTORIQUE PAGINE
    // ============================================================
    @Override
    public AccountHistoryDto getAccountHistory(String accountId, int page, int size) {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("Bank account not found"));

        Page<AccountOperation> accountOperationPage =
                accountOperationRepository.findByBankAccount_Id(accountId, PageRequest.of(page, size));

        AccountHistoryDto history = new AccountHistoryDto();

        List<AccountOperationDto> operations = accountOperationPage.getContent().stream()
                .map(mapper::fromAccountOperation)
                .collect(Collectors.toList());

        history.setAccountOperationDtos(operations);
        history.setId(bankAccount.getId());
        history.setBalance(bankAccount.getBalance());
        history.setType(bankAccount.getClass().getSimpleName());
        history.setCurrentPage(page);
        history.setPageSize(size);
        history.setTotalPages(accountOperationPage.getTotalPages());

        return history;
    }

    // ============================================================
    // COMPTES D'UN USER
    // ============================================================
    @Override
    public List<BankAccountDto> getBankAccountsByUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CustomerNotFoundException("Utilisateur introuvable"));

        List<BankAccount> bankAccounts = bankAccountRepository.findByCustomer_Id(userId);

        return bankAccounts.stream()
                .map(this::toBankAccountDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // HELPER : mappe un BankAccount vers le bon sous-type de DTO
    // ============================================================
    private BankAccountDto toBankAccountDto(BankAccount account) {
        if (account instanceof SavingAccount savingAccount) {
            return mapper.fromSavingAccount(savingAccount);
        }
        if (account instanceof CurrentAccount currentAccount) {
            return mapper.fromCurrentAccount(currentAccount);
        }
        throw new IllegalArgumentException("Type de compte inconnu : " + account.getClass().getName());
    }
    @Override
    public List<AccountOperationDto> getCustomerOperations(Long customerId){
        userRepository.findById(customerId).orElseThrow(()->new CustomerNotFoundException("Utilisateur introuvable :"+customerId));
        List<AccountOperation> operations=accountOperationRepository.findByBankAccount_Customer_Id(customerId);
        return operations.stream().map(mapper::fromAccountOperation).collect(Collectors.toList());
    }
}
