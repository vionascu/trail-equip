# TrailEquip – Bucegi Mountains Hiking Guide

A production-quality web application for discovering, planning, and outfitting hiking trails in the Bucegi Mountains, Romania.

## Quick Start

```bash
cd infra
docker-compose up -d
sleep 30
curl http://localhost:8080/api/v1/health
open http://localhost:3000
```

## Services

- **Trail Service** (8081) – Trail catalog, geo-queries, categorization
- **Weather Service** (8082) – Forecast fetching, caching
- **Recommendation Service** (8083) – Equipment recommendations
- **API Gateway** (8080) – BFF, request routing
- **React UI** (3000) – Interactive map and interface
- **PostgreSQL** (5432) – Database with PostGIS

## Development

```bash
./gradlew build
./gradlew test integrationTest
cd ui && npm run dev
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) – System design
- [QUICKSTART.md](./QUICKSTART.md) – Detailed setup guide
- [ADRs/](./ADRs/) – Architecture decisions
- [PRODUCT/](./PRODUCT/) – EPICs, User Stories

## License

MIT
