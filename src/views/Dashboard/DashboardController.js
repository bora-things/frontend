import api from '@/config/axios.config';

export async function handleRemoveInterestedSubjectRequest(subjectId) {
  try {
    await api.delete(`/api/users/interests/${subjectId}`)
  } catch (error) {
    console.error('Error removing interested subject:', error)
  }
}

export async function handleAddInterestedSubjectRequest({ subjectCode, year, period }) {
  try {
    const formData = {
      subjectCode,
      year,
      period
    }
    await api.post(`/api/users/interests`, formData);
  } catch (error) {
    console.error('Error adding interested subject:', error)
  }
}

export async function handleInterestedSubjectsRequest() {
  try {
    const response = await api.get('/api/users/interests');
    return response.data;
  } catch (error) {
    console.error('Error fetching interested subjects:', error);
    return [];
  }
}