package com.ebanking.backend.services;

import com.ebanking.backend.dtos.DashboardDto;
import com.ebanking.backend.dtos.UserDto;

public interface DashboardService {
    DashboardDto getDashboard();
    UserDto getAdminProfile(Long id);
    UserDto updateAdmin(UserDto userDto);
}
