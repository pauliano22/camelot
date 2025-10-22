"""
Camera Simulator
Generates fake camera data for testing.
"""
import asyncio
import random
from datetime import datetime
from geoalchemy2.elements import WKTElement
from app.db.session import AsyncSessionLocal
from app.models.camera import Camera
from app.models.entity import Entity
from app.models.event import Event


class CameraSimulator:
    def __init__(self):
        self.running = False
        self.cameras = []
        
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
        """Load cameras from database"""
        async with AsyncSessionLocal() as db:
            try:
                from sqlalchemy import select
                result = await db.execute(select(Camera))
                self.cameras = result.scalars().all()
                print(f"📹 Simulating cameras: {[c.id for c in self.cameras]}")
            except Exception as e:
                print(f"❌ Failed to load cameras: {e}")
            
    async def _simulation_loop(self):
        """Main simulation loop"""
        while self.running:
            try:
                # Heartbeat
                print(f"💓 Simulator heartbeat - Active cameras: {len(self.cameras)}")
                
                # Generate random events (these work!)
                await self._generate_events()
                
                # Wait before next cycle
                await asyncio.sleep(5)
                
            except Exception as e:
                print(f"❌ Simulator error: {e}")
                await asyncio.sleep(5)
            
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
                    camera_id=camera.id,
                    event_type=event_type,
                    confidence=random.uniform(0.7, 0.99),
                    event_metadata={"simulated": True, "location": camera.name}
                )
                
                db.add(event)
                await db.commit()
                
                print(f"🎯 Generated event: {event_type} detected at {camera.id}")
                
            except Exception as e:
                print(f"❌ Failed to generate event: {e}")
                await db.rollback()


# Global simulator instance
simulator = CameraSimulator()
