package com.irb.paxton.core.media;

import com.irb.paxton.core.media.exception.PhotographyNotFoundException;
import com.irb.paxton.core.media.input.PhotographyInput;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;

@Slf4j
@Service
public class PhotographyService {

    @Autowired
    private PhotographyRepository photographyRepository;

    @Autowired
    private UserProfileMapper userProfileMapper;

    @Autowired
    private StorageService fileStorageService;

    public Photography findByName(String imageName) {
        return this.photographyRepository
                .findByName(imageName)
                .orElseThrow(() -> new PhotographyNotFoundException("Image by name %s does not exist".formatted(imageName)));
    }

    @Transactional
    public Photography changeProfileBanner(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography photography = userProfileMapper.updateUserProfileBanner(photographyInput);
        UserProfile userProfile = photography.getUserProfile();
        String currentBanner = userProfile.getCoverPhotography();

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = fileStorageService.storeWithPaths(part, id);
        String filePath = fr.getPath();

        photography.setName(fr.getName());
        photography.setPath(filePath);
        userProfile.setCoverPhotography(null);

        if (currentBanner != null && !currentBanner.equals(filePath)) {
            fileStorageService.remove(currentBanner);
            log.info("Cleaned old cover photography file within service");
        }
        photographyRepository.save(photography);
        userProfile.setCoverPhotography(photography.getName());
        return photography;
    }

    @Transactional
    public Photography changeProfileAvatar(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography photography = userProfileMapper.updateUserProfileAvatar(photographyInput);
        UserProfile userProfile = photography.getUserProfile();
        String currentAvatar = userProfile.getPhotography();

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = fileStorageService.storeWithPaths(part, id);
        String filePath = fr.getPath();

        photography.setName(fr.getName());
        photography.setPath(filePath);
        userProfile.setPhotography(null);

        if (currentAvatar != null && !currentAvatar.equals(filePath)) {
            fileStorageService.remove(currentAvatar);
            log.info("Cleaned old avatar photography file within service");
        }
        photographyRepository.save(photography);
        userProfile.setPhotography(photography.getName());
        return photography;
    }
}
