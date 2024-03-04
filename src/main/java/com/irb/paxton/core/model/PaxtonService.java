package com.irb.paxton.core.model;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;

public interface PaxtonService<K, T extends PaxtonEntity<K>> {

    T findById(K id);

    T create(T newEntity);

    T update(T updated);

    void delete(T entity);

    void deleteById(K id);

    PaginatedResponse<T> advSearch(SearchRequest searchRequest);
}
