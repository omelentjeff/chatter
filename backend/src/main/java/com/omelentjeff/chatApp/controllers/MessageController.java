package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getMessagesByChatId(@PathVariable Long chatId) {
        List<Message> messages = messageService.findByChatId(chatId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> saveMessage(@RequestBody createMessageRequest) {
        MessageDTO savedMessage = messageService.save(createMessageRequest);
        return ResponseEntity.ok(savedMessage);
    }
}
