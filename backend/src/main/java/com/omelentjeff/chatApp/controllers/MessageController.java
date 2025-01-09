package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MarkAsReadRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/chat/{chatId}/markAsRead")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long chatId, @RequestBody MarkAsReadRequest request) {
        messageService.markMessagesAsRead(chatId, request.getUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unreadCounts")
    public ResponseEntity<Map<Long, Integer>> getUnreadMessageCounts(@RequestParam Integer userId) {
        Map<Long, Integer> unreadCounts = messageService.getUnreadMessageCounts(userId);
        return ResponseEntity.ok(unreadCounts);
    }


}
