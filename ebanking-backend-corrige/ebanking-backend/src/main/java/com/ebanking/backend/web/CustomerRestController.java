package com.ebanking.backend.web;

import com.ebanking.backend.dtos.UserDto;
import com.ebanking.backend.services.BankAccountService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
@CrossOrigin("*")
public class CustomerRestController {

    private final BankAccountService bankAccountService;

    @GetMapping("/customers")
    public List<UserDto> listCustomers() {
        return bankAccountService.listUsers();
    }

    @GetMapping("/customers/search")
    public List<UserDto> searchCustomers(@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        return bankAccountService.searchUsers(keyword);
    }

    @GetMapping("/customers/{id}")
    public UserDto getCustomer(@PathVariable(name = "id") Long customerId) {
        return bankAccountService.getUser(customerId);
    }

    @PostMapping("/customers")
    public UserDto saveCustomer(@RequestBody UserDto customerDto) {
        return bankAccountService.saveUser(customerDto);
    }

    @PutMapping("/customers/{customerId}")
    public UserDto updateCustomer(@PathVariable Long customerId, @RequestBody UserDto customerDto) {
        customerDto.setId(customerId);
        return bankAccountService.updateUser(customerDto);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        bankAccountService.deleteUser(id);
    }
}
