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
    public ResponseEntity<UserDTO> searchUserByUsername (
            @RequestParam(required = false) String query) {
        UserDTO user = userService.findUserByUsername(query);

        return ResponseEntity.ok(user);
    }
}
