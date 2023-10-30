package com.irb.paxton.core.media;

import com.irb.paxton.core.media.exception.PhotographyNotFoundException;
import com.irb.paxton.core.media.input.PhotographyInput;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.StorageService;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
public class PhotographyService {

    @Autowired
    private PhotographyRepository photographyRepository;

    @Autowired
    private UserProfileMapper userProfileMapper;

    @Autowired
    private StorageService storageService;

    public Photography findByName(String imageName) {
        return this.photographyRepository
                .findByName(imageName)
                .orElseThrow(() -> new PhotographyNotFoundException("Image by name %s does not exist".formatted(imageName)));
    }

    @Transactional
    public Photography changeProfileBanner(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography newPhotography = userProfileMapper.updateUserProfileBanner(photographyInput);
        UserProfile userProfile = newPhotography.getUserProfile();
        String currentBanner = userProfile.getCoverPhotography();
        Photography currentPhotography = photographyRepository.findByName(currentBanner)
                .orElse(null);

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = storageService.store(part, id);
        String filePath = fr.getPath();

        newPhotography.setName(fr.getName());
        newPhotography.setPath(filePath);
        userProfile.setCoverPhotography(null);

        if (currentPhotography != null && !currentPhotography.getPath().equals(filePath)) {
            storageService.remove(currentPhotography.getPath());
            log.info("Cleaned old cover newPhotography file within service");
        }
        photographyRepository.save(newPhotography);
        userProfile.setCoverPhotography(newPhotography.getName());
        return newPhotography;
    }

    @Transactional
    public Photography changeProfileAvatar(@NotNull PhotographyInput photographyInput) {
        MultipartFile part = photographyInput.getPhotography();
        Photography newPhotography = userProfileMapper.updateUserProfileAvatar(photographyInput);
        UserProfile userProfile = newPhotography.getUserProfile();
        String currentAvatar = userProfile.getPhotography();
        Photography currentPhotography = photographyRepository.findByName(currentAvatar)
                .orElse(null);

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = storageService.store(part, id);
        String filePath = fr.getPath();

        newPhotography.setName(fr.getName());
        newPhotography.setPath(filePath);
        userProfile.setPhotography(null);

        if (currentPhotography != null && !currentPhotography.getPath().equals(filePath)) {
            storageService.remove(currentPhotography.getPath());
            log.info("Cleaned old avatar newPhotography file within service");
        }
        photographyRepository.save(newPhotography);
        userProfile.setPhotography(newPhotography.getName());
        return newPhotography;
    }
}
