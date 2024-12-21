package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.mapper.UserMapper;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.repositories.ChatRepository;
import com.omelentjeff.chatApp.repositories.MessageRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<Message> findByChatId(Long chatId) {
        return messageRepository.findByChatChatId(chatId);
    }

    public MessageDTO save(CreateMessageRequest createMessageRequest) {
        Chat foundChat = chatRepository.findById(createMessageRequest.getChatId()).orElse(null);

        UserEntity sender = userRepository.findById(createMessageRequest.getSenderId()).orElse(null);

        var message = Message.builder()
                        .chat(foundChat)
                        .sender(sender).content(createMessageRequest.getContent()).build();

        messageRepository.save(message);

        UserDTO userDTO = userMapper.toDTO(sender);
        System.out.println(userDTO);

        return MessageDTO.builder()
                .messageId(message.getMessageId())
                .sender(userDTO)
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}