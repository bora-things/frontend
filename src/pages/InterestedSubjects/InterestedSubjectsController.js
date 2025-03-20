export async function getDefaultSubjects() {
    const response = await fetch('/src/pages/InterestedSubjects/InterestedSubjectsMockData.json');
    return await response.json();
  }