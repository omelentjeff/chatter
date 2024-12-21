package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<ChatDTO>> findAllById(@PathVariable Integer id) {
        List<ChatDTO> chats = userService.findAllChatsById(id);
        return ResponseEntity.ok(chats);
    }
}
