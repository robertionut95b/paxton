package com.irb.paxton.core.search;

import lombok.extern.slf4j.Slf4j;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
public enum Operator {
    EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Expression<?> key = root.get(request.getKey());
            return cb.and(cb.equal(key, value), predicate);
        }
    },

    NOT_EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Expression<?> key = root.get(request.getKey());
            return cb.and(cb.notEqual(key, value), predicate);
        }
    },

    LESS_THAN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = root.get(request.getKey());
                return cb.and(cb.lessThan(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = root.get(request.getKey());
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = root.get(request.getKey());
                return cb.and(cb.lt(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    LESS_THAN_EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = root.get(request.getKey());
                return cb.and(cb.lessThanOrEqualTo(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = root.get(request.getKey());
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = root.get(request.getKey());
                return cb.and(cb.le(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    GREATER_THAN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = root.get(request.getKey());
                return cb.and(cb.greaterThan(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = root.get(request.getKey());
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = root.get(request.getKey());
                return cb.and(cb.gt(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    GREATER_THAN_EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = root.get(request.getKey());
                return cb.and(cb.greaterThanOrEqualTo(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = root.get(request.getKey());
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = root.get(request.getKey());
                return cb.and(cb.ge(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    LIKE {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Expression<String> key = root.get(request.getKey());
            return cb.and(cb.like(cb.upper(key), "%" + request.getValue().toString().toUpperCase() + "%"), predicate);
        }
    },

    IN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            List<Object> values = Collections.singletonList(request.getValues());
            CriteriaBuilder.In<Object> inClause = cb.in(root.get(request.getKey()));
            for (Object value : values) {
                inClause.value(request.getFieldType().parse(value.toString()));
            }
            return cb.and(inClause, predicate);
        }
    },

    BETWEEN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Object valueTo = request.getFieldType().parse(request.getValueTo().toString());
            if (request.getFieldType() == FieldType.DATETIME) {
                LocalDateTime startDate = (LocalDateTime) value;
                LocalDateTime endDate = (LocalDateTime) valueTo;
                Expression<LocalDateTime> key = root.get(request.getKey());
                return cb.and(cb.and(cb.greaterThanOrEqualTo(key, startDate), cb.lessThanOrEqualTo(key, endDate)), predicate);
            }

            if (request.getFieldType() == FieldType.DATE) {
                LocalDate startDate = (LocalDate) value;
                LocalDate endDate = (LocalDate) valueTo;
                Expression<LocalDate> key = root.get(request.getKey());
                return cb.and(cb.and(cb.greaterThanOrEqualTo(key, startDate), cb.lessThanOrEqualTo(key, endDate)), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Number start = (Number) value;
                Number end = (Number) valueTo;
                Expression<Number> key = root.get(request.getKey());
                return cb.and(cb.and(cb.ge(key, start), cb.le(key, end)), predicate);
            }

            log.info("Can not use between for {} field type.", request.getFieldType());
            return predicate;
        }
    };

    public abstract <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate);

}
