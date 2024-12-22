package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.services.ChatService;
import com.omelentjeff.chatApp.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ChatService chatService;

    @MessageMapping("/chat")
    public void processMessage(@Payload CreateMessageRequest messageRequest) {
        // Save the message and get the full DTO with recipient
        MessageDTO savedMessage = messageService.save(messageRequest);

        // Send the message to the recipient
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getRecipient().getId()), // Use recipient ID
                "/queue/messages",
                savedMessage
        );

        // Send the message back to the sender as well
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.getSender().getId()), // Use sender ID
                "/queue/messages",
                savedMessage
        );
    }


}
