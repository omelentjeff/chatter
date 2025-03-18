package com.omelentjeff.chatApp.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IsTypingRequest {
    private Long chatId;
    private Integer senderId;
    private boolean isTyping;
}
