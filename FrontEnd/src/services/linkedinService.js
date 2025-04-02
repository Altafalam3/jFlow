
import { Client } from '@linkedinapi/client';

const linkedinClient = new Client({
  clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
  clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET
});

export const searchAlumni = async (filters) => {
  try {
    const response = await linkedinClient.search.people({
      keywords: filters.currentEmployer,
      locationName: filters.city,
      school: filters.college,
      pastCompany: filters.pastSchool,
    });
    
    return response.people.values.map(person => ({
      id: person.id,
      name: `${person.firstName} ${person.lastName}`,
      profilePic: person.pictureUrl,
      position: person.headline,
      education: person.positions?.values?.[0]?.company?.name || '',
      location: person.location?.name || '',
      connectionDegree: person.distance?.toString() || '2nd',
      linkedinId: person.id
    }));
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    throw error;
  }
};
