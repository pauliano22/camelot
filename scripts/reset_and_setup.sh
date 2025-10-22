#!/bin/bash
# Reset and Setup Script
# Quickly resets the database and sets up cameras

echo "🔄 Resetting database and setting up cameras..."

# Stop containers
echo "⏸️  Stopping containers..."
docker-compose down

# Remove database volume
echo "🗑️  Removing old database..."
docker volume rm camelot_postgres_data 2>/dev/null || true

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "📊 Creating database tables..."
docker-compose exec -T backend alembic upgrade head

# Wait for backend to be ready
echo "⏳ Waiting for backend..."
sleep 5

# Create cameras
echo "📹 Creating cameras..."

curl -s -X POST http://localhost:8000/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Front Door",
    "description": "Main entrance camera",
    "latitude": 42.4440,
    "longitude": -76.5019,
    "rtsp_url": "rtsp://fake-camera-1/stream"
  }' > /dev/null

curl -s -X POST http://localhost:8000/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backyard",
    "description": "Back patio area",
    "latitude": 42.4438,
    "longitude": -76.5021,
    "rtsp_url": "rtsp://fake-camera-2/stream"
  }' > /dev/null

curl -s -X POST http://localhost:8000/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Garage",
    "description": "Driveway and garage",
    "latitude": 42.4442,
    "longitude": -76.5017,
    "rtsp_url": "rtsp://fake-camera-3/stream"
  }' > /dev/null

# Set cameras online
echo "✅ Setting cameras online..."
curl -s -X PATCH http://localhost:8000/api/v1/cameras/1 \
  -H "Content-Type: application/json" \
  -d '{"is_online": true}' > /dev/null

curl -s -X PATCH http://localhost:8000/api/v1/cameras/2 \
  -H "Content-Type: application/json" \
  -d '{"is_online": true}' > /dev/null

curl -s -X PATCH http://localhost:8000/api/v1/cameras/3 \
  -H "Content-Type: application/json" \
  -d '{"is_online": true}' > /dev/null

# Restart backend to reload simulator
echo "🔄 Restarting backend..."
docker-compose restart backend

echo ""
echo "✅ Setup complete!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "Cameras created:"
echo "  1. Front Door (Online)"
echo "  2. Backyard (Online)"
echo "  3. Garage (Online)"
echo ""
echo "Simulator is now running! 🎉"
