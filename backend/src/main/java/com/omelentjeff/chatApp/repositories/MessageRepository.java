package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatChatId(Long chatId);
    List<Message> findByChatChatIdAndSenderIdNotAndReadStatusFalse(Long chatId, Integer userId);

    @Query("SELECT m.chat.chatId, COUNT(m) " +
            "FROM Message m " +
            "WHERE m.readStatus = false AND m.chat IN " +
            "(SELECT uc.chat FROM UserChat uc WHERE uc.user.id = :userId) " +
            "GROUP BY m.chat.chatId")
    List<Object[]> findUnreadMessageCounts(@Param("userId") Integer userId);

}
