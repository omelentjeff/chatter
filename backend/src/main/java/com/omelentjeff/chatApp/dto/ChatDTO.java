package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatDTO {
    private Long chatId;
    private String chatName;
    private boolean isGroup;
    private List<Long> userIds;
}
