package com.ebanking.backend.services;

import com.ebanking.backend.dtos.*;
import com.ebanking.backend.exceptions.InsufficientBalanceException;

import java.util.List;

public interface BankAccountService {

    // =========================
    // USERS
    // =========================

    UserDto saveUser(UserDto userDto);

    List<UserDto> listUsers();

    UserDto getUser(Long id);

    UserDto updateUser(UserDto userDto);

    void deleteUser(Long userId);

    List<UserDto> searchUsers(String keyword);

    // =========================
    // BANK ACCOUNTS
    // =========================

    CurrentBankAccountDto saveCurrentBankAccount(double initialBalance, double overdraft, Long userId);

    SavingBankAccountDto saveSavingBankAccount(double initialBalance, double interestRate, Long userId);

    List<BankAccountDto> bankAccountList();

    BankAccountDto getBankAccount(String accountId);

    List<BankAccountDto> getBankAccountsByUser(Long userId);

    // =========================
    // OPERATIONS
    // =========================

    void debit(String accountId, double amount, String description) throws InsufficientBalanceException;

    void credit(String accountId, double amount, String description);

    void transfer(String accountIdSource, String accountIdDestination, double amount) throws InsufficientBalanceException;

    // =========================
    // HISTORY
    // =========================

    List<AccountOperationDto> getAccountHistory(String accountId);

    AccountHistoryDto getAccountHistory(String accountId, int page, int size);
    List<AccountOperationDto> getCustomerOperations(Long customerId);
}
