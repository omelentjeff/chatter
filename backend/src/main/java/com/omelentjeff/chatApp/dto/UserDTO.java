package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class UserDTO {
    private Integer id;
    private String email;
    private String username;
}

