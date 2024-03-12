package com.irb.paxton.core.model;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;

public interface PaxtonService<T extends PaxtonEntity> {

    T findById(Long id);

    T findByUrlId(String urlId);

    T create(T newEntity);

    T update(T updated);

    void delete(T entity);

    void deleteById(Long id);

    void deleteAll();

    PaginatedResponse<T> advSearch(SearchRequest searchRequest);
}
