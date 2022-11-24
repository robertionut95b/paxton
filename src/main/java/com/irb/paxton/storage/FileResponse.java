package com.irb.paxton.storage;

import lombok.Data;

@Data
public class FileResponse {

    private String name;

    private String path;

    public FileResponse(String name, String path) {
        this.name = name;
        this.path = path;
    }
}
