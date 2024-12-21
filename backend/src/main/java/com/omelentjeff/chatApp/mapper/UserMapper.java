package com.omelentjeff.chatApp.mapper;

import com.omelentjeff.chatApp.dto.UserDTO;
import com.omelentjeff.chatApp.models.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(UserEntity user);

    UserEntity toEntity(UserDTO userDTO);
}