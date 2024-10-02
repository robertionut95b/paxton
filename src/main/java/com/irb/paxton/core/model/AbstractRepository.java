package com.irb.paxton.core.model;

import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import io.hypersistence.utils.spring.repository.BaseJpaRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface AbstractRepository<T extends PaxtonEntity> extends BaseJpaRepository<T, Long>, JpaSpecificationExecutor<T> {

    /**
     * The findAll method is a terrible Anti-Pattern.
     * <p>
     * For more details about why you should not use the {@code findAll} method by default,
     * check out <a href="https://vladmihalcea.com/spring-data-findall-anti-pattern/">this article</a>.
     *
     * @return all the records from the database table this entity is mapped to, but limit this to only 10 records
     * @deprecated This method is no longer acceptable to retrieve all records for entity
     * * <p> Use {@link AbstractService#advSearch(SearchRequest)} instead.
     */
    // override the default Anti-Pattern method of ListCrudRepository findAll() method
    @NotNull
    @Deprecated(since = "0.0.0")
    default List<T> findAll() {
        return this.findAll(new SearchSpecification<>(new SearchRequest()), Pageable.ofSize(10)).toList();
    }

    Optional<T> findByUrlId(String urlId);
}
