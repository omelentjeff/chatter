package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.Chat;
import com.omelentjeff.chatApp.models.UserChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserChatRepository extends JpaRepository<UserChat, Long> {

    @Query("SELECT uc.chat FROM UserChat uc WHERE uc.user.id = :userId")
    List<Chat> findChatsByUserId(@Param("userId") Integer userId);
}
