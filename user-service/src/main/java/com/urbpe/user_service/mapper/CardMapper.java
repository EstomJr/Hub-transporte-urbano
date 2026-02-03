package com.urbpe.user_service.mapper;

import com.urbpe.user_service.dto.request.CardRequestDTO;
import com.urbpe.user_service.dto.response.CardResponseDTO;
import com.urbpe.user_service.entity.Card;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CardMapper {
    @Mapping(target = "userId", source = "user.id")
    CardResponseDTO toResponse(Card card);

    Card toEntity(CardRequestDTO request);
}
