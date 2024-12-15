import React, { useState } from 'react';

function QuizSelector({ quizzes, onSelect }) {
  const [selectedQuizId, setSelectedQuizId] = useState('');

  const handleSelect = (e) => {
    setSelectedQuizId(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedQuizId) {
      onSelect(selectedQuizId);
    }
  };

  return (
    <div>
      <select value={selectedQuizId} onChange={handleSelect}>
        <option value="">クイズを選択してください</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>OK</button>
    </div>
  );
}

export default QuizSelector;
