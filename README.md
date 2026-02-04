## Findish API

Findish API is a fully functional **Node.js-powered backend** for the app concept called **Findish** — a smart recipe generator that helps users make the most of ingredients they already have and reduce food waste.

### Getting Started

#### Prerequisites

Make sure you have the following installed:

* Node.js (LTS version)
* Docker (for containerized setup)

#### 1. Clone the Repository

```bash
git clone https://github.com/Findish/findish-api.git
cd findish-api
```

#### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the required configuration.
(Contact a team member if you need access to the environment variables.)

#### 3. Start with Docker

To build and run the API and Redis containers:

```bash
docker-compose up --build -d
```

#### 4. Test Redis Connection

Check that Redis is up and running:

```bash
docker exec -it redis redis-cli ping
```

If successful, you’ll see:

```
PONG
```

---

### Development & Debugging

#### Restarting Services

```bash
docker-compose down     # Stops and removes containers
docker-compose up -d    # Restarts them in detached mode
```

#### View Redis Logs

To view the latest 10 entries for a specific Redis log key:

```bash
docker exec -it redis redis-cli LRANGE LogKey 0 10
```

A list of Redis log keys is available [here](./app/redis/RedisLogKeys.md).

More
