package com.ebanking.backend.web;

import com.ebanking.backend.dtos.DashboardDto;
import com.ebanking.backend.dtos.UserDto;
import com.ebanking.backend.services.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public DashboardDto getDashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/profile/{id}")
    public UserDto getProfile(@PathVariable Long id) {
        return dashboardService.getAdminProfile(id);
    }

    @PutMapping("/{adminId}")
    public UserDto updateAdmin(@PathVariable Long adminId, @RequestBody UserDto userDto) {
        userDto.setId(adminId);
        return dashboardService.updateAdmin(userDto);
    }
}
