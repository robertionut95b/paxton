package com.irb.paxton.core.search;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.annotations.Immutable;
import org.springframework.data.domain.Slice;

@Immutable
@AllArgsConstructor
@Getter
public class SlicedResponse<T> {

    private Slice<T> list;

    private boolean isFirst;

    private boolean isLast;

    private boolean hasNext;
}
