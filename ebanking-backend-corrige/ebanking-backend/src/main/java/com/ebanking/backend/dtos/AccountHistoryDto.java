package com.ebanking.backend.dtos;

import lombok.Data;

import java.util.List;

@Data
public class AccountHistoryDto {
    private String id;
    private double balance;
    private String type;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private List<AccountOperationDto> accountOperationDtos;
}
