package com.irb.paxton.core.profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser_Id(Long id);

    Optional<UserProfile> findByUserUsername(String username);

    Optional<UserProfile> findByProfileSlugUrl(String profileSlugUrl);
}
