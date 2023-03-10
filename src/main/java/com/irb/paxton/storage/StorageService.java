package com.irb.paxton.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface StorageService {

    void init();

    void store(MultipartFile file);

    FileResponse storeWithPaths(MultipartFile file, String... additionalPath);

    Path load(String filename);

    Resource loadAsResource(String filename);

    Resource loadAsResourceFromFullPath(String filePath);

    void remove(String filename);

    void remove(Path filePath);

    void deleteAll();

}
