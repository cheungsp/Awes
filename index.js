const BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = "ca6fdb783ce0745592d05d60fe33f461bf824c23866d6a92298ac8f30c68cc1f"

// function that takes a question object and outputs as string
function getQuestions () {
  const headers = new Headers({
    'Authorization':`Apikey ${API_KEY}`
  })
  return fetch(`${BASE_URL}/questions`, {headers})
    .then(res => res.json());
}

function renderQuestionSummary (question) {
  return `
    <div class="question-summary">
      ${question.title}
    </div>
  `;
}
function renderQuestionList (questions) {
  return questions.map(renderQuestionSummary).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const questionList = document.querySelector('#questions-list');

  getQuestions().then(questions => {
    // console.log(renderQuestionList(questions));
    questionList.innerHTML = renderQuestionList(questions);
  })
});
