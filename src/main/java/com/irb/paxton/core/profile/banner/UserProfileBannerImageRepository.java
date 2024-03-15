package com.irb.paxton.core.profile.banner;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileBannerImageRepository extends AbstractRepository<UserProfileBannerImage> {

    Optional<UserProfileBannerImage> findByName(String name);
}
