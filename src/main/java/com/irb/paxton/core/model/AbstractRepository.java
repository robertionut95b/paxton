package com.irb.paxton.core.model;

import com.irb.paxton.core.search.SearchRequest;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;

@NoRepositoryBean
public interface AbstractRepository<T extends PaxtonEntity<ID>, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

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
        return this.findAll(Pageable.ofSize(10)).toList();
    }
}
