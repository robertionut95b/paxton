package com.irb.paxton.utils;

import java.util.Base64;

public class Base64Utils {

    private Base64Utils() {
    }

    public static boolean checkIsBase64(String s) {
        try {
            Base64.getDecoder().decode(s);
            return true;
        } catch (IllegalArgumentException iae) {
            return false;
        }
    }
}
