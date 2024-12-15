import React, { useState, useEffect } from 'react';
import QuizSelector from './components/QuizSelector';
import Quiz from './components/Quiz';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      const quizModules = import.meta.glob('./quizzes/*.js');
      const loadedQuizzes = [];

      for (const path in quizModules) {
        const module = await quizModules[path]();
        loadedQuizzes.push({
          id: path.split('/').pop().replace('.js', ''),
          title: module.quizData.title,
          data: module.quizData,
        });
      }

      setQuizzes(loadedQuizzes);
    };

    loadQuizzes();
  }, []);

  const handleQuizSelect = (quizId) => {
    const selected = quizzes.find((quiz) => quiz.id === quizId);
    setSelectedQuiz(selected);
  };

  return (
    <div className="container">
      <h1>4択 クイズアプリ</h1>
      {!selectedQuiz ? (
        <QuizSelector quizzes={quizzes} onSelect={handleQuizSelect} />
      ) : (
        <Quiz
          quizData={selectedQuiz.data}
          onBack={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
}

export default App;
