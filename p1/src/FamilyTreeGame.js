
import React, { useState, useEffect } from "react";

export default function FamilyTreeGame({ lang, navigateTo, userType }) {
  const familyMembers = [
    { id: 1, name: "Grandfather", nameAr: "الجد", image: "https://cdn-icons-png.flaticon.com/128/1320/1320735.png", position: "grandfather" },
    { id: 2, name: "Grandmother", nameAr: "الجدة", image: "https://cdn-icons-png.flaticon.com/128/3554/3554003.png", position: "grandmother" },
    { id: 3, name: "Father", nameAr: "الأب", image: "https://cdn-icons-png.flaticon.com/128/4530/4530507.png", position: "father" },
    { id: 4, name: "Mother", nameAr: "الأم", image: "https://cdn-icons-png.flaticon.com/128/4829/4829642.png", position: "mother" },
    { id: 5, name: "Son", nameAr: "الابن", image: "https://cdn-icons-png.flaticon.com/128/2829/2829768.png", position: "son" },
    { id: 6, name: "Daughter", nameAr: "الابنة", image: "https://cdn-icons-png.flaticon.com/128/2829/2829841.png", position: "daughter" },
  ];

  // store data
  const [uploadedData, setUploadedData] = useState({});
  const [shuffledImages, setShuffledImages] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);
  const [userPlacements, setUserPlacements] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [gameChecked, setGameChecked] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [gameScores, setGameScores] = useState([]);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);

  // Load scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('familyTreeScores');
    if (savedScores) {
      setGameScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('familyTreeScores', JSON.stringify(gameScores));
  }, [gameScores]);

  useEffect(() => {
    resetShuffledImages();
  }, []);

  const resetShuffledImages = () => {
    const currentMembers = familyMembers.map(member => {
      const uploaded = uploadedData[member.position];
      return {
        ...member,
        image: uploaded?.imageUrl || member.image,
        customName: uploaded?.customName || (lang === "en" ? member.name : member.nameAr)
      };
    });
    const shuffled = [...currentMembers].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  };

  useEffect(() => {
    resetShuffledImages();
  }, [uploadedData, lang]);

  // result
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
    if (gameChecked || uploadMode) return;
    if (Object.values(userPlacements).some(p => p?.id === member.id)) return;
    setSelectedImage(member);
  };

  const handlePlaceMember = (position) => {
    if (gameChecked || uploadMode) return;
    if (!selectedImage) return;

    setUserPlacements(prev => ({
      ...prev,
      [position]: selectedImage
    }));
    setSelectedImage(null);
  };

  const handleRemoveFromBranch = (position) => {
    if (gameChecked || uploadMode) return;
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
    resetShuffledImages();
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

  // upload photo
  const toggleUploadMode = () => {
    if (gameChecked) {
      alert(lang === "en" ? "Please finish or reset the game first." : "الرجاء إنهاء اللعبة أو إعادة تعيينها أولاً.");
      return;
    }
    setUploadMode(!uploadMode);
  };

  const handleUploadImage = (position) => {
    if (!uploadMode) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setUploadedData(prev => ({
          ...prev,
          [position]: {
            imageUrl,
            customName: prev[position]?.customName || ''
          }
        }));
      }
    };
    input.click();
  };

  const handleCustomNameChange = (position, newName) => {
    setUploadedData(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        customName: newName
      }
    }));
  };

  const t = {
    en: {
      back: "Back",
      title: "Family Tree Memory Game",
      instruction: "Place each family member in their correct position on the tree, then click Check Answers",
      uploadModeInstruction: "Click on any family member image to replace it with your own photo. You can also edit the name below the image. When finished, click 'Exit Upload' to play.",
      uploadBtn: "Upload Photos",
      exitUploadBtn: "Exit Upload",
      checkAnswers: "Check Answers",
      reset: "Reset",
      playAgain: "Play Again",
      resetScores: "Reset Scores",
      familyMembers: "Family Members",
      familyTree: "Family Tree",
      tipDoubleClick: "Tip: Double-click on a branch to remove the image",
      cumulativeAverage: "Cumulative Average",
      roundsPlayed: "Rounds Played",
      namePlaceholder: "Enter name",
      patientResults: "Patient Results - Family Tree",
      averageScore: "Average Score",
      basedOn: "Based on",
      rounds: "rounds",
      lastRounds: "Last Rounds",
      round: "Round"
    },
    ar: {
      back: "رجوع",
      title: "لعبة شجرة العائلة",
      instruction: "ضع كل فرد في مكانه الصحيح على الشجرة، ثم اضغط تحقق",
      uploadModeInstruction: "انقر على أي صورة لاستبدالها بصورة من جهازك. يمكنك أيضاً تعديل الاسم أسفل الصورة. عند الانتهاء، اضغط 'خروج' للعب.",
      uploadBtn: "إضافة صور",
      exitUploadBtn: "خروج",
      checkAnswers: "تحقق",
      reset: "إعادة",
      playAgain: "العب مرة أخرى",
      resetScores: "إعادة النتائج",
      familyMembers: "أفراد العائلة",
      familyTree: "شجرة العائلة",
      tipDoubleClick: "نصيحة: انقر نقرًا مزدوجًا على الفرع للإزالة",
      cumulativeAverage: "المتوسط التراكمي",
      roundsPlayed: "عدد الجولات",
      namePlaceholder: "أدخل الاسم",
      patientResults: "نتائج المريض - شجرة العائلة",
      averageScore: "متوسط النتيجة",
      basedOn: "بناءً على",
      rounds: "جولات",
      lastRounds: "آخر الجولات",
      round: "جولة"
    }
  };

  const currentLang = lang === "en" ? t.en : t.ar;
  const assessment = getMemoryAssessment();
  const averageScore = getAverageScore();

  // If user is family show results page 
  if (userType === 'family') {
    return (
      <div className="family-tree-game" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="game-header">
          <button className="back-btn" onClick={() => navigateTo("activities")}>
            <i className="bi bi-arrow-left"></i>
            {currentLang.back}
          </button>
          <h1>{currentLang.patientResults}</h1>
        </div>

        <div className="results-container" style={{ padding: '2rem', background: 'white', borderRadius: '20px', margin: '2rem' }}>
          <div className="stats-summary" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>{currentLang.averageScore}</h2>
            <p style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: averageScore >= 80 ? '#28a745' : averageScore >= 50 ? '#ffc107' : '#dc3545'
            }}>
              {averageScore}%
            </p>
            <p>{currentLang.basedOn} {gameScores.length} {currentLang.rounds}</p>
          </div>

          <div className="scores-history">
            <h3>{currentLang.lastRounds}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {gameScores.slice().reverse().map((score, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 1rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <span>{currentLang.round} {gameScores.length - idx}</span>
                  <span style={{
                    fontWeight: 'bold',
                    color: score >= 80 ? '#28a745' : score >= 50 ? '#ffc107' : '#dc3545'
                  }}>
                    {score}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className="back-btn" onClick={() => navigateTo("activities")} style={{ marginTop: '2rem', width: '100%' }}>
            {lang === "en" ? "Back to Activities" : "العودة للأنشطة"}
          </button>
        </div>
      </div>
    );
  }

  // Patient view, game
  return (
    <div className="family-tree-game" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="game-header">
        <button className="back-btn" onClick={() => navigateTo("activities")}>
          <i className="bi bi-arrow-left"></i>
          {currentLang.back}
        </button>
        <h1>{currentLang.title}</h1>
        <div className="game-stats">
          <span className="stat" title={currentLang.cumulativeAverage}>
            <i className="bi bi-graph-up"></i> {averageScore}%
          </span>
          <span className="stat" title={currentLang.roundsPlayed}>
            <i className="bi bi-controller"></i> {gameScores.length}
          </span>
        </div>
      </div>

      {showResults && (
        <div className="completion-message">
          <div className="completion-content">
            <i className={`bi ${assessment.icon}`} style={{ color: assessment.color, fontSize: '5rem', marginBottom: '1rem' }}></i>
            <h2 style={{ color: assessment.color }}>{assessment.text}</h2>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '15px', margin: '1rem 0', width: '100%' }}>
              <p style={{ fontSize: '1.2rem', color: '#666', margin: '0.5rem 0' }}>
                {lang === "en" ? "Current Round Score:" : "نتيجة الجولة الحالية:"}
              </p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: currentRoundScore >= 80 ? '#28a745' : currentRoundScore >= 50 ? '#ffc107' : '#dc3545', margin: '0.5rem 0' }}>
                {currentRoundScore.toFixed(1)}%
              </p>
              <div style={{ height: '2px', background: '#dee2e6', margin: '1rem 0' }}></div>
              <p style={{ fontSize: '1.2rem', color: '#666', margin: '0.5rem 0' }}>
                {lang === "en" ? "Cumulative Average:" : "المتوسط التراكمي:"}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: assessment.color, margin: '0.5rem 0' }}>
                {averageScore}%
              </p>
              <p style={{ fontSize: '0.9rem', color: '#999', margin: '0.5rem 0' }}>
                {lang === "en" ? `Based on ${gameScores.length} round${gameScores.length !== 1 ? 's' : ''}` : `بناءً على ${gameScores.length} جولة`}
              </p>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#495057', fontWeight: '600', margin: '1rem 0' }}>
              {assessment.subtext}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="play-again-btn" onClick={resetGame}>
                <i className="bi bi-arrow-repeat"></i>
                {currentLang.playAgain}
              </button>
              {gameScores.length > 0 && (
                <button className="reset-btn" onClick={resetCumulativeScore} style={{ background: '#6c757d', color: 'white' }}>
                  <i className="bi bi-trash"></i>
                  {currentLang.resetScores}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="game-instructions">
        <i className="bi bi-info-circle"></i>
        <p>{uploadMode ? currentLang.uploadModeInstruction : currentLang.instruction}</p>
      </div>

      {/* Photo bar + edit name */}
      <div className="images-container">
        <div className="images-header">
          <h3>{currentLang.familyMembers}</h3>
          <button
            className={`upload-toggle-btn ${uploadMode ? 'exit' : ''}`}
            onClick={toggleUploadMode}
          >
            <i className={`bi ${uploadMode ? 'bi-x-circle' : 'bi-images'}`}></i>
            {uploadMode ? currentLang.exitUploadBtn : currentLang.uploadBtn}
          </button>
        </div>

        <div className="images-row">
          {shuffledImages.map((member) => {
            const isPlaced = Object.values(userPlacements).some(p => p?.id === member.id);
            const isUploadMode = uploadMode;
            const uploaded = uploadedData[member.position];
            const hasCustomImage = uploaded?.imageUrl;

            return (
              <div key={member.id} className="image-wrapper">
                <div
                  className={`image-card ${selectedImage?.id === member.id ? 'selected' : ''} ${isPlaced ? 'placed' : ''} ${isUploadMode && hasCustomImage ? 'has-custom' : ''}`}
                  onClick={() => {
                    if (isUploadMode) {
                      handleUploadImage(member.position);
                    } else {
                      handleImageSelect(member);
                    }
                  }}
                  style={{
                    opacity: isPlaced && !isUploadMode ? 0.3 : 1,
                    cursor: (gameChecked || (isPlaced && !isUploadMode)) ? 'default' : 'pointer'
                  }}
                >
                  <img src={member.image} alt={member.customName || member.name} />
                  <p>{member.customName || (lang === "en" ? member.name : member.nameAr)}</p>
                  {isPlaced && !isUploadMode && (
                    <div className="placed-indicator">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}
                  {isUploadMode && (
                    <div className="upload-overlay">
                      <i className="bi bi-camera-fill"></i>
                    </div>
                  )}
                </div>

                {isUploadMode && hasCustomImage && (
                  <input
                    type="text"
                    className="custom-name-input"
                    placeholder={currentLang.namePlaceholder}
                    value={uploaded.customName || ''}
                    onChange={(e) => handleCustomNameChange(member.position, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="tree-container">
        <h3>{currentLang.familyTree}</h3>
        <div className="family-tree">
          <div className="tree-level level-1">
            {['grandfather', 'grandmother'].map(position => {
              const member = familyMembers.find(m => m.position === position);
              const placedMember = userPlacements[position];
              const isCorrect = gameChecked && placedMember?.position === position;
              const isWrong = gameChecked && placedMember && placedMember.position !== position;
              const displayName = lang === "en" ? member.name : member.nameAr;

              return (
                <div
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && !uploadMode && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && !uploadMode && placedMember && handleRemoveFromBranch(position)}
                >
                  <div className="branch-label">{displayName}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={displayName} />
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
              const displayName = lang === "en" ? member.name : member.nameAr;

              return (
                <div
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && !uploadMode && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && !uploadMode && placedMember && handleRemoveFromBranch(position)}
                >
                  <div className="branch-label">{displayName}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={displayName} />
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
              const displayName = lang === "en" ? member.name : member.nameAr;

              return (
                <div
                  key={position}
                  className={`tree-branch ${placedMember ? 'filled' : ''} ${gameChecked ? (isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : '') : ''}`}
                  onClick={() => !gameChecked && !uploadMode && handlePlaceMember(position)}
                  onDoubleClick={() => !gameChecked && !uploadMode && placedMember && handleRemoveFromBranch(position)}
                >
                  <div className="branch-label">{displayName}</div>
                  {placedMember ? (
                    <>
                      <img src={placedMember.image} alt={displayName} />
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
              {currentLang.checkAnswers}
            </button>
            <button className="reset-btn" onClick={resetGame}>
              <i className="bi bi-arrow-clockwise"></i>
              {currentLang.reset}
            </button>
          </>
        ) : (
          <button className="play-again-btn" onClick={resetGame}>
            <i className="bi bi-arrow-repeat"></i>
            {currentLang.playAgain}
          </button>
        )}
      </div>

      {!gameChecked && !uploadMode && Object.keys(userPlacements).length > 0 && (
        <div className="hint-text">
          <i className="bi bi-lightbulb"></i>
          {currentLang.tipDoubleClick}
        </div>
      )}
    </div>
  );
}
