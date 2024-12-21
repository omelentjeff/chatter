package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.repositories.UserChatRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserChatService userChatService;

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

    public List<ChatDTO> findAllChatsById(Integer id) {

        return userChatService.getChatsById(id);
    }
}
