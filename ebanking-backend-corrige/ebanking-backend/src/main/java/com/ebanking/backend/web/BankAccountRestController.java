package com.ebanking.backend.web;

import com.ebanking.backend.dtos.*;
import com.ebanking.backend.exceptions.InsufficientBalanceException;
import com.ebanking.backend.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class BankAccountRestController {

    private final BankAccountService bankAccountService;

    public BankAccountRestController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping("/accounts/{accountId}")
    public BankAccountDto getBankAccount(@PathVariable String accountId) {
        return bankAccountService.getBankAccount(accountId);
    }

    @GetMapping("/accounts")
    public List<BankAccountDto> listBankAccounts() {
        return bankAccountService.bankAccountList();
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDto> getAccountHistory(@PathVariable String accountId) {
        return bankAccountService.getAccountHistory(accountId);
    }

    @GetMapping("/accounts/{accountId}/pageoperations")
    public AccountHistoryDto getAccountHistory(
            @PathVariable String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        return bankAccountService.getAccountHistory(accountId, page, size);
    }

    @PostMapping("/accounts/current")
    public CurrentBankAccountDto newCurrentAccount(@RequestBody NewBankAccountRequestDto request) {
        return bankAccountService.saveCurrentBankAccount(
                request.getInitialBalance(), request.getRate(), request.getCustomerId());
    }

    @PostMapping("/accounts/saving")
    public SavingBankAccountDto newSavingAccount(@RequestBody NewBankAccountRequestDto request) {
        return bankAccountService.saveSavingBankAccount(
                request.getInitialBalance(), request.getRate(), request.getCustomerId());
    }

    @PostMapping("/accounts/debit")
    public DebitCreditRequestDto debit(@RequestBody DebitCreditRequestDto request) throws InsufficientBalanceException {
        bankAccountService.debit(request.getAccountId(), request.getAmount(), request.getDescription());
        return request;
    }

    @PostMapping("/accounts/credit")
    public DebitCreditRequestDto credit(@RequestBody DebitCreditRequestDto request) {
        bankAccountService.credit(request.getAccountId(), request.getAmount(), request.getDescription());
        return request;
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestBody TransferRequestDto request) throws InsufficientBalanceException {
        bankAccountService.transfer(
                request.getAccountIdSource(), request.getAccountIdDestination(), request.getAmount());
    }

    @GetMapping("/customers/{customerId}/accounts")
    public List<BankAccountDto> getCustomerAccounts(@PathVariable Long customerId) {
        return bankAccountService.getBankAccountsByUser(customerId);
    }
}
