package com.irb.paxton.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ByteUtils {

    private ByteUtils() {
    }

    public static byte[] addByteArraysWithSalt(byte[] arr1, byte[] salt) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(salt);
        output.write(arr1);
        return output.toByteArray();
    }
}
