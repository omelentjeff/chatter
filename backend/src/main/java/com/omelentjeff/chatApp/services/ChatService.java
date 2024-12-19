package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.repositories.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public Chat save(Chat chat) {
        return chatRepository.save(chat);
    }
}
