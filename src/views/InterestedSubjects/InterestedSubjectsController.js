export async function getDefaultSubjects() {
    const response = await fetch('/src/views/InterestedSubjects/InterestedSubjectsMockData.json');
    return await response.json();
  }



  export async function saveInterestedSubjects() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }