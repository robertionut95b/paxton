package com.irb.paxton.storage;

public interface BucketStorageService<T> {

    Iterable<T> listObjectsInBucket();
}
