package com.omelentjeff.chatApp.services;

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
    public Chat save(Chat chat, List<Integer> userIds) {

        Chat savedChat = chatRepository.save(chat);

        List<UserEntity> users = userRepository.findAllById(userIds);

        for (UserEntity user : users) {
            UserChat userChat = new UserChat();
            userChat.setChat(savedChat);
            userChat.setUser(user);
            userChatRepository.save(userChat);
        }

        return savedChat;
    }
}
