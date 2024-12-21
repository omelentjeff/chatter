package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ChatDTO {
    private Long chatId;
    private String chatName;
    private boolean isGroup;
    private List<Integer> userIds;
}
