package com.irb.paxton.core.search;

import lombok.AllArgsConstructor;
import net.jcip.annotations.Immutable;
import org.springframework.data.domain.Page;

@Immutable
@AllArgsConstructor
public class PaginatedResponse<T> {

    private Page<T> list;

    private int page;

    private int totalPages;

    private long totalElements;
}
