package com.ebanking.backend.repositories;

import com.ebanking.backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByNomContainingIgnoreCase(String keyword);
}
