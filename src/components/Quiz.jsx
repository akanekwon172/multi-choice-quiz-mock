import { useState, useEffect } from 'react';
import QuizSummary from './QuizSummary';

const fisherYatesShuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

function Quiz({ quizData, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const shuffledQuestions = [...quizData.quizzes];

    setQuestions(
      shuffledQuestions.map((q) => ({
        ...q,
        options: fisherYatesShuffle(q.options),
      }))
    );
  }, [quizData]);

  const handleOptionSelect = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.multiselect) {
      const index = newSelectedOptions.indexOf(optionIndex);
      if (index > -1) {
        newSelectedOptions.splice(index, 1);
      } else {
        newSelectedOptions.push(optionIndex);
      }
    } else {
      newSelectedOptions[0] = optionIndex;
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.options
      .map((option, index) => (option.answer ? index : -1))
      .filter((index) => index !== -1);

    const isAnswerCorrect = currentQuestion.multiselect
      ? selectedOptions.length === correctAnswers.length &&
        selectedOptions.every((option) => correctAnswers.includes(option))
      : selectedOptions[0] === correctAnswers[0];

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    setResults([
      ...results,
      {
        question: currentQuestion.question,
        isCorrect: isAnswerCorrect,
        selectedOptions: selectedOptions.map(
          (index) => currentQuestion.options[index].text
        ),
        correctOptions: correctAnswers.map(
          (index) => currentQuestion.options[index].text
        ),
        explanation: currentQuestion.explanation,
      },
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const phase = setPhase(currentQuestion);

  if (quizCompleted) {
    return <QuizSummary results={results} onBack={onBack} />;
  }

  return (
    <div>
      <h2>
        {quizData.title} ({currentQuestionIndex + 1}/{questions.length})
      </h2>
      <div className="question">
        <div className="question-area">
          <div id="phaseArea" className="q-char">
            {phase}
          </div>
          <p>+</p>
          <div id="questionText" className="q-char">
            {currentQuestion.side}
          </div>
        </div>

        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option ${
                selectedOptions.includes(index) ? 'selected' : ''
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
      {!showFeedback && <button onClick={handleSubmit}>回答する</button>}
      {showFeedback && (
        <div>
          <p className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '正解です！' : '不正解です。'}
          </p>
          <p className="explanation">{currentQuestion.explanation}</p>
          <button onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1
              ? '次の問題へ'
              : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
