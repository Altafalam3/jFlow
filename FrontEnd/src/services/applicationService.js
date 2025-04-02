
import axios from '../utils/axiosInstance';

class ApplicationService {
  async getAllApplications() {
    try {
      const response = await axios.get('/api/applications');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  }

  async addApplication(applicationData) {
    try {
      const response = await axios.post('/api/applications', applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add application');
    }
  }

  async updateApplicationStatus(id, status) {
    try {
      const response = await axios.patch(`/api/applications/${id}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  }

  async deleteApplication(id) {
    try {
      await axios.delete(`/api/applications/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete application');
    }
  }
}

export default new ApplicationService();
