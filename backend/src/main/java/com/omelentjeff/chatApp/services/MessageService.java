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
import com.omelentjeff.chatApp.models.*;
import com.omelentjeff.chatApp.repositories.ChatRepository;
import com.omelentjeff.chatApp.repositories.MessageReadStatusRepository;
import com.omelentjeff.chatApp.repositories.MessageRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
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
    private final MessageReadStatusRepository messageReadStatusRepository;

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
                    messageDTO.setReadStatus(message.isReadStatus());
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
                        .sender(sender).content(createMessageRequest.getContent()).readStatus(false).build();

        messageRepository.save(message);

        List<UserEntity> users = foundChat.getUserChats().stream()
                .map(UserChat::getUser)
                .toList();

        // Add read status for the sender (this will be marked as read immediately)
        MessageReadStatus senderReadStatus = MessageReadStatus.builder()
                .message(message)
                .user(sender)
                .isRead(true)  // Sender has read the message
                .build();

        messageReadStatusRepository.save(senderReadStatus);

        UserEntity recipient = users.stream()
                .filter(user -> !user.equals(sender))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Add read status for the sender (this will be marked as read immediately)
        MessageReadStatus recipientReadStatus = MessageReadStatus.builder()
                .message(message)
                .user(recipient)
                .isRead(false)  // Recipient has not read the message
                .build();

        messageReadStatusRepository.save(recipientReadStatus);

        UserDTO senderDTO = userMapper.toDTO(sender);
        UserDTO recipientDTO = userMapper.toDTO(recipient);
        ChatDTO chatDTO = chatMapper.toChatDTO(foundChat);
        MessageDTO messageDTO = messageMapper.toDTO(message);

        messageDTO.setSender(senderDTO);
        messageDTO.setRecipient(recipientDTO);
        messageDTO.setChat(chatDTO);

        return messageDTO;
    }

    @Transactional
    public void markMessagesAsRead(Long chatId, Integer userId) {
        List<Message> messages = messageRepository.findByChatChatId(chatId);
        List<Long> messageIds = messages.stream()
                .map(Message::getMessageId)
                .toList();

        // Update read status for the user
        messageReadStatusRepository.updateReadStatusForUser(messageIds, userId);
    }

    @Transactional(readOnly = true)
    public Map<Long, Integer> getUnreadMessageCounts(Integer userId) {
        List<Object[]> unreadCounts = messageReadStatusRepository.countUnreadMessagesByUser(userId);

        return unreadCounts.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // Chat ID
                        row -> ((Number) row[1]).intValue() // Count of unread messages
                ));
    }
}