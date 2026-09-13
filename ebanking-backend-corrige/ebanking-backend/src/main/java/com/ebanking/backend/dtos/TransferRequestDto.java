package com.ebanking.backend.dtos;

import lombok.Data;

@Data
public class TransferRequestDto {
    private String accountIdSource;
    private String accountIdDestination;
    private double amount;
}
