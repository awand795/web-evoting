package com.wevoting.config;

import com.wevoting.model.ERole;
import com.wevoting.model.Role;
import com.wevoting.model.Settings;
import com.wevoting.repository.RoleRepository;
import com.wevoting.repository.SettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SettingsRepository settingsRepository;

    @Override
    public void run(String... args) {
        // Initialize roles
        for (ERole role : ERole.values()) {
            if (roleRepository.findByName(role).isEmpty()) {
                roleRepository.save(new Role(role));
                logger.info("Role '{}' created", role);
            }
        }

        // Initialize settings
        if (settingsRepository.count() == 0) {
            settingsRepository.save(new Settings("open"));
            logger.info("Default settings created (voting: open)");
        }
    }
}
