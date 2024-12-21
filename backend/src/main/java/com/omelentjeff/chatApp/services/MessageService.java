package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.mapper.ChatMapper;
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
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ChatMapper chatMapper;

    public List<MessageDTO> findByChatId(Long chatId) {

        List<Message> messages = messageRepository.findByChatChatId(chatId);
        Chat foundChat = chatRepository.findById(chatId).orElse(null);

        List<Integer> userIds = foundChat.getUserChats().stream()
                .map(userChat -> userChat.getUser().getId())
                .toList();


        var chatDTO = chatMapper.toChatDTO(foundChat);

        return messages.stream()
                .map(message -> {
                    var recipientId = userIds.stream()
                            .filter(id -> !Objects.equals(id, message.getSender().getId()))
                            .findFirst()
                            .orElse(null);

                    UserEntity recipient = userRepository.findById(recipientId).orElse(null);

                    return MessageDTO.builder()
                        .messageId(message.getMessageId())
                        .sender(userMapper.toDTO(message.getSender()))
                            .recipient(userMapper.toDTO(recipient))
                        .chat(chatDTO)
                        .content(message.getContent())
                        .createdAt(message.getCreatedAt())
                        .updatedAt(message.getUpdatedAt())
                        .build();
        }).collect(Collectors.toList());
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