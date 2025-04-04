import React, { useState, useEffect } from "react";
import "./quizScreen.css";
import quizData from './quizData'
import successIcon from '../success.png';
import failedIcon from '../failed.png';

export default function QuizApp(props) {
  const [firstName, setFirstName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentCategory = quizData.categories.find(
    (cat) => cat.id === selectedCategory
  );
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];


  useEffect(() => {
    if (!currentQuestion || answered) return;
    if (timeLeft === 0) {
      skipQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion, answered]);

  
  const startQuiz = () => {
    debugger
    if (firstName && selectedCategory) {
      debugger
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(quizData.categories.find(cat => cat.id === selectedCategory).questions[0].timeLimit);
      setAnswered(false);
      setShowResults(false);
    }
  };

  const handleAnswer = () => {
    if (!answered && selectedOption) {
      const correctLetter = currentQuestion.correctAnswer;
      if (selectedOption.startsWith(correctLetter)) {
        setScore(score + 1);
      }
      setAnswered(true);
      setTimeout(nextQuestion, 1000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(currentCategory.questions[currentQuestionIndex + 1].timeLimit);
      setAnswered(false);
    } else {
      setShowResults(true);
      props.setName(firstName)
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const resetQuiz = () => {
    setFirstName("");
    setSelectedCategory(null);
    setShowResults(false);
  };

  return (
    <div className="quiz-container">
      {!selectedCategory ? (
        <>
          <h1 className="heading">Welcome to <span className="subHeading"><span>QUIZ</span>Mania</span></h1>
          
        <div className="category-selection">
          <div className="infoCont">
                Please read all the rules about this quiz before you start. <br />
                <button>Quiz rules</button>
            </div>
          <label>Full name</label>
          <input
            type="text"
            placeholder="Full name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="name-input"
          />
          <div className="category-options">
            <label>Please select topic to continue</label>
            {quizData.categories.map((cat) => (
              <label key={cat.id} className="category-label">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  checked={selectedCategory === cat.id}
                />
                {cat.name}
              </label>
            ))}
          </div>
          <button onClick={startQuiz}  className="start-button">
            Start Quiz
          </button>
        </div>        
        </>
      ) : showResults ? (
        <div className="results">
          
          {score >= currentCategory.questions.length / 2 ? (
            <>
            <img src={successIcon} className="iconQuiz" />
            <h2 className="heading">Congratulation</h2>
            <h4 className="subheading">You successfully completed the Quiz and holds</h4>
            <p className="scoreTxt">Your Score <br /> <span style={{color:'#06AF52'}}>{score} / {currentCategory.questions.length}</span></p>                    
            <p className="congTxt">Great job!</p>
            </>
          )
          :
          (
            <>
            <img src={failedIcon} className="iconQuiz" />            
            <h4 className="subheading">You successfully completed the Quiz but you need to</h4>
            <h2 className="heading">Keep practicing!</h2>
            <p className="scoreTxt">Your Score <br /> <span style={{color:'#AF0606'}}>{score} / {currentCategory.questions.length}</span></p>           
            </>
          )
        }
          <button className="retake-button" onClick={resetQuiz}>Retake Quiz</button>
        </div>
      ) : (
        <div className="question-card">
          <div className="question-header">
            <h2><span>{currentQuestionIndex + 1}</span> / {currentCategory.questions.length}</h2>
            <div className="timer">{timeLeft}s</div>
          </div>
          <div className="question-status"> <div className="statusLength">&nbsp;</div></div>
          <p className="question-text">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
          <div className="options-container">
          {currentQuestion.options.map((opt, index) => {
              const isCorrect = opt.startsWith(currentQuestion.correctAnswer);
              return (
                <label
                  key={index}
                  className={`option-label ${answered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={answered}
                    checked={selectedOption === opt}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          <div className="button-group">
            <button className="next-button" onClick={handleAnswer} disabled={!selectedOption || answered}>Next</button>
            {currentQuestionIndex + 1 < currentCategory.questions.length &&
            <button className="skip-button" onClick={skipQuestion}>Skip this question</button>
            }
          </div>
        </div>
      )}
    </div>
  );
}
