package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.CreateChatRequest;
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

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserChatRepository userChatRepository;

    @Transactional
    public Chat save(CreateChatRequest createChatRequest) {

        var tempChat = Chat.builder()
                .chatName(createChatRequest.getChatName())
                .isGroup(createChatRequest.isGroup())
                .build();

        Chat savedChat = chatRepository.save(tempChat);

        List<UserEntity> users = userRepository.findAllById(createChatRequest.getUserIds());

        for (UserEntity user : users) {
            UserChat userChat = new UserChat();
            userChat.setChat(savedChat);
            userChat.setUser(user);
            userChatRepository.save(userChat);
        }

        return savedChat;
    }
}
