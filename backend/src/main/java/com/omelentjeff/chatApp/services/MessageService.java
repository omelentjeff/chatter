package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.CreateMessageRequest;
import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.exception.ChatNotFoundException;
import com.omelentjeff.chatApp.exception.UserNotFoundException;
import com.omelentjeff.chatApp.mapper.ChatMapper;
import com.omelentjeff.chatApp.mapper.MessageMapper;
import com.omelentjeff.chatApp.mapper.UserMapper;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.models.UserChat;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.repositories.ChatRepository;
import com.omelentjeff.chatApp.repositories.MessageRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final MessageMapper messageMapper;

    public List<MessageDTO> findByChatId(Long chatId) {

        List<Message> messages = messageRepository.findByChatChatId(chatId);
        Chat foundChat = chatRepository.findById(chatId).orElseThrow(() -> new ChatNotFoundException("Chat not found"));

        List<Integer> userIds = foundChat.getUserChats().stream()
                .map(userChat -> userChat.getUser().getId())
                .toList();



        return messages.stream()
                .map(message -> {
                    MessageDTO messageDTO = messageMapper.toDTO(message);
                    messageDTO.setChat(chatMapper.toChatDTO(foundChat));
                    messageDTO.setSender(userMapper.toDTO(message.getSender()));

                    UserEntity recipient = foundChat.getUserChats().stream()
                            .map(UserChat::getUser)
                            .filter(user -> !user.equals(message.getSender()))
                            .findFirst()
                            .orElseThrow(() -> new UserNotFoundException("Recipient not found"));

                    messageDTO.setRecipient(userMapper.toDTO(recipient));
                    return messageDTO;
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public MessageDTO save(CreateMessageRequest createMessageRequest) {
        Chat foundChat = chatRepository.findById(createMessageRequest.getChatId()).orElseThrow(() -> new ChatNotFoundException("Chat not found"));

        UserEntity sender = userRepository.findById(createMessageRequest.getSenderId()).orElseThrow(() -> new UserNotFoundException("User not found with id"));

        var message = Message.builder()
                        .chat(foundChat)
                        .sender(sender).content(createMessageRequest.getContent()).build();

        messageRepository.save(message);

        List<UserEntity> users = foundChat.getUserChats().stream()
                .map(UserChat::getUser)
                .toList();

        UserEntity recipient = users.stream()
                .filter(user -> !user.equals(sender))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        UserDTO senderDTO = userMapper.toDTO(sender);
        UserDTO recipientDTO = userMapper.toDTO(recipient);
        ChatDTO chatDTO = chatMapper.toChatDTO(foundChat);
        MessageDTO messageDTO = messageMapper.toDTO(message);

        messageDTO.setSender(senderDTO);
        messageDTO.setRecipient(recipientDTO);
        messageDTO.setChat(chatDTO);

        return messageDTO;
    }
}