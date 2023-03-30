package com.irb.paxton.core.model;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import com.irb.paxton.exceptions.handler.common.GenericEntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.Serializable;

@Service
@Transactional
public abstract class AbstractService<T extends PaxtonEntity<ID>, ID extends Serializable> implements PaxtonService<ID, T> {

    private final AbstractRepository<T, ID> repository;

    @Autowired
    protected AbstractService(AbstractRepository<T, ID> repository) {
        this.repository = repository;
    }

    @Override
    public T findById(ID id) {
        return this.repository.findById(id)
                .orElseThrow(() -> new GenericEntityNotFoundException("Entity by id %s does not exist".formatted(id.toString())));
    }

    @Override
    public T create(T newEntity) {
        return this.repository.save(newEntity);
    }

    @Override
    public T update(T updated) {
        T instanceToUpdate = this.findById(updated.getId());
        return this.repository.save(instanceToUpdate);
    }

    @Override
    public void delete(ID id) {
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
