package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
}
