import React, { useState, useEffect } from 'react';

import img1 from './imgs/image1.jpg';
import img2 from './imgs/image2.jpg';
import img3 from './imgs/image3.jpg';
import img4 from './imgs/image4.jpg';
import img5 from './imgs/image5.jpg';
import img6 from './imgs/image6.jpg';
import img7 from './imgs/image7.jpg';
import img8 from './imgs/image8.jpg';
import img9 from './imgs/image9.jpg';
import img10 from './imgs/image10.jpg';
import img11 from './imgs/image11.jpg';
import img12 from './imgs/image12.jpg';
import cardBack from './imgs/card_back.webp';

const MemoryGame = ({ lang, navigateTo }) => {
  const [gameState, setGameState] = useState('start');
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [levelStats, setLevelStats] = useState({ easy: [], medium: [], hard: [] });

  const imgsPaths = [
    img1, img2, img3, img4, img5, img6,
    img7, img8, img9, img10, img11, img12
  ];

  useEffect(() => {
    const savedHighScore = localStorage.getItem('memoryGameHighScore') || 0;
    setHighScore(parseInt(savedHighScore));
  }, []);

  const getMaxScoreForDifficulty = (diff) => {
    switch(diff) {
      case 'easy': return 40;
      case 'medium': return 60;
      case 'hard': return 80;
      default: return 40;
    }
  };

  const addGameResult = (finalScore, currentDiff) => {
    const maxScore = getMaxScoreForDifficulty(currentDiff);
    const percentage = (finalScore / maxScore) * 100;

    //save last 3 result
    setLevelStats(prev => {
      const updated = { ...prev };
      updated[currentDiff] = [...(updated[currentDiff] || []), percentage];
      if (updated[currentDiff].length > 3) {
        updated[currentDiff] = updated[currentDiff].slice(-3);
      }

      // check upgrade
      if (updated[currentDiff].length === 3 && updated[currentDiff].every(p => p >= 95)) {
        if (currentDiff === 'easy') {
          setTimeout(() => {
            setDifficulty('medium');
            alert(lang === 'en' ? '🎉 Excellent! You reached Medium level!' : '🎉 ممتاز! لقد وصلت للمستوى المتوسط!');
          }, 100);
        } else if (currentDiff === 'medium') {
          setTimeout(() => {
            setDifficulty('hard');
            alert(lang === 'en' ? '🎉 Amazing! You reached Hard level!' : '🎉 رائع! لقد وصلت للمستوى الصعب!');
          }, 100);
        }
      }
      return updated;
    });
  };

  const initializeGame = (diff) => {
    let numPairs;
    let initialScore;
    
    switch(diff) {
      case 'easy':
        numPairs = 6;
        initialScore = 40;
        break;
      case 'medium':
        numPairs = 8;
        initialScore = 60;
        break;
      case 'hard':
        numPairs = 12;
        initialScore = 80;
        break;
      default:
        numPairs = 6;
        initialScore = 40;
    }
    
    setScore(initialScore);
    
    let newCards = [];
    for (let i = 0; i < numPairs; i++) {
      newCards.push({ 
        id: `card-${i}-a`, 
        value: i, 
        isFlipped: false, 
        isMatched: false, 
        imgPath: imgsPaths[i % imgsPaths.length] 
      });
      newCards.push({ 
        id: `card-${i}-b`, 
        value: i, 
        isFlipped: false, 
        isMatched: false, 
        imgPath: imgsPaths[i % imgsPaths.length] 
      });
    }
    
    newCards = shuffleArray(newCards);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    
    setTimeout(() => {
      setShowAllCards(true);
    }, 1500);
    setTimeout(() => {
      setShowAllCards(false);
    }, 4000.5);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
  };

  // Start game
  const handleStartGame = () => {
    initializeGame(difficulty);
    setGameState('playing');
    setIsGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (index) => {
    if (!isGameStarted) return;
    if (cards[index].isMatched) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(index)) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkMatch(newFlippedCards[0], newFlippedCards[1]);
      }, 1000);
    }
  };

  //cards match
  const checkMatch = (index1, index2) => {
    if (cards[index1].value === cards[index2].value) {
      const newCards = [...cards];
      newCards[index1].isMatched = true;
      newCards[index2].isMatched = true;
      setCards(newCards);
      
      const newMatchedCards = [...matchedCards, index1, index2];
      setMatchedCards(newMatchedCards);
      setFlippedCards([]);

      if (newMatchedCards.length === cards.length) {
        setTimeout(() => {
          setGameState('end');
          addGameResult(score, difficulty);  
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('memoryGameHighScore', score);
          }
        }, 500);
      }
    } else {
      const newCards = [...cards];
      newCards[index1].isFlipped = false;
      newCards[index2].isFlipped = false;
      setCards(newCards);
      setFlippedCards([]);
      
      const newScore = Math.max(0, score - 5);
      setScore(newScore);
      
      if (newScore <= 0) {
        setTimeout(() => {
          setGameState('end');
          addGameResult(newScore, difficulty); 
        }, 2000);
      }
    }
  };

  // Restart game
  const handleRestart = () => {
    initializeGame(difficulty);
    setGameState('playing');
  };

  // Reset 
  const handleResetHighScore = () => {
    setHighScore(0);
    localStorage.setItem('memoryGameHighScore', 0);
  };

  const handleBackToActivities = () => {
    if (navigateTo) {
      navigateTo('activities');
    }
  };

  const handleBackToGameStart = () => {
    setGameState('start');
    setIsGameStarted(false);
  };

  // Render start page
  const renderStartPage = () => (
    <div className="memory-game start-page">
      <button 
        className="back-to-activities-btn"
        onClick={handleBackToActivities}
      >
        {lang === 'en' ? 'Back to Activities' : 'العودة للأنشطة'}
      </button>
      
      <h1 className="game-title">
        {lang === 'en' ? 'Memory Game' : 'لعبة الذاكرة'}
      </h1>
      <div className="difficulties">
        <button 
          className={`diff-btn ${difficulty === 'easy' ? 'selected' : ''}`}
          onClick={() => handleDifficultyChange('easy')}
        >
          {lang === 'en' ? 'Easy' : 'سهل'}
        </button>
        <button 
          className={`diff-btn ${difficulty === 'medium' ? 'selected' : ''}`}
          onClick={() => handleDifficultyChange('medium')}
        >
          {lang === 'en' ? 'Medium' : 'متوسط'}
        </button>
        <button 
          className={`diff-btn ${difficulty === 'hard' ? 'selected' : ''}`}
          onClick={() => handleDifficultyChange('hard')}
        >
          {lang === 'en' ? 'Hard' : 'صعب'}
        </button>
      </div>
      <button className="main-btn start-btn" onClick={handleStartGame}>
        {lang === 'en' ? 'Start' : 'ابدأ'}
      </button>
      <div className="score-display">
        {lang === 'en' ? 'High Score' : 'أعلى نتيجة'} <span>{highScore}</span>
      </div>
      <button className="reset-btn" onClick={handleResetHighScore}>
        {lang === 'en' ? 'Reset' : 'إعادة تعيين'}
      </button>
    </div>
  );

