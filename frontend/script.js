// Flask API address
const API_URL = "http://127.0.0.1:5000/api/opportunities";

// Get HTML elements
const opportunityTable = document.getElementById("opportunityTable");
const opportunityForm = document.getElementById("opportunityForm");
const formSection = document.getElementById("formSection");
const formTitle = document.getElementById("formTitle");
const messageBox = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");

// Display a success or error message
function showMessage(message, type = "success") {
    messageBox.textContent = message;
    messageBox.className = type;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Clear the message
function clearMessage() {
    messageBox.textContent = "";
    messageBox.className = "";
}

// Send a request and handle API responses
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.error || data.message || `Request failed (${response.status})`
        );
    }

    return data;
}

// Load all opportunities from the API
async function loadOpportunities() {
    opportunityTable.innerHTML =
        '<tr><td colspan="10">Loading opportunities...</td></tr>';

    try {
        const result = await apiRequest(API_URL);

        // Support either a direct array or an object containing opportunities
        const opportunities = Array.isArray(result)
            ? result
            : result.opportunities;

        if (!Array.isArray(opportunities)) {
            throw new Error("The API did not return an opportunities list.");
        }

        displayOpportunities(opportunities);
    } catch (error) {
        opportunityTable.innerHTML =
            '<tr><td colspan="10">Could not load opportunities.</td></tr>';

        showMessage(
            `${error.message}. Make sure Flask is running and the API is accessible.`,
            "error"
        );
    }
}

// Display opportunities in the table
function displayOpportunities(opportunities) {
    opportunityTable.innerHTML = "";

    if (opportunities.length === 0) {
        opportunityTable.innerHTML =
            '<tr><td colspan="10">No research opportunities found.</td></tr>';
        return;
    }

    opportunities.forEach((opportunity) => {
        const row = document.createElement("tr");

        // Use textContent rather than inserting database values as HTML
        const fields = [
            opportunity.id,
            opportunity.title,
            opportunity.research_area,
            opportunity.faculty_name,
            opportunity.department,
            opportunity.required_skills,
            opportunity.positions,
            formatDate(opportunity.deadline)
        ];

        fields.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        // Status column
        const statusCell = document.createElement("td");
        const statusLabel = document.createElement("span");
        statusLabel.textContent = opportunity.status || "Unknown";
        statusLabel.className =
            "status " +
            (opportunity.status === "Open" ? "open" : "closed");
        statusCell.appendChild(statusLabel);
        row.appendChild(statusCell);

        // Actions column
        const actionsCell = document.createElement("td");

        const editButton = createButton("Edit", "edit-btn", () => {
            editOpportunity(opportunity.id);
        });

        const closeButton = createButton(
            opportunity.status === "Closed" ? "Closed" : "Close",
            "close-btn",
            () => closeOpportunity(opportunity.id)
        );

        closeButton.disabled = opportunity.status === "Closed";

        const deleteButton = createButton("Delete", "delete-btn", () => {
            deleteOpportunity(opportunity.id);
        });

        actionsCell.append(editButton, closeButton, deleteButton);
        row.appendChild(actionsCell);

        opportunityTable.appendChild(row);
    });
}

// Safely create action buttons
function createButton(label, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = className;
    button.addEventListener("click", onClick);
    return button;
}

// Format a date for display
function formatDate(value) {
    if (!value) return "";

    // Handles YYYY-MM-DD strings without timezone shifting
    if (typeof value === "string") {
        const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) return match[1];
    }

    return String(value);
}

// Open a blank form for creating an opportunity
document.getElementById("addBtn").addEventListener("click", () => {
    resetForm();
    formTitle.textContent = "Add Research Opportunity";
    saveBtn.textContent = "Save Opportunity";
    formSection.hidden = false;
    document.getElementById("title").focus();
    clearMessage();
});

// Close the form
document.getElementById("cancelBtn").addEventListener("click", () => {
    formSection.hidden = true;
    resetForm();
    clearMessage();
});

