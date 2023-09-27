package com.irb.paxton.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.net.MalformedURLException;
import java.net.URL;

@Converter(autoApply = true)
public class URLConverter implements AttributeConverter<URL, String> {

    @Override
    public String convertToDatabaseColumn(URL url) {
        return url.toString();
    }

    @Override
    public URL convertToEntityAttribute(String s) {
        try {
            return new URL(s);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }
}
