package com.urbpe.user_service.mapper;

import com.urbpe.user_service.dto.request.UserRequestDTO;
import com.urbpe.user_service.dto.response.UserResponseDTO;
import com.urbpe.user_service.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = CardMapper.class)
public interface UserMapper {
    User toEntity(UserRequestDTO request);

    UserResponseDTO toResponse(User user);
}
