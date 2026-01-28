# TrailEquip – Bucegi Mountains Hiking Guide

A production-quality web application for discovering, planning, and outfitting hiking trails in the Bucegi Mountains, Romania.

## Quick Start (5 minutes)

```bash
cd ~/Projects/TrailEquip/infra
docker-compose up -d
sleep 30
curl http://localhost:8080/api/v1/health
open http://localhost:3000
```

**Expected Output:**
- Services running on ports 8080–8083, 3000, 5432
- Web UI displays 3 sample Bucegi trails
- Health check returns `"status": "UP"`

## Architecture

- **Microservices:** Trail, Weather, Recommendation services
- **Backend:** Java 21, Spring Boot 3.x, PostgreSQL + PostGIS
- **Frontend:** React 18, TypeScript, Leaflet map
- **Infrastructure:** Docker Compose, GitLab CI/CD

## Testing

```bash
./gradlew test integrationTest              # Java tests
cd ui && npm run test:ui                    # UI tests
```

## Development

```bash
./gradlew build                             # Build
cd ui && npm run dev                        # Dev server with hot reload
docker-compose restart trail-service        # Restart after code changes
```

## Documentation

- [Detailed Architecture](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/QUICKSTART.md)
- [API Documentation](./docs/API/)
- [Product Artifacts](./docs/PRODUCT/)
- [Architecture Decisions](./docs/ADRs/)

## Key Features (v1)

✅ Interactive map with Bucegi trails
✅ Trail discovery and filtering by difficulty
✅ Weather forecast integration
✅ Equipment recommendations based on conditions
✅ REST APIs with Swagger documentation
✅ Unit + integration tests
✅ Docker-based local development
✅ GitLab CI/CD pipelines

## Next Steps

1. Run locally: `cd infra && docker-compose up -d`
2. Open UI: http://localhost:3000
3. View API docs: http://localhost:8080/swagger-ui.html
4. Explore trails and generate recommendations

## License

MIT

---

**Version:** 0.1.0 | **Status:** MVP Ready
