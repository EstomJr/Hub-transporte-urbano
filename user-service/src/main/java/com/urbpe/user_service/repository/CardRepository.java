package com.urbpe.user_service.repository;

import com.urbpe.user_service.entity.Card;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Long> {
    @Query(value = "SELECT * FROM cards WHERE user_id = :userId", nativeQuery = true)
    List<Card> findAllByUserId(@Param("userId") Long userId);

    long countByStatus(boolean status);
}
