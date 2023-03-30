package com.irb.paxton.core.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface AbstractRepository<T extends PaxtonEntity<ID>, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
}
