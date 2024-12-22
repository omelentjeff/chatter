package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MessageDTO>> getMessagesByChatId(@PathVariable Long chatId) {
        List<MessageDTO> messages = messageService.findByChatId(chatId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> saveMessage(@RequestBody CreateMessageRequest createMessageRequest) {
        MessageDTO savedMessage = messageService.save(createMessageRequest);
        return ResponseEntity.ok(savedMessage);
    }
}
