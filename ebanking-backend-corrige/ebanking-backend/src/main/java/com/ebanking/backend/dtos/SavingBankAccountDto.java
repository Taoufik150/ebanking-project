package com.ebanking.backend.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SavingBankAccountDto extends BankAccountDto {

    private double interestRate;
}
