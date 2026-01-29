# TrailEquip Documentation Index

## Overview

This directory contains all documentation for the TrailEquip project, including architecture, setup guides, API documentation, and deployment instructions.

---

## Documentation Categories

### Quick Start & Setup

| Document | Purpose | Audience |
|----------|---------|----------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick start guide to get running | New developers |
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Detailed setup and installation | Developers |
| [POSTGRES_LOCAL_SETUP.md](POSTGRES_LOCAL_SETUP.md) | PostgreSQL database setup | DevOps/Developers |
| [RUN_SINGLE_TERMINAL.md](RUN_SINGLE_TERMINAL.md) | Run entire application from single terminal | Developers |

---

### Architecture & Design

| Document | Purpose | Audience |
|----------|---------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and design | Architects/Developers |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Implementation details and progress | Team leads |
| [COMPLETE.md](COMPLETE.md) | Project completion status | Managers |

---

### Testing & Quality

| Document | Purpose | Audience |
|----------|---------|----------|
| [CRUD_TESTS.md](CRUD_TESTS.md) | REST API test documentation | QA/Developers |
| [../automated-tests/INDEX.md](../automated-tests/INDEX.md) | Automated test index and organization | QA/Developers |
| [../automated-tests/rest-tests/TRAIL_SERVICE_TESTS.md](../automated-tests/rest-tests/TRAIL_SERVICE_TESTS.md) | Trail Service test specifications | QA/Developers |
| [../automated-tests/rest-tests/WEATHER_SERVICE_TESTS.md](../automated-tests/rest-tests/WEATHER_SERVICE_TESTS.md) | Weather Service test specifications | QA/Developers |
| [../automated-tests/rest-tests/RECOMMENDATION_SERVICE_TESTS.md](../automated-tests/rest-tests/RECOMMENDATION_SERVICE_TESTS.md) | Recommendation Service test specifications | QA/Developers |

---

### Deployment & CI/CD

| Document | Purpose | Audience |
|----------|---------|----------|
| [GITLAB_SETUP.md](GITLAB_SETUP.md) | GitLab CI/CD pipeline setup | DevOps |
| [GITLAB_NO_DOCKER.md](GITLAB_NO_DOCKER.md) | CI/CD without Docker containers | DevOps |
| [GITLAB_QUICK_START.md](GITLAB_QUICK_START.md) | Quick CI/CD setup | DevOps |
| [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) | Deployment procedures | DevOps/Operations |
| [PUSH_AND_RUN.md](PUSH_AND_RUN.md) | Push code and run pipeline | Developers |

---

### Utilities & Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| [NEXT_COMMANDS.md](NEXT_COMMANDS.md) | Recommended next steps and commands | Developers |
| [README.md](README.md) | General project overview | Everyone |

---

## Architecture Overview

### System Components

```
TrailEquip Microservices Architecture
├── Frontend
│   └── React UI (Port 3000)
│       └── Leaflet Maps for trail visualization
├── API Gateway (Port 8080)
│   └── Request routing and load balancing
└── Backend Services
    ├── Trail Service (Port 8081)
    │   ├── CRUD operations for trails
    │   ├── Geographic queries with PostGIS
    │   └── Difficulty classification
    ├── Weather Service (Port 8082)
    │   ├── Weather forecasting
    │   ├── Data caching
    │   └── Multi-location support
    └── Recommendation Service (Port 8083)
        ├── Equipment recommendations
        ├── Trail matching
        └── Risk assessment
```

### Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.0
- Gradle
- PostgreSQL with PostGIS
- JUnit 5 + Mockito

**Frontend:**
- React 18
- TypeScript
- Vite build tool
- Leaflet.js for mapping
- TailwindCSS for styling

**Infrastructure:**
- Docker containers
- docker-compose orchestration
- GitLab CI/CD

---

## Key Directories

```
TrailEquip/
├── documentation/              ← All project documentation
│   ├── ARCHITECTURE.md
│   ├── GETTING_STARTED.md
│   ├── SETUP_INSTRUCTIONS.md
│   └── ... (see list above)
├── automated-tests/            ← All test files and test documentation
│   ├── INDEX.md               ← Test index
│   └── rest-tests/
│       ├── TRAIL_SERVICE_TESTS.md
│       ├── WEATHER_SERVICE_TESTS.md
│       ├── RECOMMENDATION_SERVICE_TESTS.md
│       └── test-source-files/ ← Test source code
├── services/                   ← Microservices source code
│   ├── api-gateway/
│   ├── trail-service/
│   ├── weather-service/
│   └── recommendation-service/
├── ui/                        ← React frontend
└── infra/                     ← Infrastructure definitions
    └── docker-compose.yml
```

---

## Quick Navigation

### I want to...

**Start developing**
1. Read: [GETTING_STARTED.md](GETTING_STARTED.md)
2. Follow: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
3. Run: [RUN_SINGLE_TERMINAL.md](RUN_SINGLE_TERMINAL.md)

