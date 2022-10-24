package com.irb.paxton.security.auth.device.response;

import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class ConfirmDevice implements Serializable {
    
    @Serial
    private static final long serialVersionUID = -6762768480611632025L;

    private Long deviceId;

    private String token;
}
