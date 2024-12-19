package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<Message> findByChatId(Long chatId) {
        return messageRepository.findByChatChatId(chatId);
    }
}
