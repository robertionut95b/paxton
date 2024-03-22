package com.irb.paxton.storage;

import com.irb.paxton.core.model.storage.File;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.core.model.storage.ImageFile;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileImageResponse implements File, ImageFile {

    private String name;

    private String path;

    private FileType fileType;

    private FileProvider provider = FileProvider.LOCAL;

    private int width;

    private int height;

    private float quality;
}
