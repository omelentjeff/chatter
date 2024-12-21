package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.mapper.ChatMapper;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.repositories.UserChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserChatService {

    private final UserChatRepository userChatRepository;
    private final ChatMapper chatMapper;

    public List<ChatDTO> getChatsById(Integer id) {
        List<Chat> chats = userChatRepository.findChatsByUserId(id);

        return chats.stream().map(chatMapper::toChatDTO).toList();
    }
}
