package com.ebanking.backend.dtos;

import lombok.Data;

@Data
public class DebitCreditRequestDto {
    private String accountId;
    private double amount;
    private String description;
}
