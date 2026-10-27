package com.klef.soa.docker.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CarWash CRUD Service API")
                        .version("1.0")
                        .description(
                            "REST API Documentation for CarWash Management System. ")
                        .contact(new Contact()
                                .name("2400031638")
                                .email("2400031638@kluniversity.in")));
    }
}
