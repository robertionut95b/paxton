package com.irb.paxton.core.profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    public Optional<UserProfile> findByUserUsername(String username);

    Optional<UserProfile> findByProfileSlugUrl(String profileSlugUrl);
}
