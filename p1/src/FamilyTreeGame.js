import React, { useState, useEffect } from "react";

export default function FamilyTreeGame({ lang, navigateTo }) {
  const familyMembers = [
    { id: 1, name: "Grandfather", nameAr: "الجد", image: "https://cdn-icons-png.flaticon.com/128/1320/1320735.png", position: "grandfather" },
    { id: 2, name: "Grandmother", nameAr: "الجدة", image: "https://cdn-icons-png.flaticon.com/128/3554/3554003.png", position: "grandmother" },
    { id: 3, name: "Father", nameAr: "الأب", image: "https://cdn-icons-png.flaticon.com/128/4530/4530507.png", position: "father" },
    { id: 4, name: "Mother", nameAr: "الأم", image: "https://cdn-icons-png.flaticon.com/128/4829/4829642.png", position: "mother" },
    { id: 5, name: "Son", nameAr: "الابن", image: "https://cdn-icons-png.flaticon.com/128/2829/2829768.png", position: "son" },
    { id: 6, name: "Daughter", nameAr: "الابنة", image: "https://cdn-icons-png.flaticon.com/128/2829/2829841.png", position: "daughter" },
  ];

  const [shuffledImages, setShuffledImages] = useState([]);
  const [userPlacements, setUserPlacements] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [gameChecked, setGameChecked] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState({});
  
  // cscore
  const [gameScores, setGameScores] = useState([]); 
  const [currentRoundScore, setCurrentRoundScore] = useState(0);

  useEffect(() => {
    const shuffled = [...familyMembers].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  useEffect(() => {
    if (gameChecked) {
      const newFeedback = {};
      let correctCount = 0;
      
      familyMembers.forEach(member => {
        const userChoice = userPlacements[member.position];
        if (userChoice && userChoice.position === member.position) {
          correctCount++;
          newFeedback[member.position] = 'correct';
        } else {
          newFeedback[member.position] = 'wrong';
        }
      });
      
      const roundScore = (correctCount / familyMembers.length) * 100;
      setCurrentRoundScore(roundScore);
      setFeedback(newFeedback);
      setShowResults(true);
      
      setGameScores(prev => [...prev, roundScore]);
    }
  }, [gameChecked]);

  const getAverageScore = () => {
    if (gameScores.length === 0) return 0;
    const total = gameScores.reduce((sum, score) => sum + score, 0);
    return (total / gameScores.length).toFixed(1);
  };

  const getMemoryAssessment = () => {
    const avg = parseFloat(getAverageScore());
    
    if (avg >= 80) {
      return {
        text: lang === "en" ? "Excellent Memory! 🎉" : "ذاكرة ممتازة! 🎉",
        subtext: lang === "en" ? "Your memory is improving greatly!" : "ذاكرتك تتحسن بشكل رائع!",
        color: "#28a745",
        icon: "bi-trophy-fill"
      };
    } else if (avg >= 50) {
      return {
        text: lang === "en" ? "Good Progress! " : "تقدم جيد! ",
        subtext: lang === "en" ? "Keep playing to improve more!" : "استمر في اللعب للتحسن أكثر!",
        color: "#ffc107",
        icon: "bi-award-fill"
      };
    } else {
      return {
        text: lang === "en" ? "Keep Practicing! " : "استمر في التدريب! ",
        subtext: lang === "en" ? "Don't give up, try again!" : "لا تستسلم، حاول مرة أخرى!",
        color: "#dc3545",
        icon: "bi-heart-fill"
      };
    }
  };

  const handleImageSelect = (member) => {
    if (gameChecked) return;
    if (Object.values(userPlacements).some(p => p?.id === member.id)) return;
    setSelectedImage(member);
  };

  const handlePlaceMember = (position) => {
    if (gameChecked) return;
    if (!selectedImage) return;
    
    setUserPlacements(prev => ({
      ...prev,
      [position]: selectedImage
    }));
    setSelectedImage(null);
  };

  const handleRemoveFromBranch = (position) => {
    if (gameChecked) return;
    setUserPlacements(prev => {
      const newPlacements = { ...prev };
      delete newPlacements[position];
      return newPlacements;
    });
  };

  const handleCheckAnswers = () => {
    const placedCount = Object.keys(userPlacements).length;
    if (placedCount < familyMembers.length) {
      alert(lang === "en" 
        ? `Please place all ${familyMembers.length} family members first!` 
        : `الرجاء وضع جميع أفراد العائلة (${familyMembers.length}) أولاً!`);
      return;
    }
    setGameChecked(true);
  };

  const resetGame = () => {
    const shuffled = [...familyMembers].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setUserPlacements({});
    setSelectedImage(null);
    setGameChecked(false);
    setShowResults(false);
    setFeedback({});
  };

  const resetCumulativeScore = () => {
    if (window.confirm(lang === "en" 
      ? "Reset all cumulative scores?" 
      : "إعادة تعيين جميع النتائج التراكمية؟")) {
      setGameScores([]);
    }
  };

  const getCorrectCount = () => {
    return familyMembers.filter(member => {
      const userChoice = userPlacements[member.position];
      return userChoice && userChoice.position === member.position;
    }).length;
  };

  const assessment = getMemoryAssessment();
  const averageScore = getAverageScore();

  const getMemberName = (member) => lang === "en" ? member.name : member.nameAr;
  const getTitle = () => lang === "en" ? "Family Tree Memory Game" : "لعبة شجرة العائلة للذاكرة";
  const getInstruction = () => lang === "en" 
    ? "Place each family member in their correct position on the tree, then click Check Answers" 
    : "ضع كل فرد من العائلة في مكانه الصحيح على الشجرة، ثم اضغط على التحقق من الإجابات";

  return (
    <div className="family-tree-game" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="game-header">
        <button className="back-btn" onClick={() => navigateTo("home")}>
          <i className="bi bi-arrow-left"></i>
          {lang === "en" ? "Back" : "رجوع"}
        </button>
        <h1>{getTitle()}</h1>
        <div className="game-stats">
          <span className="stat" title={lang === "en" ? "Cumulative Average" : "المتوسط التراكمي"}>
            <i className="bi bi-graph-up"></i> {averageScore}%
          </span>
          <span className="stat" title={lang === "en" ? "Rounds Played" : "عدد الجولات"}>
            <i className="bi bi-controller"></i> {gameScores.length}
          </span>
        </div>
      </div>

      {showResults && (
        <div className="completion-message">
          <div className="completion-content">
            <i className={`bi ${assessment.icon}`} style={{ color: assessment.color, fontSize: '5rem', marginBottom: '1rem' }}></i>
            <h2 style={{ color: assessment.color }}>{assessment.text}</h2>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '15px', 
              margin: '1rem 0',
              width: '100%'
            }}>
              <p style={{ fontSize: '1.2rem', color: '#666', margin: '0.5rem 0' }}>
                {lang === "en" ? "Current Round Score:" : "نتيجة الجولة الحالية:"}
              </p>
              <p style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: currentRoundScore >= 80 ? '#28a745' : currentRoundScore >= 50 ? '#ffc107' : '#dc3545',
                margin: '0.5rem 0'
              }}>
                {currentRoundScore.toFixed(1)}%
              </p>
              
              <div style={{ 
                height: '2px', 
                background: '#dee2e6', 
                margin: '1rem 0' 
              }}></div>
              
              <p style={{ fontSize: '1.2rem', color: '#666', margin: '0.5rem 0' }}>
                {lang === "en" ? "Cumulative Average:" : "المتوسط التراكمي:"}
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: assessment.color,
                margin: '0.5rem 0'
              }}>
                {averageScore}%
              </p>
              <p style={{ fontSize: '0.9rem', color: '#999', margin: '0.5rem 0' }}>
                {lang === "en" ? `Based on ${gameScores.length} round${gameScores.length !== 1 ? 's' : ''}` : `بناءً على ${gameScores.length} جولة`}
              </p>
            </div>
            
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#495057',
              fontWeight: '600',
              margin: '1rem 0'
            }}>
              {assessment.subtext}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="play-again-btn" onClick={resetGame}>
                <i className="bi bi-arrow-repeat"></i>
                {lang === "en" ? "Play Again" : "العب مرة أخرى"}
              </button>
              {gameScores.length > 0 && (
                <button 
                  className="reset-btn" 
                  onClick={resetCumulativeScore}
                  style={{ background: '#6c757d', color: 'white' }}
                >
                  <i className="bi bi-trash"></i>
                  {lang === "en" ? "Reset Scores" : "إعادة النتائج"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="game-instructions">
        <i className="bi bi-info-circle"></i>
        <p>{getInstruction()}</p>
      </div>

      <div className="images-container">
        <h3>{lang === "en" ? "Family Members" : "أفراد العائلة"}</h3>
        <div className="images-row">
          {shuffledImages.map((member) => {
            const isPlaced = Object.values(userPlacements).some(p => p?.id === member.id);
            return (
              <div
                key={member.id}
                className={`image-card ${selectedImage?.id === member.id ? 'selected' : ''} ${isPlaced ? 'placed' : ''}`}
                onClick={() => handleImageSelect(member)}
                style={{ 
                  opacity: isPlaced ? 0.3 : 1,
                  cursor: gameChecked || isPlaced ? 'default' : 'pointer'
                }}
              >
                <img src={member.image} alt={getMemberName(member)} />
                <p>{getMemberName(member)}</p>
                {isPlaced && (
                  <div className="placed-indicator">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="tree-container">
        <h3>{lang === "en" ? "Family Tree" : "شجرة العائلة"}</h3>
        <div className="family-tree">

          <div className="tree-level level-1">
            {['grandfather', 'grandmother'].map(position => {
              const member = familyMembers.find(m => m.position === position);
              const placedMember = userPlacements[position];
              const isCorrect = gameChecked && placedMember?.position === position;
              const isWrong = gameChecked && placedMember && placedMember.position !== position;
              
              return (
                <div 
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && placedMember && handleRemoveFromBranch(position)}
                  title={gameChecked ? (isCorrect ? "✓ Correct!" : isWrong ? "✗ Wrong!" : "") : ""}
                >
                  <div className="branch-label">{lang === "en" ? member.name : member.nameAr}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={getMemberName(placedMember)} />
                      {gameChecked && (
                        <div className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                          <i className={`bi ${isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-slot">
                      <i className="bi bi-person-plus"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="tree-lines">
            <div className="vertical-line"></div>
            <div className="horizontal-line"></div>
            <div className="vertical-line"></div>
          </div>

          <div className="tree-level level-2">
            {['father', 'mother'].map(position => {
              const member = familyMembers.find(m => m.position === position);
              const placedMember = userPlacements[position];
              const isCorrect = gameChecked && placedMember?.position === position;
              const isWrong = gameChecked && placedMember && placedMember.position !== position;
              
              return (
                <div 
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && placedMember && handleRemoveFromBranch(position)}
                  title={gameChecked ? (isCorrect ? "✓ Correct!" : isWrong ? "✗ Wrong!" : "") : ""}
                >
                  <div className="branch-label">{lang === "en" ? member.name : member.nameAr}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={getMemberName(placedMember)} />
                      {gameChecked && (
                        <div className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                          <i className={`bi ${isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-slot">
                      <i className="bi bi-person-plus"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="tree-lines">
            <div className="vertical-line"></div>
            <div className="horizontal-line"></div>
            <div className="vertical-line"></div>
          </div>

          <div className="tree-level level-3">
            {['son', 'daughter'].map(position => {
              const member = familyMembers.find(m => m.position === position);
              const placedMember = userPlacements[position];
              const isCorrect = gameChecked && placedMember?.position === position;
              const isWrong = gameChecked && placedMember && placedMember.position !== position;
              
              return (
                <div 
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && placedMember && handleRemoveFromBranch(position)}
                  title={gameChecked ? (isCorrect ? "✓ Correct!" : isWrong ? "✗ Wrong!" : "") : ""}
                >
                  <div className="branch-label">{lang === "en" ? member.name : member.nameAr}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={getMemberName(placedMember)} />
                      {gameChecked && (
                        <div className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                          <i className={`bi ${isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-slot">
                      <i className="bi bi-person-plus"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="game-controls">
        {!gameChecked ? (
          <>
            <button 
              className="check-btn" 
              onClick={handleCheckAnswers}
              disabled={Object.keys(userPlacements).length < familyMembers.length}
            >
              <i className="bi bi-check2-all"></i>
              {lang === "en" ? "Check Answers" : "التحقق من الإجابات"}
            </button>
            <button className="reset-btn" onClick={resetGame}>
              <i className="bi bi-arrow-clockwise"></i>
              {lang === "en" ? "Reset" : "إعادة"}
            </button>
          </>
        ) : (
          <button className="play-again-btn" onClick={resetGame}>
            <i className="bi bi-arrow-repeat"></i>
            {lang === "en" ? "Play Again" : "العب مرة أخرى"}
          </button>
        )}
      </div>

      {!gameChecked && Object.keys(userPlacements).length > 0 && (
        <div className="hint-text">
          <i className="bi bi-lightbulb"></i>
          {lang === "en" 
            ? "Tip: Double-click on a branch to remove the image" 
            : "نصيحة: انقر نقرًا مزدوجًا على الفرع لإزالة الصورة"}
        </div>
      )}
    </div>
  );
}