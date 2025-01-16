package com.omelentjeff.chatApp.controllers;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserEntity;
import com.omelentjeff.chatApp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
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

    @GetMapping("/search")
    public ResponseEntity<Page<UserDTO>> searchUserByUsername (
            @RequestParam(required = false) String username,
            @PageableDefault(size = 10, sort = "username", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserDTO> users = userService.findUserByUsername(username, pageable);


        if (users.hasContent()) {
            return ResponseEntity.ok(users);
        }

        return ResponseEntity.noContent().build();
    }
}
