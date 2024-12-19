package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
}
