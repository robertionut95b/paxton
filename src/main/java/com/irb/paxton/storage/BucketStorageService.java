package com.irb.paxton.storage;

import com.irb.paxton.storage.exception.PaxtonMinioException;

public interface BucketStorageService<T> {

    Iterable<T> listObjectsInBucket();

    String getPresignedUrlByObject(String objectPath) throws PaxtonMinioException;
}
