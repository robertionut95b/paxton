package com.irb.paxton.security.auth.device;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.security.auth.device.exception.UnknownDeviceDetectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserDeviceService extends AbstractService<UserDevice> {

    @Autowired
    private UserDeviceRepository userDeviceRepository;

    protected UserDeviceService(AbstractRepository<UserDevice> repository) {
        super(repository);
    }

    public void registerOrCheckUserDevice(UserDevice userDevice) {
        List<UserDevice> devicesListF = this.userDeviceRepository
                .findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedFalse(
                        userDevice.getAgent(), userDevice.getUser().getId(), userDevice.getIpAddress(), LocalDateTime.now()
                );
        if (!devicesListF.isEmpty()) {
            throw new UnknownDeviceDetectedException(userDevice.getId(), "A confirmation e-mail has been already sent for this device");
        }

        List<UserDevice> devicesList = this.userDeviceRepository
                .findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedTrue(
                        userDevice.getAgent(), userDevice.getUser().getId(), userDevice.getIpAddress(), LocalDateTime.now()
                );
        if (devicesList.isEmpty()) {
            userDevice.setVerified(false);
            this.create(userDevice);
            // check with e-mail verification if user approves this device
            throw new UnknownDeviceDetectedException(userDevice.getId(), "This device is not trusted, check your e-mail for confirmation code");
        }
    }

    public UserDevice checkAndSaveUserDevice(UserDevice userDevice) {
        List<UserDevice> devices = this.userDeviceRepository.findByAgentAndUserIdAndIpAddressAndExpiresAtAfter(
                userDevice.getAgent(), userDevice.getUser().getId(), userDevice.getIpAddress(), LocalDateTime.now()
        );
        if (devices.isEmpty()) {
            userDevice.setVerified(false);
            return this.create(userDevice);
        }
        return null;
    }
}
