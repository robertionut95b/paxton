package com.irb.paxton.storage;

import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.model.storage.FileType;
import lombok.Data;

@Data
public class FileResponse implements File {

    private String name;

    private String path;

    private FileType fileType;

    public FileResponse(String name, String path, FileType fileType) {
        this.name = name;
        this.path = path;
        this.fileType = fileType;
    }
}
