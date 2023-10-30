package com.irb.paxton.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    void init();

    FileResponse store(MultipartFile file, String... additionalPath);

    Resource loadAsResourceFromPath(String filePath);

    void remove(String filePath);

    void deleteAll();

}
