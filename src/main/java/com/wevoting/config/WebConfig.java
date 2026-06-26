package com.wevoting.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files at /resources/static/assets/uploads/** path
        // Frontend expects: /resources/static/assets/uploads/{filename}
        registry.addResourceHandler("/resources/static/assets/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");

        // Also serve at /uploads/** for direct access
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
