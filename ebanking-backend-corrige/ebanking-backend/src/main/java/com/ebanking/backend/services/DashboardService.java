package com.ebanking.backend.services;

import com.ebanking.backend.dtos.DashboardDto;
import com.ebanking.backend.dtos.UserDto;

public interface DashboardService {
    DashboardDto getDashboard();
    UserDto getUserProfile(Long id);
    UserDto updateUser(UserDto userDto);
}
