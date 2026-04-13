import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// We'll import the logic from the shared lib directory
import { reason } from '../../src/lib/agent-move/engine';
import { impute } from '../../src/lib/prodiff/engine';
import { seedSampleData } from '../../src/lib/data/foursquare/parser';
import { parsePortoCSV } from '../../src/lib/data/porto/parser';
import { parseTDriveFile } from '../../src/lib/data/t-drive/parser';
import { memoryStore } from '../../src/lib/agent-move/memory/store';
import { UMRAlignor } from '../../src/lib/core/umr/alignment';
import { matchPrototype } from '../../src/lib/prodiff/pce';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GTFS-Realtime Proxy
app.get('/api/transit', async (req, res) => {
    try {
        const feedUrl = process.env.GTFS_RT_FEED_URL;
        if (!feedUrl) {
            // Mock data fallback
            return res.json({
                vehicles: [
                    { id: 'V1', lat: 40.7128, lng: -74.0060, route: 'M15', status: 'IN_TRANSIT' },
                    { id: 'V2', lat: 40.7589, lng: -73.9851, route: 'Q32', status: 'STOPPED' }
                ],
                alerts: [{ id: 'A1', type: 'DELAY', text: 'Severe delays on Line 1' }]
            });
        }
        res.status(501).json({ error: 'Real feed not implemented in Express yet' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transit data' });
    }
});

// UMR Alignment
app.post('/api/align', async (req, res) => {
    const { userId, start, end, interventions } = req.body;
    
    try {
        // Try calling the "Active Intelligence" Python Core first
        const PYTHON_CORE_URL = process.env.PYTHON_CORE_URL || "http://localhost:8001";
        
        // Prepare context for AgentMove reasoning head
        if (memoryStore.getAllRecords().length === 0) seedSampleData();
        const reasoning = await reason(userId, new Date());

        const pyResponse = await fetch(`${PYTHON_CORE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId, 
                start, 
                end, 
                interventions,
                context: reasoning // Pass full UMR context to Python
            })
        });

        if (pyResponse.ok) {
            const data = await pyResponse.json();
            return res.json(data);
        }
        
        // Fallback to JS Simulation if Python core is down
        console.warn("Python Core unavailable, falling back to JS Simulation.");
        
        const startPoint = { lat: start[0], lng: start[1] };
        const endPoint = { lat: end[0], lng: end[1] };
        const prototype = matchPrototype(startPoint, endPoint);

        const alignor = new UMRAlignor();
        const alignment = alignor.align(reasoning, prototype, userId, interventions);
        const imputation = await impute(startPoint, endPoint, 20, interventions?.zoneBlocked ? 10 : 50);

        res.json({
            alignment,
            path: imputation.predicted,
            reasoningSteps: [
                `Analysed patterns for ${userId} (Express Fallback)`,
                `Fused latent confidence: ${(alignment.confidence * 100).toFixed(1)}%`
            ]
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Dataset Management
app.post('/api/dataset/switch', (req, res) => {
    const { type } = req.body;
    memoryStore.clear();
    
    const rootDir = path.join(__dirname, '../..');
    
    if (type === "foursquare") {
        seedSampleData();
    } else if (type === "porto") {
        const filePath = path.join(rootDir, 'data/raw/porto/sample.csv');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            parsePortoCSV(content);
        }
    } else if (type === "tdrive") {
        const filePath = path.join(rootDir, 'data/raw/t-drive/sample.txt');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            parseTDriveFile(content);
        }
    }
    
    res.json({ success: true, dataset: type });
});

app.listen(PORT, () => {
    console.log(`🚀 CAD-Mob Intelligence Server running on port ${PORT}`);
});
