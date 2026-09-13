package com.ebanking.backend.dtos;

import com.ebanking.backend.entities.OperationType;
import lombok.Data;

import java.util.Date;

@Data
public class AccountOperationDto {

    private Long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
}
