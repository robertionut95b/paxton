package com.irb.paxton.storage.naming;

import java.io.IOException;

public interface FileNamingStandard {

    String getFileName(byte[] bytesContent) throws IOException;

}
