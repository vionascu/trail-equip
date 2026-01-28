rootProject.name = "trail-equip"

include(":services:trail-service")
project(":services:trail-service").projectDir = file("services/trail-service")

include(":services:weather-service")
project(":services:weather-service").projectDir = file("services/weather-service")

include(":services:recommendation-service")
project(":services:recommendation-service").projectDir = file("services/recommendation-service")

include(":services:api-gateway")
project(":services:api-gateway").projectDir = file("services/api-gateway")
