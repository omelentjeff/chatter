package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatChatId(Long chatId);
}
