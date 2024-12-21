package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class MessageDTO {
    private Long messageId;
    private UserDTO sender;
    private ChatDTO chat;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

