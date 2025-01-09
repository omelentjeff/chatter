package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.MessageReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageReadStatusRepository extends JpaRepository<MessageReadStatus, Long> {

    @Modifying
    @Query("UPDATE MessageReadStatus mrs SET mrs.isRead = true " +
            "WHERE mrs.message.messageId IN :messageIds AND mrs.user.id = :userId")
    void updateReadStatusForUser(List<Long> messageIds, Integer userId);

    @Query("SELECT mrs.message.chat.chatId, COUNT(mrs) " +
            "FROM MessageReadStatus mrs " +
            "WHERE mrs.user.id = :userId AND mrs.isRead = false " +
            "GROUP BY mrs.message.chat.chatId")
    List<Object[]> countUnreadMessagesByUser(Integer userId);
}
