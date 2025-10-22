#!/bin/bash
# Add Camera Script
# Usage: ./add_camera.sh "Name" "Description" latitude longitude

if [ $# -lt 4 ]; then
    echo "Usage: $0 \"Camera Name\" \"Description\" latitude longitude"
    echo "Example: $0 \"Side Window\" \"West side of house\" 42.4445 -76.5015"
    exit 1
fi

NAME="$1"
DESC="$2"
LAT="$3"
LON="$4"

echo "📹 Creating camera: $NAME..."

RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"description\": \"$DESC\",
    \"latitude\": $LAT,
    \"longitude\": $LON,
    \"rtsp_url\": \"rtsp://fake-camera/stream\"
  }")

CAMERA_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -n "$CAMERA_ID" ]; then
    echo "✅ Camera created with ID: $CAMERA_ID"
    
    # Set online
    curl -s -X PATCH http://localhost:8000/api/v1/cameras/$CAMERA_ID \
      -H "Content-Type: application/json" \
      -d '{"is_online": true}' > /dev/null
    
    echo "✅ Camera is now online"
    
    # Restart backend to reload simulator
    echo "🔄 Restarting backend..."
    docker-compose restart backend > /dev/null 2>&1
    
    echo "🎉 Done! Refresh your browser."
else
    echo "❌ Failed to create camera"
    echo "$RESPONSE"
fi
