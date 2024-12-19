package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.repositories.UserChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserChatService {

    private final UserChatRepository userChatRepository;

    public List<Chat> getChatsById(Integer id) {
        return userChatRepository.findChatsByUserId(id);
    }
}