// Reset all form fields
function resetForm() {
    opportunityForm.reset();
    document.getElementById("opportunityId").value = "";
    document.getElementById("status").value = "Open";
}

// Read values from the form
function getFormData() {
    const positionsInput = document.getElementById("positions");
    const positions = Number(positionsInput.value);

    if (!Number.isInteger(positions) || positions < 1) {
        throw new Error("Number of positions must be a positive whole number.");
    }

    return {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        research_area: document.getElementById("research_area").value.trim(),
        faculty_name: document.getElementById("faculty_name").value.trim(),
        department: document.getElementById("department").value.trim(),
        required_skills: document.getElementById("required_skills").value.trim(),
        positions: positions,
        deadline: document.getElementById("deadline").value,
        status: document.getElementById("status").value
    };
}

// Create or update an opportunity
opportunityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    let opportunity;

    try {
        opportunity = getFormData();
    } catch (error) {
        showMessage(error.message, "error");
        return;
    }

    // Check all required fields
    for (const [field, value] of Object.entries(opportunity)) {
        if (value === "" || value === null || value === undefined) {
            showMessage(`Please fill in the ${field.replaceAll("_", " ")} field.`, "error");
            return;
        }
    }

    const id = document.getElementById("opportunityId").value;
    const isEditing = Boolean(id);

    const url = isEditing ? `${API_URL}/${id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    saveBtn.disabled = true;

    try {
        const result = await apiRequest(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(opportunity)
        });

        formSection.hidden = true;
        resetForm();

        showMessage(
            result.message ||
                (isEditing
                    ? "Opportunity updated successfully."
                    : "Opportunity created successfully."),
            "success"
        );

        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        saveBtn.disabled = false;
    }
});

// Load one opportunity and populate the form
async function editOpportunity(id) {
    clearMessage();

    try {
        const result = await apiRequest(`${API_URL}/${id}`);
        const opportunity = result.opportunity || result;

        document.getElementById("opportunityId").value = opportunity.id;
        document.getElementById("title").value = opportunity.title || "";
        document.getElementById("description").value = opportunity.description || "";
        document.getElementById("research_area").value = opportunity.research_area || "";
        document.getElementById("faculty_name").value = opportunity.faculty_name || "";
        document.getElementById("department").value = opportunity.department || "";
        document.getElementById("required_skills").value = opportunity.required_skills || "";
        document.getElementById("positions").value = opportunity.positions ?? "";
        document.getElementById("deadline").value = formatDate(opportunity.deadline);
        document.getElementById("status").value = opportunity.status || "Open";

        formTitle.textContent = "Edit Research Opportunity";
        saveBtn.textContent = "Update Opportunity";
        formSection.hidden = false;
        document.getElementById("title").focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Close an opportunity by updating its status
async function closeOpportunity(id) {
    if (!confirm("Are you sure you want to close this opportunity?")) return;

    clearMessage();

    try {
        const result = await apiRequest(`${API_URL}/${id}`);

        const opportunity = result.opportunity || result;

        const updatedOpportunity = {
            title: opportunity.title,
            description: opportunity.description,
            research_area: opportunity.research_area,
            faculty_name: opportunity.faculty_name,
            department: opportunity.department,
            required_skills: opportunity.required_skills,
            positions: opportunity.positions,
            deadline: formatDate(opportunity.deadline),
            status: "Closed"
        };

        const updateResult = await apiRequest(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOpportunity)
        });

        showMessage(
            updateResult.message || "Opportunity closed successfully.",
            "success"
        );

        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Delete an opportunity
async function deleteOpportunity(id) {
    if (!confirm("Are you sure you want to delete this opportunity? This cannot be undone.")) {
        return;
    }

    clearMessage();

    try {
        const result = await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showMessage(result.message || "Opportunity deleted successfully.", "success");
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Refresh the table
document.getElementById("refreshBtn").addEventListener("click", () => {
    clearMessage();
    loadOpportunities();
});

// Load records when the page opens
loadOpportunities();
