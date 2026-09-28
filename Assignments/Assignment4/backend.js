import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "requests.json");

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for frontend requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Serve frontend static files
app.use(express.static(__dirname));

// Helper function to read requests from requests.json
function getRequests() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
}

// Helper function to write requests to requests.json
function saveRequests(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 1. GET /api/requests - Get all requests
app.get("/api/requests", (req, res) => {
    try {
        const requests = getRequests();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: "Failed to read requests" });
    }
});

// 2. GET /api/requests/:id - Get a single request by ID
app.get("/api/requests/:id", (req, res) => {
    try {
        const requests = getRequests();
        const request = requests.find((r) => r.id == req.params.id);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve request" });
    }
});

// 3. POST /api/requests - Submit a new request
app.post("/api/requests", (req, res) => {
    try {
        const { studentName, email, category, description, priority } = req.body;

        if (!studentName || !email || !category || !description || !priority) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const requests = getRequests();
        const newRequest = {
            id: Date.now(),
            studentName,
            email,
            category,
            description,
            priority
        };

        requests.push(newRequest);
        saveRequests(requests);

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ error: "Failed to create request" });
    }
});

// 4. PUT /api/requests/:id - Update an existing request
app.put("/api/requests/:id", (req, res) => {
    try {
        const requests = getRequests();
        const index = requests.findIndex((r) => r.id == req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: "Request not found" });
        }

        const { studentName, email, category, description, priority } = req.body;

        requests[index] = {
            ...requests[index],
            studentName: studentName || requests[index].studentName,
            email: email || requests[index].email,
            category: category || requests[index].category,
            description: description || requests[index].description,
            priority: priority || requests[index].priority
        };

        saveRequests(requests);
        res.json(requests[index]);
    } catch (err) {
        res.status(500).json({ error: "Failed to update request" });
    }
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete("/api/requests/:id", (req, res) => {
    try {
        const requests = getRequests();
        const filtered = requests.filter((r) => r.id != req.params.id);

        if (filtered.length === requests.length) {
            return res.status(404).json({ error: "Request not found" });
        }

        saveRequests(filtered);
        res.json({ message: "Request deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete request" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
