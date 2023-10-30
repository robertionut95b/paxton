package com.irb.paxton.config;

import io.github.wimdeblauwe.errorhandlingspringbootstarter.ApiErrorResponse;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.ApiExceptionHandler;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.handler.AbstractApiExceptionHandler;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorCodeMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.ErrorMessageMapper;
import io.github.wimdeblauwe.errorhandlingspringbootstarter.mapper.HttpStatusMapper;
import org.simpleframework.xml.Order;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ErrorHandlingConfiguration {

    @Bean
    @Order
    public ApiExceptionHandler internalErrorApiExceptionHandler(HttpStatusMapper httpStatusMapper, ErrorCodeMapper errorCodeMapper, ErrorMessageMapper errorMessageMapper) {

        return new AbstractApiExceptionHandler(httpStatusMapper, errorCodeMapper, errorMessageMapper) {
            @Override
            public boolean canHandle(Throwable exception) {
                return httpStatusMapper.getHttpStatus(exception).is5xxServerError();
            }

            @Override
            public ApiErrorResponse handle(Throwable exception) {
                return new ApiErrorResponse(httpStatusMapper.getHttpStatus(exception), "INTERNAL_ERROR", "Unknown error occurred");
            }
        };
    }
}
