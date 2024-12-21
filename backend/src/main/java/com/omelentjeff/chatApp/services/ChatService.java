package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.CreateChatRequest;
import com.omelentjeff.chatApp.mapper.ChatMapper;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserChat;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.repositories.ChatRepository;
import com.omelentjeff.chatApp.repositories.UserChatRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserChatRepository userChatRepository;
    private final ChatMapper chatMapper;

    public ChatDTO findById(Long id) {
        Chat tempChat = chatRepository.findById(id).orElseThrow();

        List<Integer> userIds = tempChat.getUserChats().stream()
                .map(userChat -> userChat.getUser().getId())
                .toList();

        return ChatDTO.builder()
                .chatId(tempChat.getChatId())
                .chatName(tempChat.getChatName())
                .isGroup(tempChat.isGroup())
                .userIds(userIds)
                .build();
    }

    @Transactional
    public ChatDTO save(CreateChatRequest createChatRequest) {

        List<UserEntity> users = userRepository.findAllById(createChatRequest.getUserIds());

        // Dynamically generate the chat name based on usernames
        String chatName = users.stream()
                .map(UserEntity::getUsername)
                .sorted()
                .collect(Collectors.joining("_"));

        // Create and save the chat with the generated chatName
        var tempChat = Chat.builder()
                .chatName(chatName)
                .isGroup(createChatRequest.isGroup())
                .build();

        Chat savedChat = chatRepository.save(tempChat);

        // Save user-chat relationships
        for (UserEntity user : users) {
            UserChat userChat = new UserChat();
            userChat.setChat(savedChat);
            userChat.setUser(user);
            userChatRepository.save(userChat);
        }

        return ChatDTO.builder()
                .chatId(savedChat.getChatId())
                .chatName(chatName)
                .isGroup(savedChat.isGroup())
                .userIds(createChatRequest.getUserIds())
                .build();
    }

}
