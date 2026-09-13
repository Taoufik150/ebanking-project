package com.ebanking.backend.dtos;

import lombok.Data;

@Data
public class NewBankAccountRequestDto {
    private double initialBalance;
    // overdraft for a current account, interest rate for a saving account
    private double rate;
    private Long customerId;
}
