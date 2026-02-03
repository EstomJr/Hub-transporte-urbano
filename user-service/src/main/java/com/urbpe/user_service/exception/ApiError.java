package com.urbpe.user_service.exception;

import java.time.LocalDateTime;

public class ApiError {
    private String message;
    private LocalDateTime timestamp;

    public ApiError() {
    }

    public ApiError(String message, LocalDateTime timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