**Understand the architecture**
1. Read: [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

**Write tests**
1. Start: [../automated-tests/INDEX.md](../automated-tests/INDEX.md)
2. Trail tests: [../automated-tests/rest-tests/TRAIL_SERVICE_TESTS.md](../automated-tests/rest-tests/TRAIL_SERVICE_TESTS.md)
3. Weather tests: [../automated-tests/rest-tests/WEATHER_SERVICE_TESTS.md](../automated-tests/rest-tests/WEATHER_SERVICE_TESTS.md)
4. Recommendation tests: [../automated-tests/rest-tests/RECOMMENDATION_SERVICE_TESTS.md](../automated-tests/rest-tests/RECOMMENDATION_SERVICE_TESTS.md)

**Setup CI/CD**
1. Review: [GITLAB_SETUP.md](GITLAB_SETUP.md)
2. Alternative: [GITLAB_NO_DOCKER.md](GITLAB_NO_DOCKER.md)
3. Quick option: [GITLAB_QUICK_START.md](GITLAB_QUICK_START.md)

**Deploy application**
1. Read: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
2. Execute: [PUSH_AND_RUN.md](PUSH_AND_RUN.md)

**Setup database**
1. Follow: [POSTGRES_LOCAL_SETUP.md](POSTGRES_LOCAL_SETUP.md)

---

## Test Summary

| Service | Test Count | Status | Location |
|---------|-----------|--------|----------|
| Trail | 9 tests | ✅ Pass | [Trail Tests](../automated-tests/rest-tests/TRAIL_SERVICE_TESTS.md) |
| Weather | 6 tests | ✅ Pass | [Weather Tests](../automated-tests/rest-tests/WEATHER_SERVICE_TESTS.md) |
| Recommendation | 8 tests | ✅ Pass | [Recommendation Tests](../automated-tests/rest-tests/RECOMMENDATION_SERVICE_TESTS.md) |
| **Total** | **23 tests** | **✅ All Pass** | [Test Index](../automated-tests/INDEX.md) |

---

## Running Tests

From project root:

```bash
# Run all tests
gradle test

# Run specific service
gradle :trail-service:test
gradle :weather-service:test
gradle :recommendation-service:test

# Generate coverage report
gradle test jacocoTestReport
```

---

## API Endpoints

### Trail Service (Port 8081)

```
GET    /api/v1/trails                  - Get all trails
GET    /api/v1/trails/{id}             - Get trail by ID
POST   /api/v1/trails                  - Create trail
PUT    /api/v1/trails/{id}             - Update trail
DELETE /api/v1/trails/{id}             - Delete trail
POST   /api/v1/trails/suggest          - Find trails in area
```

### Weather Service (Port 8082)

```
GET    /api/v1/weather/forecast        - Get weather forecast
GET    /api/v1/weather/cache/stats     - Get cache statistics
DELETE /api/v1/weather/cache           - Clear cache
POST   /api/v1/weather/multi-location  - Get weather for multiple locations
```

### Recommendation Service (Port 8083)

```
POST   /api/v1/recommendations/equipment         - Get equipment recommendations
POST   /api/v1/recommendations/trails            - Get trail recommendations
POST   /api/v1/recommendations/trails/best       - Get best trail match
POST   /api/v1/recommendations/risk-assessment   - Get risk assessment
```

---

## Environment Setup

### Required Software
- Java 17+
- Docker & Docker Compose
- Node.js 16+ (for UI)
- PostgreSQL 14+ (or use Docker)

### Environment Variables

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed environment configuration.

---

## Troubleshooting

### Build Issues
- See: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

### Database Issues
- See: [POSTGRES_LOCAL_SETUP.md](POSTGRES_LOCAL_SETUP.md)

### Test Failures
- See: [CRUD_TESTS.md](CRUD_TESTS.md) - Troubleshooting section
- See: [../automated-tests/INDEX.md](../automated-tests/INDEX.md) - Common Issues

### Deployment Issues
- See: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

## Project Status

Current Status: **Development Phase**

- ✅ Architecture designed
- ✅ Microservices implemented
- ✅ REST APIs functional
- ✅ Unit tests (23 tests)
- ✅ Docker containerization
- ✅ CI/CD pipeline configured
- 🔄 Integration tests (in progress)
- 📋 UI tests (planned)

See [COMPLETE.md](COMPLETE.md) for detailed progress.

---

## Contributing

When contributing documentation:

1. Update relevant documentation files in `documentation/`
2. Update test documentation in `automated-tests/`
3. Keep this INDEX.md current
4. Follow existing markdown formatting
5. Include clear examples and code blocks
6. Add dates and version information

---

## Support

For issues or questions:

1. Check relevant documentation above
2. Review [NEXT_COMMANDS.md](NEXT_COMMANDS.md) for common tasks
3. Check test documentation for API specifications
4. Review GitLab issues for known problems

---

## Documentation Statistics

- **Total Documents:** 18
- **Total Lines:** ~15,000
- **Test Specifications:** 23 test cases
- **API Endpoints:** 12 endpoints documented

---

**Last Updated:** January 29, 2026
**Documentation Version:** 1.0
**Project Version:** 1.0
