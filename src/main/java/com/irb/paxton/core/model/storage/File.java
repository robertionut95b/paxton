package com.irb.paxton.core.model.storage;

import com.irb.paxton.storage.FileProvider;

public interface File {

    String getName();

    String getPath();

    FileType getFileType();

    FileProvider getProvider();

}
