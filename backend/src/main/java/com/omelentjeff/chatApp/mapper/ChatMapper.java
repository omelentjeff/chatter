package com.omelentjeff.chatApp.mapper;

import com.omelentjeff.chatApp.dto.ChatDTO;
import com.omelentjeff.chatApp.models.Chat;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    Chat toChatDTO(Chat chat);

    ChatDTO toEntity(ChatDTO chatDTO);
}
