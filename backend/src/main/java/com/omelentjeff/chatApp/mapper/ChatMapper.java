package com.omelentjeff.chatApp.mapper;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserChat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    @Mapping(target = "users", source = "userChats", qualifiedByName = "mapUsers")
    ChatDTO toChatDTO(Chat chat);

    Chat toEntity(ChatDTO chatDTO);

    @Named("mapUsers")
    default List<UserDTO> mapUsers(List<UserChat> userChats) {
        return userChats.stream()
                .map(UserChat::getUser)
                .map(user -> new UserDTO(user.getId(), user.getEmail(), user.getUsername())) // Convert UserEntity to UserDTO
                .collect(Collectors.toList());
    }
}
