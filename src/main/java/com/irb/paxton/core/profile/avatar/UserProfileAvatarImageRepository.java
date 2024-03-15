package com.irb.paxton.core.profile.avatar;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileAvatarImageRepository extends AbstractRepository<UserProfileAvatarImage> {

    Optional<UserProfileAvatarImage> findByName(String name);

}
