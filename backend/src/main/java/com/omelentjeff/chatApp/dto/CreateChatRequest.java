package com.omelentjeff.chatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatRequest {
    private boolean isGroup;
    private List<Integer> userIds;
}
