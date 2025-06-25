export async function getSubjectSyllabusData() {
  const response = await fetch('/src/views/SubjectSyllabus/SubjectSyllabusMockData.json');
  return await response.json();
}