package com.ebanking.backend.dtos;

import com.ebanking.backend.entities.AccountStatus;
import lombok.Data;

import java.util.Date;

@Data
public class BankAccountDto {

    private String id;
    private double balance;
    private Date creationDate;
    private AccountStatus status;
    private UserDto customerDto;
}
