package com.irb.paxton.storage.naming;

import com.irb.paxton.config.properties.FileStorageProperties;
import com.irb.paxton.utils.ByteUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Sha256FileNaming implements FileNamingStandard {

    private final FileStorageProperties fileStorageProperties;

    @Override
    public String getFileName(byte[] bytesContent) throws IOException {
        byte[] salt = fileStorageProperties.getSaltValue().getBytes();
        return DigestUtils.sha256Hex(ByteUtils.addByteArraysWithSalt(bytesContent, salt));
    }
}
