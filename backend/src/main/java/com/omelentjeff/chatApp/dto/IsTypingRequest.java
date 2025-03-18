package com.omelentjeff.chatApp.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IsTypingRequest {
    private Long chatId;
    private Integer recipientId;
    private Integer senderId;

    @JsonProperty("isTyping")
    private boolean isTyping;
}
