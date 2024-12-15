function QuizSummary({ results, onBack }) {
  const correctCount = results.filter(result => result.isCorrect).length;
  const totalCount = results.length;
  const correctRate = (correctCount / totalCount) * 100;

  return (
    <div className="quiz-summary">
      <h2>クイズ結果</h2>
      <p>正答率: {correctRate.toFixed(2)}% ({correctCount}/{totalCount})</p>
      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>問題 {index + 1}</h3>
            <p>{result.question}</p>
            <p>あなたの回答: {result.selectedOptions.join(', ')}</p>
            <p>正解: {result.correctOptions.join(', ')}</p>
            <p>{result.isCorrect ? '正解' : '不正解'}</p>
            <p className="explanation">{result.explanation}</p>
          </div>
        ))}
      </div>
      <button onClick={onBack}>問題選択画面に戻る</button>
    </div>
  );
}

export default QuizSummary;
