package com.omelentjeff.chatApp.services;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.exception.UserNotFoundException;
import com.omelentjeff.chatApp.mapper.UserMapper;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.repositories.UserChatRepository;
import com.omelentjeff.chatApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserChatService userChatService;
    private final UserMapper userMapper;

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

    public List<ChatDTO> findAllChatsById(Integer id) {

        return userChatService.getChatsById(id);
    }

    public Page<UserDTO> findUserByUsername(String query, Pageable pageable) {
        Page<UserEntity> userPage = userRepository.findByUsernameContainingIgnoreCase(query, pageable);

        List<UserDTO> userDTOS = userPage.stream()
                .map(userMapper::toDTO)
                .toList();

        return new PageImpl<>(userDTOS, pageable, userPage.getTotalElements());

    }
}
