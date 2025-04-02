
import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

class LinkedInService {
  constructor() {
    this.accessToken = localStorage.getItem('linkedin_token');
  }

  async searchAlumni(filters) {
    try {
      const response = await axios.get(`${LINKEDIN_API_BASE}/search/people`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        params: {
          keywords: `${filters.college} ${filters.currentEmployer}`,
          location: filters.city,
          facetNetwork: 'S',
          start: 0,
          count: 25
        }
      });
      
      return response.data.elements.map(person => ({
        id: person.id,
        name: `${person.firstName} ${person.lastName}`,
        profilePic: person.profilePicture?.displayImage,
        headline: person.headline,
        location: person.location?.name,
        connectionDegree: person.distance?.value,
        profileUrl: `https://www.linkedin.com/in/${person.vanityName}`
      }));
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      throw error;
    }
  }

  async connectWithAlumni(profileId, message) {
    try {
      await axios.post(`${LINKEDIN_API_BASE}/invitations`, {
        invitee: { profileId },
        message: {
          subject: "Let's connect!",
          body: message
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });
    } catch (error) {
      console.error('Connection request error:', error);
      throw error;
    }
  }
}

export default new LinkedInService();
