package com.irb.paxton.core.media;

import com.irb.paxton.core.media.input.PhotographyInput;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.UserProfileRepository;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class PhotographyService {

    @Autowired
    private PhotographyRepository photographyRepository;
    @Autowired
    private UserProfileMapper userProfileMapper;
    @Autowired
    private UserProfileRepository userProfileRepository;
    @Autowired
    private FileStorageService fileStorageService;

    public Photography changeProfileBanner(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography photography = userProfileMapper.updateUserProfileBanner(photographyInput);
        UserProfile userProfile = photography.getUserProfile();
        String id = userProfile.getUser().getId().toString();

        FileResponse fr = fileStorageService.storeFile(part, id);
        String filePath = fr.getPath();

        photography.setPath(filePath);
        userProfile.setCoverPhotography(filePath);

        photographyRepository.save(photography);
        userProfileRepository.save(userProfile);

        return photography;
    }

    public Photography changeProfileAvatar(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography photography = userProfileMapper.updateUserProfileBanner(photographyInput);
        UserProfile userProfile = photography.getUserProfile();
        String id = userProfile.getUser().getId().toString();

        FileResponse fr = fileStorageService.storeFile(part, id);
        String filePath = fr.getPath();

        photography.setPath(filePath);
        userProfile.setPhotography(filePath);

        photographyRepository.save(photography);
        userProfileRepository.save(userProfile);

        return photography;
    }
}
