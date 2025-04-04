package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMessageRequest {
    private Long chatId;
    private Integer senderId;
    private String content;
}
