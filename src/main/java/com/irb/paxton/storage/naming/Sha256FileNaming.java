package com.irb.paxton.storage.naming;

import com.irb.paxton.config.properties.FileStorageProperties;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Sha256FileNaming implements FileNamingStandard {

    private final FileStorageProperties fileStorageProperties;

    @Override
    public String getFileName(byte[] bytesContent) throws IOException {
        byte[] salt = fileStorageProperties.getSaltValue().getBytes();
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(salt);
        output.write(bytesContent);
        return DigestUtils.sha256Hex(output.toByteArray());
    }
}
