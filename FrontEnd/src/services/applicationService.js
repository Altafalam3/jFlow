import axios from "../utils/axiosInstance";

class ApplicationService {
    async getAllApplications() {
        const response = await axios.get("/api/applications");
        return response.data;
    }

    async addApplication(applicationData) {
        const response = await axios.post("/api/applications", applicationData);
        return response.data;
    }

    async updateApplicationStatus(id, status) {
        const response = await axios.patch(`/api/applications/${id}`, {
            status,
        });
        return response.data;
    }

    async deleteApplication(id) {
        await axios.delete(`/api/applications/${id}`);
    }

    async getJobPostings(filters) {
        const response = await axios.get("/api/jobs/search", {
            params: filters,
        });
        return response.data;
    }
}

export default new ApplicationService();
