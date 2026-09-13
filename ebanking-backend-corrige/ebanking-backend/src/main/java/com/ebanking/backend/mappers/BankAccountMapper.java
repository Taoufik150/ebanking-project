package com.ebanking.backend.mappers;

import com.ebanking.backend.dtos.*;
import com.ebanking.backend.entities.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class BankAccountMapper {

    // ============================================================
    // ACCOUNT OPERATION -> DTO
    // ============================================================
    public AccountOperationDto fromAccountOperation(
            AccountOperation accountOperation) {

        AccountOperationDto dto = new AccountOperationDto();

        BeanUtils.copyProperties(accountOperation, dto);

        return dto;
    }


    // ============================================================
    // ADMIN -> USER DTO
    // ============================================================
    public UserDto fromAdmin(Admin admin) {

        UserDto dto = new UserDto();

        BeanUtils.copyProperties(admin, dto);

        return dto;
    }


    // ============================================================
    // CUSTOMER -> USER DTO
    // ============================================================
    public UserDto fromCustomer(Customer customer) {

        UserDto dto = new UserDto();

        BeanUtils.copyProperties(customer, dto);

        return dto;
    }


    // ============================================================
    // USER -> USER DTO
    // ============================================================
    public UserDto fromUser(User user) {

        UserDto dto = new UserDto();

        BeanUtils.copyProperties(user, dto);

        return dto;
    }


    // ============================================================
    // USER DTO -> CUSTOMER
    // ============================================================
    public Customer customerFromDto(UserDto userDto) {

        Customer customer = new Customer();

        BeanUtils.copyProperties(userDto, customer);

        return customer;
    }


    // ============================================================
    // USER DTO -> USER
    // ============================================================
    public User fromUserDto(UserDto userDto) {

        Customer customer = new Customer();

        BeanUtils.copyProperties(userDto, customer);

        return customer;
    }


    // ============================================================
    // BANK ACCOUNT -> DTO
    // ============================================================
    public BankAccountDto fromBankAccount(BankAccount bankAccount) {

        BankAccountDto dto = new BankAccountDto();

        BeanUtils.copyProperties(bankAccount, dto);

        if (bankAccount.getCustomer() != null) {
            dto.setCustomerDto(
                    fromCustomer(bankAccount.getCustomer())
            );
        }

        return dto;
    }


    // ============================================================
    // CURRENT ACCOUNT -> DTO
    // ============================================================
    public CurrentBankAccountDto fromCurrentAccount(
            CurrentAccount account) {

        CurrentBankAccountDto dto =
                new CurrentBankAccountDto();

        BeanUtils.copyProperties(account, dto);

        if (account.getCustomer() != null) {
            dto.setCustomerDto(
                    fromCustomer(account.getCustomer())
            );
        }

        return dto;
    }


    // ============================================================
    // SAVING ACCOUNT -> DTO
    // ============================================================
    public SavingBankAccountDto fromSavingAccount(
            SavingAccount account) {

        SavingBankAccountDto dto =
                new SavingBankAccountDto();

        BeanUtils.copyProperties(account, dto);

        if (account.getCustomer() != null) {
            dto.setCustomerDto(
                    fromCustomer(account.getCustomer())
            );
        }

        return dto;
    }


    // ============================================================
    // BANK ACCOUNT DTO -> BANK ACCOUNT
    // ============================================================
    public BankAccount fromBankAccountDto(
            BankAccountDto dto) {

        BankAccount account = new BankAccount();

        BeanUtils.copyProperties(dto, account);

        return account;
    }


    // ============================================================
    // CURRENT ACCOUNT DTO -> CURRENT ACCOUNT
    // ============================================================
    public CurrentAccount currentAccountFromDto(
            CurrentBankAccountDto dto) {

        CurrentAccount account =
                new CurrentAccount();

        BeanUtils.copyProperties(dto, account);

        if (dto.getCustomerDto() != null) {
            account.setCustomer(
                    customerFromDto(dto.getCustomerDto())
            );
        }

        return account;
    }


    // ============================================================
    // SAVING ACCOUNT DTO -> SAVING ACCOUNT
    // ============================================================
    public SavingAccount savingAccountFromDto(
            SavingBankAccountDto dto) {

        SavingAccount account =
                new SavingAccount();

        BeanUtils.copyProperties(dto, account);

        if (dto.getCustomerDto() != null) {
            account.setCustomer(
                    customerFromDto(dto.getCustomerDto())
            );
        }

        return account;
    }
}