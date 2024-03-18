package com.irb.paxton.core.profile.banner;

import com.irb.paxton.core.media.ImageProcessor;
import com.irb.paxton.core.model.AbstractFileEntityRepository;
import com.irb.paxton.core.model.AbstractFileService;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.input.PhotographyInput;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.storage.FileProvider;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.FileStorageException;
import com.irb.paxton.storage.naming.FileNamingStandard;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
public class UserProfileBannerImageService extends AbstractFileService<UserProfileBannerImage> {

    private final UserProfileBannerImageRepository userProfileBannerImageRepository;

    private final UserProfileMapper userProfileMapper;

    private final StorageService storageService;

    private final FileNamingStandard fileNamingStandard;

    private final String STORAGE_PATH = "users/profile/%s/banner";

    protected UserProfileBannerImageService(AbstractFileEntityRepository<UserProfileBannerImage> repository, UserProfileBannerImageRepository userProfileBannerImageRepository, UserProfileMapper userProfileMapper, StorageService storageService, FileNamingStandard fileNamingStandard) {
        super(repository);
        this.userProfileBannerImageRepository = userProfileBannerImageRepository;
        this.userProfileMapper = userProfileMapper;
        this.storageService = storageService;
        this.fileNamingStandard = fileNamingStandard;
    }

    public Optional<UserProfileBannerImage> findByNameOptional(String imageName) {
        return this.userProfileBannerImageRepository.findByName(imageName);
    }

    @Transactional
    @PreAuthorize("authentication.principal.getId() == #photographyInput.userId or hasRole('ROLE_ADMINISTRATOR')")
    public UserProfileBannerImage changeProfileBanner(@NotNull PhotographyInput photographyInput) {
        MultipartFile part;
        try {
            part = this.resizeImageBeforeUpload(photographyInput.getPhotography());
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
        String filename;
        try {
            filename = "%s.%s".formatted(fileNamingStandard.getFileName(part.getBytes()), FilenameUtils.getExtension(part.getOriginalFilename()));
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
        Optional<UserProfileBannerImage> currentBannerOpt = this
                .findByNameOptional(filename);
        UserProfileBannerImage newBanner = currentBannerOpt.orElseGet(() -> userProfileMapper.updateUserProfileBanner(photographyInput));
        UserProfile userProfile = newBanner.getUserProfile();

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = storageService.store(part, STORAGE_PATH.formatted(id));

        newBanner.setName(fr.getName());
        newBanner.setPath(fr.getPath());
        newBanner.setFileType(FileType.parseString(FilenameUtils.getExtension(part.getOriginalFilename())));
        newBanner.setProvider(FileProvider.LOCAL);

        userProfile.setUserProfileBannerImage(newBanner);
        return newBanner;
    }

    private MultipartFile resizeImageBeforeUpload(MultipartFile file) throws IOException {
        return ImageProcessor.resizeImageToMultipartFile(file, "600x250");
    }
}
