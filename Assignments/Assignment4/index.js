// Base API URL
const API_URL = "/api/requests";

// DOM Elements
const requestForm = document.getElementById("requestForm");
const requestIdInput = document.getElementById("requestId");
const studentNameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("form-title");
const requestsList = document.getElementById("requestsList");
const requestCount = document.getElementById("requestCount");

// Load requests when the page loads
document.addEventListener("DOMContentLoaded", getAllRequests);

// 1. GET ALL REQUESTS
async function getAllRequests() {
    try {
        const response = await fetch(API_URL);
        const requests = await response.json();
        renderRequests(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

// 2. SUBMIT OR UPDATE REQUEST
requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = requestIdInput.value;
    const requestData = {
        studentName: studentNameInput.value.trim(),
        email: emailInput.value.trim(),
        category: categoryInput.value,
        priority: priorityInput.value,
        description: descriptionInput.value.trim()
    };

    if (id) {
        // Update existing request (PUT)
        await updateRequest(id, requestData);
    } else {
        // Submit new request (POST)
        await createRequest(requestData);
    }

    resetForm();
    getAllRequests();
});

// SUBMIT NEW REQUEST (POST)
async function createRequest(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Failed to submit request");
        }
    } catch (error) {
        console.error("Error creating request:", error);
    }
}

// UPDATE EXISTING REQUEST (PUT)
async function updateRequest(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Failed to update request");
        }
    } catch (error) {
        console.error("Error updating request:", error);
    }
}

// 3. GET SINGLE REQUEST AND POPULATE FORM FOR EDITING (GET by ID)
async function editRequest(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const request = await response.json();

        // Populate form inputs
        requestIdInput.value = request.id;
        studentNameInput.value = request.studentName;
        emailInput.value = request.email;
        categoryInput.value = request.category;
        priorityInput.value = request.priority;
        descriptionInput.value = request.description;

        // Update UI states
        formTitle.textContent = "Edit Request";
        submitBtn.textContent = "Update Request";
        cancelBtn.style.display = "inline-flex";

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error("Error fetching single request:", error);
    }
}

// 4. DELETE A REQUEST (DELETE)
async function deleteRequest(id) {
    const confirmDelete = confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            getAllRequests();
        } else {
            alert("Failed to delete request");
        }
    } catch (error) {
        console.error("Error deleting request:", error);
    }
}

// Reset form to default state
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
    requestForm.reset();
    requestIdInput.value = "";
    formTitle.textContent = "Submit a New Request";
    submitBtn.textContent = "Submit Request";
    cancelBtn.style.display = "none";
}

// Render list of requests in DOM
function renderRequests(requests) {
    requestCount.textContent = `${requests.length} Request${requests.length === 1 ? "" : "s"}`;

    if (!requests || requests.length === 0) {
        requestsList.innerHTML = `
            <div class="empty-state">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p style="font-weight: 500; color: #1d1d1f; margin-bottom: 3px;">No Requests Yet</p>
                <p style="font-size: 0.84rem; color: #86868b;">Campus inquiries you submit will appear here.</p>
            </div>
        `;
        return;
    }

    requestsList.innerHTML = requests.map((req) => `
        <div class="request-card">
            <div class="request-header">
                <div>
                    <span class="student-info">${escapeHtml(req.studentName)}</span>
                    <span class="student-email">(${escapeHtml(req.email)})</span>
                </div>
                <div class="tag-group">
                    <span class="badge-category">${escapeHtml(req.category)}</span>
                    <span class="badge-priority priority-${req.priority.toLowerCase()}">${escapeHtml(req.priority)}</span>
                </div>
            </div>

            <div class="request-description">${escapeHtml(req.description)}</div>

            <div class="request-actions">
                <button class="btn btn-edit" onclick="editRequest(${req.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteRequest(${req.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

// Helper to escape HTML characters for safety
function escapeHtml(str) {
    if (!str) return "";
    return str
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
