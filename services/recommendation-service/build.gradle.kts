plugins {
    id("java")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.4")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

springBoot {
    mainClass.set("com.trailequip.recommendation.RecommendationServiceApplication")
}
