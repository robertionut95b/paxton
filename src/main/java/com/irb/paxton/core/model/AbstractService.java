package com.irb.paxton.core.model;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public abstract class AbstractService<T extends PaxtonEntity> implements PaxtonService<T> {

    private final AbstractRepository<T> repository;

    protected AbstractService(AbstractRepository<T> repository) {
        this.repository = repository;
    }

    @Override
    public T findById(Long id) {
        return this.repository
                .findById(id)
                .orElseThrow(() -> new GenericEntityNotFoundException("Entity by id=%s does not exist"
                        .formatted(id.toString()))
                );
    }

    public T findByUrlId(String urlId) {
        return this.repository
                .findByUrlId(urlId)
                .orElseThrow(() -> new GenericEntityNotFoundException("Entity by urlId=%s does not exist"
                        .formatted(urlId))
                );
    }

    @Override
    public T create(T newEntity) {
        return repository.persist(newEntity);
    }

    @Override
    public T update(T updated) {
        return repository.merge(updated);
    }

    @Override
    public void delete(T entity) {
        this.repository.delete(entity);
    }

    @Override
    public void deleteById(Long id) {
        T instance = this.findById(id);
        this.repository.delete(instance);
    }

    @Override
    public PaginatedResponse<T> advSearch(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<T> searchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<T> results = this.repository.findAll(searchSpecification, pageable);
        return new PaginatedResponse<>(results, searchRequest.getPage(), results.getTotalPages(), results.getTotalElements());
    }
}
