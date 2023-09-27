package com.irb.paxton.core.search;

import com.irb.paxton.core.search.exceptions.InvalidSearchSyntaxException;
import jakarta.persistence.criteria.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@AllArgsConstructor
public class SearchSpecification<T> implements Specification<T> {

    @Serial
    private static final long serialVersionUID = -9153865343320750644L;

    private final transient SearchRequest request;

    public static Pageable getPageable(Integer page, Integer size) {
        return PageRequest.of(Objects.requireNonNullElse(page, 0), Objects.requireNonNullElse(size, 100));
    }

    @Override
    public Predicate toPredicate(@NotNull Root<T> root, @NotNull CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.equal(cb.literal(Boolean.TRUE), Boolean.TRUE);

        for (FilterRequest filter : this.request.getFilters()) {
            log.debug("Requested dataset with filter: '{}', operator - '{}', value - '{}'", filter.getKey(), filter.getOperator().toString(), filter.getValue());
            try {
                predicate = filter.getOperator().build(root, cb, filter, predicate);
            } catch (RuntimeException ex) {
                if (ex.getMessage().contains("Can't compare test expression of type")) {
                    // TODO: enrich exception to Graphql type error
                    throw new InvalidSearchSyntaxException(("Invalid query provided: Cannot compare" +
                            " attribute \"%s\" to value provided \"%s\"").formatted(filter.getKey(), filter.getValue()), ex);
                }
                throw ex;
            }
        }

        List<Order> orders = new ArrayList<>();
        for (SortRequest sort : this.request.getSorts()) {
            orders.add(sort.getDirection().build(root, cb, sort));
        }

        query.orderBy(orders);
        return predicate;
    }

}