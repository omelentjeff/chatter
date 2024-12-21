package com.omelentjeff.chatApp.mapper;

import com.omelentjeff.chatApp.dto.MessageDTO;
import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.models.Message;
import com.omelentjeff.chatApp.models.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    MessageDTO toDTO(Message message);

    Message toEntity(MessageDTO messageDTO);
}