// Render game page
const renderGamePage = () => {
  let gridTemplateColumns = '';
  let gridTemplateRows = '';
  
  if (difficulty === 'easy') {
    gridTemplateColumns = 'repeat(6, 1fr)';
    gridTemplateRows = 'repeat(2, 1fr)';
  } else if (difficulty === 'medium') {
    gridTemplateColumns = 'repeat(8, 1fr)';
    gridTemplateRows = 'repeat(2, 1fr)';
  } else { 
    gridTemplateColumns = 'repeat(8, 1fr)';
    gridTemplateRows = 'repeat(3, 1fr)';
  }

  return (
    <div className="memory-game game-page">
      <div className="top-bar">
        <div className="current-score">
          {lang === 'en' ? 'Score:' : 'النتيجة:'} <span>{score}</span>
        </div>
        <div className="game-buttons">
          <button className="icon-btn restart-btn" onClick={handleRestart}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
          <button className="icon-btn back-btn" onClick={handleBackToGameStart}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
      <h1 className="game-title">
        {lang === 'en' ? 'Memory Game' : 'لعبة الذاكرة'}
      </h1>
      <div 
        className="cards-grid" 
        style={{
          gridTemplateColumns: gridTemplateColumns,
          gridTemplateRows: gridTemplateRows
        }}
      >
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`game-card ${card.isFlipped || card.isMatched || showAllCards ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{
              animation: `cardRise 0.5s ease-out ${index * 0.05}s forwards`,
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            <div className="card-inner">
              <div className="card-front">
                <img src={card.imgPath} alt={`card-${card.value}`} />
              </div>
              <div className="card-back">
                <img src={cardBack} alt="card-back" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  // Render end page
  const renderEndPage = () => (
    <div className="memory-game end-page">
      
      <h1 className="game-title">
        {lang === 'en' ? 'Game Over!' : 'انتهت اللعبة!'}
      </h1>
      <p className="score-display">
        {lang === 'en' ? 'Your Score:' : 'نتيجتك:'} <span>{score}</span>
      </p>
      <p className="score-display">
        {lang === 'en' ? 'High Score:' : 'أعلى نتيجة:'} <span>{highScore}</span>
      </p>
      <button className="main-btn restart-btn" onClick={handleRestart}>
        {lang === 'en' ? 'Play Again' : 'العب مرة أخرى'}
      </button>
      <button className="main-btn exit-btn" onClick={handleBackToGameStart}>
        <i className="bi bi-box-arrow-right me-2"></i>
        {lang === 'en' ? 'Exit' : 'خروج'}
      </button>
    </div>
  );

  return (
    <div className="memory-game-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {gameState === 'start' && renderStartPage()}
      {gameState === 'playing' && renderGamePage()}
      {gameState === 'end' && renderEndPage()}
    </div>
  );
};

export default MemoryGame;