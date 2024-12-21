package com.omelentjeff.chatApp.mapper;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserChat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    @Mapping(target = "userIds", source = "userChats", qualifiedByName = "mapUserIds")
    ChatDTO toChatDTO(Chat chat);

    Chat toEntity(ChatDTO chatDTO);

    @Named("mapUserIds")
    default List<Integer> mapUserIds(List<UserChat> userChats) {
        return userChats.stream()
                .map(userChat -> userChat.getUser().getId())
                .collect(Collectors.toList());
    }

}
