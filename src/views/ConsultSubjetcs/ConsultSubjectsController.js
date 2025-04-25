export async function getSubjects() {
  const response = await fetch('/src/views/ConsultSubjetcs/ConsultSubjectsMockData.json');
  return await response.json();
}