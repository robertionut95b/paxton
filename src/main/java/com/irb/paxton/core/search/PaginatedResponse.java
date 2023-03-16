package com.irb.paxton.core.search;

import lombok.AllArgsConstructor;
import lombok.Getter;
import net.jcip.annotations.Immutable;
import org.springframework.data.domain.Page;

@Immutable
@AllArgsConstructor
@Getter
public class PaginatedResponse<T> {

    private Page<T> list;

    private int page;

    private int totalPages;

    private long totalElements;
}
