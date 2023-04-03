package com.irb.paxton.core.model;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SlicedResponse;

public interface PaxtonService<K, T extends PaxtonEntity<K>> {

    T findById(K id);

    T create(T newEntity);

    T update(T updated);

    void delete(K id);

    PaginatedResponse<T> advSearch(SearchRequest searchRequest);

    SlicedResponse<T> slicedSearch(SearchRequest searchRequest);
}
