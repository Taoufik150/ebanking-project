package com.ebanking.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private Long totalCustomers;
    private Long totalAccounts;
    private Double totalBalance;
    private Long totalOperations;
}
