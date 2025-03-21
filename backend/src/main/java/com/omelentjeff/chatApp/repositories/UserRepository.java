package com.omelentjeff.chatApp.repositories;

import com.omelentjeff.chatApp.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);

    Page<UserEntity> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
}
