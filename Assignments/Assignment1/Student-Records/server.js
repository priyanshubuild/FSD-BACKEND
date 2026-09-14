import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "students.json");
const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Student Records API is running");
    } else if (req.url === "/students" && req.method === "GET") {
        const data = fs.readFileSync(filePath, "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
    } else if (req.url === "/students" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            const students = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const newStudent = JSON.parse(body);
            newStudent.id = students.length + 1;
            students.push(newStudent);
            fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newStudent));
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
