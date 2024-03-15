package com.irb.paxton.core.profile.avatar;

import com.irb.paxton.core.media.ImageProcessor;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.input.PhotographyInput;
import com.irb.paxton.core.profile.mapper.UserProfileMapper;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.storage.FileProvider;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.FileServingService;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.FileStorageException;
import com.irb.paxton.storage.naming.FileNamingStandard;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
public class UserProfileAvatarImageService extends AbstractService<UserProfileAvatarImage> {

    private final UserProfileAvatarImageRepository userProfileAvatarImageRepository;

    private final UserProfileMapper userProfileMapper;

    private final StorageService storageService;

    private final FileNamingStandard fileNamingStandard;

    private final FileServingService fileServingService;

    protected UserProfileAvatarImageService(AbstractRepository<UserProfileAvatarImage> repository, UserProfileAvatarImageRepository userProfileAvatarImageRepository, UserProfileMapper userProfileMapper, StorageService storageService, FileNamingStandard fileNamingStandard, FileServingService fileServingService) {
        super(repository);
        this.userProfileAvatarImageRepository = userProfileAvatarImageRepository;
        this.userProfileMapper = userProfileMapper;
        this.storageService = storageService;
        this.fileNamingStandard = fileNamingStandard;
        this.fileServingService = fileServingService;
    }

    public Optional<UserProfileAvatarImage> findByNameAndUserIdOpt(String imageName) {
        return this.userProfileAvatarImageRepository.findByName(imageName);
    }

    @Transactional
    @PreAuthorize("authentication.principal.getId() == #photographyInput.userId or hasRole('ROLE_ADMINISTRATOR')")
    public UserProfileAvatarImage changeProfileAvatar(@NotNull PhotographyInput photographyInput) {
        String storagePath = "users/profile/%s/avatar";
        MultipartFile part;
        try {
            part = resizeImageBeforeUpload(photographyInput.getPhotography());
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
        String filename;
        try {
            filename = "%s.%s".formatted(fileNamingStandard.getFileName(part.getBytes()), FilenameUtils.getExtension(part.getOriginalFilename()));
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
        Optional<UserProfileAvatarImage> currentAvatarOpt = findByNameAndUserIdOpt(filename);
        UserProfileAvatarImage newAvatar = currentAvatarOpt.orElseGet(() -> userProfileMapper.updateUserProfileAvatar(photographyInput));
        UserProfile userProfile = newAvatar.getUserProfile();

        String id = userProfile.getUser().getId().toString();
        FileResponse fr = storageService.store(part, storagePath.formatted(id));

        newAvatar.setName(fr.getName());
        newAvatar.setPath(fr.getPath());
        newAvatar.setFileType(FileType.parseString(FilenameUtils.getExtension(part.getOriginalFilename())));
        newAvatar.setProvider(FileProvider.LOCAL);

        userProfile.setUserProfileAvatarImage(newAvatar);
        return newAvatar;
    }

    private MultipartFile resizeImageBeforeUpload(MultipartFile file) throws IOException {
        return ImageProcessor.resizeImageToMultipartFile(file, "250x250");
    }

    public UserProfileAvatarImage getOAuth2UserAvatarImage(String fileUrl, User user) {
        String fileExtension = FilenameUtils.getExtension(fileUrl);
        String fileExt = null;
        ResponseEntity<byte[]> responseEntity = null;
        if (FileType.parseString(fileExtension) == null) {
            responseEntity = this.fileServingService.getFromUrlAsResp(fileUrl);
            fileExt = this.fileServingService.getExtensionFromUrlFile(responseEntity);
        }
        if (responseEntity == null || !responseEntity.hasBody()) {
            return null;
        }
        String fileName;
        try {
            fileName = "%s.%s".formatted(fileNamingStandard.getFileName(responseEntity.getBody()), fileExt);
        } catch (IOException e) {
            throw new FileStorageException("Could not store avatar file", e);
        }
        Optional<UserProfileAvatarImage> profileAvatarOpt = this.findByNameAndUserIdOpt(fileName);
        if (profileAvatarOpt.isPresent()) {
            return profileAvatarOpt.get();
        }
        return new UserProfileAvatarImage(fileName, fileUrl, FileType.parseString(fileExt), FileProvider.OAUTH, user.getUserProfile());
    }
}
