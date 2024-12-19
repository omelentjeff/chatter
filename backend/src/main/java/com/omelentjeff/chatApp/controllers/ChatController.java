package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody Chat chat) {
        Chat savedChat = chatService.save(chat);
        return ResponseEntity.ok(savedChat);
    }
}
