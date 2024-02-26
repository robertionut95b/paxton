package com.irb.paxton.core.search;

import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
public enum Operator {

    EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Expression<?> key = this.parseProperty(request.getKey(), root);
            return cb.and(cb.equal(key, value), predicate);
        }
    },

    NOT_EQUAL {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Expression<?> key = this.parseProperty(request.getKey(), root);
            return cb.and(cb.notEqual(key, value), predicate);
        }
    },

    LESS_THAN {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = this.parseProperty(request.getKey(), (Root<LocalDate>) root);
                return cb.and(cb.lessThan(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = this.parseProperty(request.getKey(), (Root<LocalDateTime>) root);
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = this.parseProperty(request.getKey(), ((Root<Number>) root));
                return cb.and(cb.lt(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    LESS_THAN_EQUAL {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = this.parseProperty(request.getKey(), ((Root<LocalDate>) root));
                return cb.and(cb.lessThanOrEqualTo(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = this.parseProperty(request.getKey(), ((Root<LocalDateTime>) root));
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = this.parseProperty(request.getKey(), ((Root<Number>) root));
                return cb.and(cb.le(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    GREATER_THAN {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = this.parseProperty(request.getKey(), ((Root<LocalDate>) root));
                return cb.and(cb.greaterThan(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = this.parseProperty(request.getKey(), ((Root<LocalDateTime>) root));
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = this.parseProperty(request.getKey(), ((Root<Number>) root));
                return cb.and(cb.gt(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    GREATER_THAN_EQUAL {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            if (request.getFieldType() == FieldType.DATE) {
                Expression<LocalDate> key = this.parseProperty(request.getKey(), ((Root<LocalDate>) root));
                return cb.and(cb.greaterThanOrEqualTo(key, (LocalDate) value), predicate);
            }

            if (request.getFieldType() == FieldType.DATETIME) {
                Expression<LocalDateTime> key = this.parseProperty(request.getKey(), ((Root<LocalDateTime>) root));
                return cb.and(cb.lessThan(key, (LocalDateTime) value), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Expression<Number> key = this.parseProperty(request.getKey(), ((Root<Number>) root));
                return cb.and(cb.ge(key, (Number) value), predicate);
            }
            return predicate;
        }
    },

    LIKE {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Expression<String> key = this.parseProperty(request.getKey(), ((Root<String>) root));
            return cb.and(cb.like(cb.upper(key), "%" + request.getValue().toString().toUpperCase() + "%"), predicate);
        }
    },

    IN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            List<Object> values = request.getValues();
            CriteriaBuilder.In<Object> inClause = cb.in(this.parseProperty(request.getKey(), root));
            for (Object value : values) {
                inClause.value(request.getFieldType().parse(value.toString()));
            }
            return cb.and(inClause, predicate);
        }
    },

    NOT_IN {
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            List<Object> values = request.getValues();
            CriteriaBuilder.In<Object> inClause = cb.in(this.parseProperty(request.getKey(), root));
            for (Object value : values) {
                inClause.value(request.getFieldType().parse(value.toString()));
            }
            return cb.and(inClause.not(), predicate);
        }
    },

    BETWEEN {
        @SuppressWarnings("unchecked")
        public <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate) {
            Object value = request.getFieldType().parse(request.getValue().toString());
            Object valueTo = request.getFieldType().parse(request.getValueTo().toString());
            if (request.getFieldType() == FieldType.DATETIME) {
                LocalDateTime startDate = (LocalDateTime) value;
                LocalDateTime endDate = (LocalDateTime) valueTo;
                Expression<LocalDateTime> key = this.parseProperty(request.getKey(), ((Root<LocalDateTime>) root));
                return cb.and(cb.and(cb.greaterThanOrEqualTo(key, startDate), cb.lessThanOrEqualTo(key, endDate)), predicate);
            }

            if (request.getFieldType() == FieldType.DATE) {
                LocalDate startDate = (LocalDate) value;
                LocalDate endDate = (LocalDate) valueTo;
                Expression<LocalDate> key = this.parseProperty(request.getKey(), ((Root<LocalDate>) root));
                return cb.and(cb.and(cb.greaterThanOrEqualTo(key, startDate), cb.lessThanOrEqualTo(key, endDate)), predicate);
            }

            if (request.getFieldType() != FieldType.CHAR && request.getFieldType() != FieldType.BOOLEAN) {
                Number start = (Number) value;
                Number end = (Number) valueTo;
                Expression<Number> key = this.parseProperty(request.getKey(), ((Root<Number>) root));
                return cb.and(cb.and(cb.ge(key, start), cb.le(key, end)), predicate);
            }

            log.info("Can not use between for {} field type.", request.getFieldType());
            return predicate;
        }
    };

    protected <T> Path<T> parseProperty(String property, Root<T> root) {
        Path<T> path;
        if (property.contains(".")) {
            String[] pathSteps = property.split("\\.");
            String step = pathSteps[0];
            path = root.get(step);
            for (int i = 1; i <= pathSteps.length - 1; i++) {
                path = path.get(pathSteps[i]);
            }
        } else {
            path = root.get(property);
        }
        return path;
    }

    public abstract <T> Predicate build(Root<T> root, CriteriaBuilder cb, FilterRequest request, Predicate predicate);
}
