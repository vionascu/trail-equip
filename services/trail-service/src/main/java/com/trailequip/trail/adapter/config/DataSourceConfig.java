package com.trailequip.trail.adapter.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import javax.sql.DataSource;

/**
 * Render deployment-specific DataSource configuration.
 * Handles the PostgreSQL connection URL format from Render's environment variables.
 */
@Configuration
@Profile("render")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new IllegalStateException("DATABASE_URL environment variable not set");
        }

        // Render provides: postgresql://user:password@host:port/dbname
        // The credentials are already embedded in the URL, so we just convert to JDBC format
        String jdbcUrl = databaseUrl;
        if (!databaseUrl.startsWith("jdbc:")) {
            jdbcUrl = "jdbc:" + databaseUrl;
        }

        // Add SSL requirement for Render
        if (!jdbcUrl.contains("?")) {
            jdbcUrl += "?sslmode=require";
        }

        // Important: DO NOT set username/password separately when credentials are in the URL
        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl)
                .build();
    }
}
