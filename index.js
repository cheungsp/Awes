const BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = "ca6fdb783ce0745592d05d60fe33f461bf824c23866d6a92298ac8f30c68cc1f"

function postQuestion (questionFormData) {
  const headers = new Headers({
    'Authorization':`Apikey ${API_KEY}`
  });
  return fetch(`${BASE_URL}/questions`, {
    method: 'POST',
    body: questionFormData,
    headers
  })
    .then(res => res.json());
}

function getQuestions () {
  const headers = new Headers({
    'Authorization':`Apikey ${API_KEY}`
  });
  return fetch(`${BASE_URL}/questions`, {headers})
    .then(res => res.json());
}

function getQuestion (id) {
  const headers = new Headers({
    'Authorization':`Apikey ${API_KEY}`
  });
  return fetch(`${BASE_URL}/questions/${id}`, {headers})
  // A better practice when handling response from fetch
  // is to check its status if it was successful (Status: 200 OK)
  // before parsing as json with (res.json()).
    .then(res => res.json());
}

function renderQuestionSummary (question) {
  return `
    <div class="question-summary">
      <a href class="question-link" data-id="${question.id}">
        ${question.title}
      </a>
    </div>
  `;
}

function renderQuestionList (questions) {
  return questions.map(renderQuestionSummary).join('');
}

function renderQuestionDetails (question) {
  return `
    <a href class="back-button">Back</a>
    <h1>${question.title}</h1>
    <p>${question.body}</p>
    <p><strong>Author:</strong> ${question.author_full_name}</p>
    <h2>Answers</h2>
    ${renderAnswerList(question.answers)}
  `;
}

function renderAnswerList (answers) {
  return `
    <ul class="answer-list">
      ${
        answers.map(({body}) => `<li>${body}</li>`).join('')
      }
    </ul>
  `
}


document.addEventListener('DOMContentLoaded', () => {
  const questionList = document.querySelector('#questions-list');
  const questionDetails = document.querySelector('#question-details');
  const questionForm = document.querySelector('#question-form');
  // NAV BAR ELEMENTS
  const navQuestionIndex = document.querySelector('#nav-question-index');
  const navQuestionNew= document.querySelector('#nav-question-new');

  function showQuestion (id) {
    return getQuestion(id)
      .then(question => {
        questionList.classList.add('hidden');
        questionDetails.innerHTML = renderQuestionDetails(question);
        questionDetails.classList.remove('hidden');
        questionForm.classList.add('hidden');

      });
  }

  function newQuestion () {
    questionList.classList.add('hidden');
    questionDetails.classList.add('hidden');
    questionForm.classList.remove('hidden');
  }

  function indexQuestion () {
    questionList.classList.remove('hidden');
    questionDetails.classList.add('hidden');
    questionForm.classList.add('hidden');

  }

  getQuestions().then(questions => {
    questionList.innerHTML = renderQuestionList(questions);
  })

  questionForm.addEventListener('submit', event => {
    const { currentTarget } = event;
    event.preventDefault();

    postQuestion(new FormData(currentTarget))
      .then(({id}) => {
        showQuestion(id);
      });
  })

  questionList.addEventListener('click', event => {
    const {target} = event;
    if (target.matches('a.question-link')) {
      event.preventDefault();
      const id = target.getAttribute('data-id');
      showQuestion(id);
    }

    if (target.matches('a.back-button')) {
      event.preventDefault();
      indexQuestion();
    }
  });

  navQuestionIndex.addEventListener('click', event => {
    event.preventDefault();
    indexQuestion();
  });
  navQuestionNew.addEventListener('click', event => {
    event.preventDefault();
    newQuestion();
  });
});
