"""
Camera Simulator
Generates fake camera data for testing.
"""
import asyncio
import random
from datetime import datetime, timedelta
from geoalchemy2.elements import WKTElement
from sqlalchemy import select, func
from app.db.session import AsyncSessionLocal
from app.models.camera import Camera
from app.models.entity import Entity
from app.models.event import Event


class CameraSimulator:
    def __init__(self):
        self.running = False
        self.cameras = []
        self.entity_counter = 0
        
    async def start(self):
        """Start the simulator"""
        self.running = True
        print("🎬 Simulator started")
        
        # Load cameras from database
        await self._load_cameras()
        
        # Start simulation loop
        asyncio.create_task(self._simulation_loop())
        
    async def stop(self):
        """Stop the simulator"""
        self.running = False
        print("🛑 Simulator stopped")
        
    async def _load_cameras(self):
        """Load cameras from database - get lat/lon from Geography field"""
        async with AsyncSessionLocal() as db:
            try:
                # Query cameras with their locations extracted
                result = await db.execute(
                    select(
                        Camera.id,
                        Camera.name,
                        func.ST_Y(func.ST_AsText(Camera.location)).label('latitude'),
                        func.ST_X(func.ST_AsText(Camera.location)).label('longitude')
                    )
                )
                
                self.cameras = []
                for row in result:
                    self.cameras.append({
                        'id': row.id,
                        'name': row.name,
                        'latitude': float(row.latitude),
                        'longitude': float(row.longitude)
                    })
                
                print(f"📹 Simulating cameras: {[c['id'] for c in self.cameras]}")
            except Exception as e:
                print(f"❌ Failed to load cameras: {e}")
            
    async def _simulation_loop(self):
        """Main simulation loop"""
        while self.running:
            try:
                # Heartbeat
                print(f"💓 Simulator heartbeat - Active cameras: {len(self.cameras)}")
                
                # Generate random entities
                await self._generate_entities()
                
                # Generate random events
                await self._generate_events()
                
                # Update existing entities (make them move)
                await self._update_entities()
                
                # Clean up old entities (less aggressively)
                await self._cleanup_entities()
                
                # Wait before next cycle
                await asyncio.sleep(3)
                
            except Exception as e:
                print(f"❌ Simulator error: {e}")
                await asyncio.sleep(3)
                
    async def _generate_entities(self):
        """Generate new random entities near cameras"""
        if not self.cameras:
            return
            
        # Randomly decide if we should spawn a new entity (50% chance each cycle)
        if random.random() > 0.5:
            return
            
        async with AsyncSessionLocal() as db:
            try:
                # Pick random camera
                camera = random.choice(self.cameras)
                
                # Random entity type
                entity_types = ["person", "vehicle", "animal"]
                entity_type = random.choice(entity_types)
                
                # Create unique entity ID
                self.entity_counter += 1
                entity_id = f"{entity_type}_{self.entity_counter}"
                
                # Create entity near camera with small random offset
                lat_offset = random.uniform(-0.0005, 0.0005)
                lon_offset = random.uniform(-0.0005, 0.0005)
                
                lat = camera['latitude'] + lat_offset
                lon = camera['longitude'] + lon_offset
                
                now = datetime.utcnow()
                
                entity = Entity(
                    entity_id=entity_id,
                    object_type=entity_type,
                    camera_id=camera['id'],
                    location=WKTElement(f'POINT({lon} {lat})', srid=4326),
                    first_seen=now,
                    last_seen=now,
                    is_active=True,
                    confidence=random.uniform(0.7, 0.99),
                    is_recognized=False
                )
                
                db.add(entity)
                await db.commit()
                print(f"✨ Created entity: {entity_id} near camera {camera['name']}")
                
            except Exception as e:
                print(f"❌ Failed to generate entity: {e}")
                await db.rollback()
    
    async def _update_entities(self):
        """Move existing entities around"""
        async with AsyncSessionLocal() as db:
            try:
                # Get all active entities
                result = await db.execute(
                    select(
                        Entity.id,
                        Entity.entity_id,
                        Entity.camera_id,
                        func.ST_Y(func.ST_AsText(Entity.location)).label('latitude'),
                        func.ST_X(func.ST_AsText(Entity.location)).label('longitude')
                    ).where(Entity.is_active == True)
                )
                
                entities = result.all()
                
                for entity_row in entities:
                    # Move entity slightly (simulate movement)
                    lat = float(entity_row.latitude)
                    lon = float(entity_row.longitude)
                    
                    # Random movement
                    lat += random.uniform(-0.0001, 0.0001)
                    lon += random.uniform(-0.0001, 0.0001)
                    
                    # Update entity location
                    entity = await db.get(Entity, entity_row.id)
                    
                    if entity:
                        entity.location = WKTElement(f'POINT({lon} {lat})', srid=4326)
                        entity.last_seen = datetime.utcnow()
                
                if entities:
                    await db.commit()
                    print(f"🚶 Updated {len(entities)} entities")
                    
            except Exception as e:
                print(f"❌ Failed to update entities: {e}")
                await db.rollback()
    
    async def _cleanup_entities(self):
        """Remove entities that haven't been seen in a while"""
        async with AsyncSessionLocal() as db:
            try:
                # Deactivate entities older than 60 seconds (much longer now!)
                cutoff_time = datetime.utcnow() - timedelta(seconds=60)
                
                result = await db.execute(
                    select(Entity).where(
                        Entity.is_active == True,
                        Entity.last_seen < cutoff_time
                    )
                )
                
                old_entities = result.scalars().all()
                count = 0
                
                for entity in old_entities:
                    entity.is_active = False
                    count += 1
                
                if count > 0:
                    await db.commit()
                    print(f"🧹 Deactivated {count} old entities")
                    
            except Exception as e:
                print(f"❌ Failed to cleanup entities: {e}")
                await db.rollback()
            
    async def _generate_events(self):
        """Generate random events"""
        if not self.cameras:
            return
            
        async with AsyncSessionLocal() as db:
            try:
                # Pick random camera
                camera = random.choice(self.cameras)
                
                # Random event type
                event_types = ["motion", "person", "vehicle", "animal"]
                event_type = random.choice(event_types)
                
                # Create event
                event = Event(
                    camera_id=camera['id'],
                    event_type=event_type,
                    confidence=random.uniform(0.7, 0.99),
                    event_metadata={"simulated": True, "location": camera['name']}
                )
                
                db.add(event)
                await db.commit()
                
                print(f"🎯 Generated event: {event_type} detected at {camera['name']}")
                
            except Exception as e:
                print(f"❌ Failed to generate event: {e}")
                await db.rollback()


# Global simulator instance
simulator = CameraSimulator()
