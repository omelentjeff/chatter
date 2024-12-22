package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.CreateChatRequest;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chats")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatDTO> createChat(@RequestBody CreateChatRequest createChatRequest) {
        ChatDTO savedChat = chatService.save(createChatRequest);
        return ResponseEntity.ok(savedChat);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDTO> findChatById(@PathVariable Long id) {
        ChatDTO chat = chatService.findById(id);
        return ResponseEntity.ok(chat);
    }
}
