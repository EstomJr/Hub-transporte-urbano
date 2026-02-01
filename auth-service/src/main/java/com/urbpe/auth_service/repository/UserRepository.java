package com.urbpe.auth_service.repository;

import com.urbpe.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<UserDetails> findeUserByEmail(String username);
}
