const questionCountId = document.querySelector('#questionCount');
const submitButtonId = document.querySelector('#submitButton');
let currentQuestionIndex = 0;
let correctCount = 0;
const questionCount = quizData.length;

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questionCount) {
    displayQuestion(currentQuestionIndex);
    submitButtonId.textContent = '回答';
  } else {
    const score = Math.floor((correctCount / questionCount) * 100);
    alert(`お疲れ様です。正答率は${score}％でした。`);

    currentQuestionIndex = 0;
    correctCount = 0;
    document.getElementById('correctCount').textContent = correctCount;
    questionCountId.textContent = questionCount;
    displayQuestion(currentQuestionIndex);
  }
}

function checkAnswer() {
  const selectedOptions = document.querySelectorAll(
    'input[name="option"]:checked'
  );
  const selectedValues = Array.from(selectedOptions).map((input) =>
    parseInt(input.value)
  );
  const question = quizData[currentQuestionIndex];
  let correct = true;

  question.options.forEach((option, i) => {
    const optionElement = document.querySelector(
      `label:nth-child(${i * 2 + 1})`
    );
    if (option.answer && !selectedValues.includes(i)) {
      optionElement.classList.add('correct');
      correct = false;
    } else if (!option.answer && selectedValues.includes(i)) {
      optionElement.classList.add('incorrect');
      correct = false;
    } else {
      optionElement.classList.remove('correct', 'incorrect');
    }
  });

  if (
    correct &&
    selectedValues.length === question.options.filter((o) => o.answer).length
  ) {
    correctCount++;
    document.getElementById('correctCount').textContent = correctCount;
    submitButtonId.textContent = '正解：次へ';
  } else {
    submitButtonId.textContent = '不正解：次へ';
  }
}

function displayQuestion(index) {
  const question = quizData[index];
  const optionsContainer = document.getElementById('optionsContainer');

  const phase = setPhase(question);
  document.getElementById('phaseArea').textContent = phase;
  document.getElementById('questionText').textContent = question.question;

  optionsContainer.innerHTML = '';
  question.options.forEach((option, i) => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    const br = document.createElement('br');
    const multiselect = question?.multiselect ?? false;

    if (multiselect) {
      Object.assign(input, { ...{ type: 'checkbox' } });
    } else {
      Object.assign(input, { ...{ type: 'radio' } });
    }
    Object.assign(input, { ...{ name: 'option', value: i } });

    label.appendChild(input);
    label.appendChild(document.createTextNode(option.text));
    optionsContainer.appendChild(label);
    optionsContainer.appendChild(br);
  });
}

function setPhase(question) {
  let phase = '石';
  switch (question.phase) {
    case 'Gas':
      phase = '气';
      break;
    case 'Liquid':
      phase = '水';
      break;
    case 'Solid':
      phase = '石';
      break;
    default:
      break;
  }
  if (question.metal) phase = '金';

  return phase;
}

document.addEventListener('DOMContentLoaded', () => {
  questionCountId.textContent = questionCount;

  submitButtonId.addEventListener('click', (e) => {
    if (submitButtonId.textContent.startsWith('正解')) {
      nextQuestion();
    } else if (submitButtonId.textContent.startsWith('不正解')) {
      nextQuestion();
    } else {
      checkAnswer();
    }
  });

  displayQuestion(currentQuestionIndex);
});
