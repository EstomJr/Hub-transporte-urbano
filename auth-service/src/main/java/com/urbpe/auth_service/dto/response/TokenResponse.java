package com.urbpe.auth_service.dto.response;

public record TokenResponse(String accessToken, Long expiresIn) {
}
