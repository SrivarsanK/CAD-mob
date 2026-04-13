import { NextResponse } from 'next/server';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

// Fallback mock data in case of failed fetch or no API key
const MOCK_TRANSIT_DATA = {
  tripUpdates: [
    {
      trip: { tripId: "T1", routeId: "L" },
      stopTimeUpdate: [
        { stopId: "S1", arrival: { delay: 120, time: Date.now() / 1000 + 300 } }
      ]
    }
  ],
  vehiclePositions: [
    {
      vehicle: { id: "V1" },
      position: { latitude: 40.7128, longitude: -74.0060 },
      timestamp: Date.now() / 1000
    }
  ]
};

export async function GET() {
  const FEED_URL = process.env.GTFS_RT_FEED_URL || 'https://api-endpoint.mta.info/Dataservice/MTADTS/gtfs-rt'; // Example
  const API_KEY = process.env.GTFS_RT_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ 
      data: MOCK_TRANSIT_DATA,
      status: "mock",
      message: "No API key provided, returning simulation data."
    });
  }

  try {
    const response = await fetch(FEED_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`GTFS-RT Fetch failed: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const vehiclePositions = feed.entity
      .filter(entity => entity.vehicle)
      .map(entity => entity.vehicle);

    const tripUpdates = feed.entity
      .filter(entity => entity.tripUpdate)
      .map(entity => entity.tripUpdate);

    return NextResponse.json({ 
      data: { vehiclePositions, tripUpdates },
      status: "live",
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.warn("Falling back to mock transit data due to error:", error.message);
    return NextResponse.json({ 
      data: MOCK_TRANSIT_DATA,
      status: "fallback",
      error: error.message
    });
  }
}
