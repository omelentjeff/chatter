package com.omelentjeff.chatApp.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * The HTTP status code associated with the error.
     */
    private int status;

    /**
     * A message providing additional information about the error.
     */
    private String message;

    /**
     * The timestamp when the error occurred.
     */
    private long timeStamp;

    /**
     * A list of details providing specific information about the error.
     * This can include validation errors or other contextual information.
     */
    private List<String> details;
}

