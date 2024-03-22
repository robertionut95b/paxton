package com.irb.paxton.storage;

import com.irb.paxton.core.model.storage.File;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    void init();

    FileResponse store(MultipartFile file, String... additionalPath);

    File store(FileStorageObjectArgs args);

    Resource loadAsResourceFromPath(String filePath);

    void remove(String filePath);

    void deleteAll();

}
