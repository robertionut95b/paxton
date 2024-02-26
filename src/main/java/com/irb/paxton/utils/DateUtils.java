package com.irb.paxton.utils;

import java.time.OffsetDateTime;

public class DateUtils {

    private DateUtils() {
    }

    public static boolean isValidDate(String date) {
        try {
            OffsetDateTime formatter = OffsetDateTime.parse(date);
            formatter.toLocalDate();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isValidDateTime(String dateTime) {
        try {
            OffsetDateTime formatter = OffsetDateTime.parse(dateTime);
            formatter.toLocalDateTime();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
