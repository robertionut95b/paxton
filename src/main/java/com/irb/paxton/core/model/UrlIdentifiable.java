package com.irb.paxton.core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public interface UrlIdentifiable {

    String getUrlId();

    void setUrlId(String urlId);
}
