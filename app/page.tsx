"use client";

import React, { useState, useEffect, CSSProperties, useMemo } from "react";

interface LottoHistory {
  numbers: number[];
  date: string;
  matchCount: number;
  bonusMatch: boolean;
  rank: string;
}

interface LottoPrize {
  [key: string]: number;
}

interface RankCounts {
  [key: string]: number;
}

const generateLottoNumbers = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 7) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
};

export default function Home() {
  const [lottoNumbers, setLottoNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<LottoHistory[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [bonusNumber, setBonusNumber] = useState<number>(0);
  const [blink, setBlink] = useState(false);
  const [lottoPrizes, setLottoPrizes] = useState<LottoPrize>({});
  const [highestRank, setHighestRank] = useState<string>("낙첨");
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const rankCounts = useMemo(() => {
    const counts: RankCounts = {
      "1등": 0,
      "2등": 0,
      "3등": 0,
      "4등": 0,
      "5등": 0,
      낙첨: 0,
    };
    history.forEach((item) => {
      counts[item.rank]++;
    });
    return counts;
  }, [history]);

  useEffect(() => {
    const numbers = generateLottoNumbers();
    setWinningNumbers(numbers.slice(0, 6));
    setBonusNumber(numbers[6]);
    fetchLottoPrizes();

    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchLottoPrizes = async () => {
    try {
      // 실제로는 로또 API나 웹 스크래핑을 통해 데이터를 가져와야 합니다.
      // 여기서는 예시 데이터를 사용합니다.
      const prizes: LottoPrize = {
        "1등": 2000000000,
        "2등": 50000000,
        "3등": 1500000,
        "4등": 50000,
        "5등": 5000,
      };
      setLottoPrizes(prizes);
    } catch (error) {
      console.error("Failed to fetch lotto prizes:", error);
    }
  };

  const handleGenerate = () => {
    const newNumbers = generateLottoNumbers().slice(0, 6);
    setLottoNumbers(newNumbers);

    const matchCount = newNumbers.filter((num) =>
      winningNumbers.includes(num)
    ).length;
    const bonusMatch = newNumbers.includes(bonusNumber);
    const rank = getRank(matchCount, bonusMatch);

    const newHistory: LottoHistory = {
      numbers: newNumbers,
      date: new Date().toLocaleString(),
      matchCount: matchCount,
      bonusMatch: bonusMatch,
      rank: rank,
    };

    setHistory((prevHistory) => {
      const updatedHistory = [newHistory, ...prevHistory];
      updateHighestRankAndProfit(updatedHistory);
      return updatedHistory;
    });
  };

  const updateHighestRankAndProfit = (updatedHistory: LottoHistory[]) => {
    const ranks = ["1등", "2등", "3등", "4등", "5등", "낙첨"];
    let highestRank = "낙첨";
    let totalWinnings = 0;

    updatedHistory.forEach((item) => {
      if (ranks.indexOf(item.rank) < ranks.indexOf(highestRank)) {
        highestRank = item.rank;
      }
      totalWinnings += lottoPrizes[item.rank] || 0;
    });

    setHighestRank(highestRank);
    setTotalProfit(totalWinnings - updatedHistory.length * 1000);
  };

  const getRank = (matchCount: number, bonusMatch: boolean): string => {
    switch (matchCount) {
      case 6:
        return "1등";
      case 5:
        return bonusMatch ? "2등" : "3등";
      case 4:
        return "4등";
      case 3:
        return "5등";
      default:
        return "낙첨";
    }
  };

  const mainStyle: CSSProperties = {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#000000",
    color: "#FFFFFF",
  };

  const titleStyle: CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
  };

  const buttonStyle: CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "#3B82F6",
    color: "white",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    marginBottom: "2rem",
    transition: "background-color 0.3s",
  };

  const numberContainerStyle: CSSProperties = {
    width: "100%",
    maxWidth: "28rem",
    marginBottom: "2rem",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
    textAlign: "center",
  };

  const numberWrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
  };

  const historyContainerStyle: CSSProperties = {
    width: "100%",
    maxWidth: "80rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
  };

  const historyItemStyle: CSSProperties = {
    width: "calc(20% - 1rem)",
    minWidth: "200px",
    marginBottom: "1rem",
    padding: "0.5rem",
    backgroundColor: "#333333",
    borderRadius: "0.25rem",
    boxShadow:
      "0 1px 3px rgba(255,255,255,0.12), 0 1px 2px rgba(255,255,255,0.24)",
    color: "white",
  };

  const rightSectionStyle: CSSProperties = {
    position: "fixed",
    right: "20px",
    top: "50px",
    padding: "1rem",
    backgroundColor: "#333333",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 10px rgba(255,255,255,0.1)",
    color: "white",
  };

  const getNumberStyle = (
    num: number,
    isMatching: boolean,
    isBonus: boolean
  ): CSSProperties => {
    const baseStyle: CSSProperties = {
      width: "3rem",
      height: "3rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.25rem",
      fontWeight: "bold",
      ...getBackgroundColor(num),
    };

    if (isMatching) {
      return {
        ...baseStyle,
        background: blink
          ? "radial-gradient(circle, #FFD700, #FFA500)"
          : getBackgroundColor(num).backgroundColor,
        transition: "background 0.5s ease",
      };
    }

    if (isBonus) {
      return {
        ...baseStyle,
        border: "2px solid #FF0000",
      };
    }

    return baseStyle;
  };

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>로또 번호 생성기</h1>
      <button
        onClick={handleGenerate}
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
      >
        번호 생성하기
      </button>
      {lottoNumbers.length > 0 && (
        <div style={numberContainerStyle}>
          <h2 style={subtitleStyle}>생성된 번호:</h2>
          <div style={numberWrapperStyle}>
            {lottoNumbers.map((num, index) => (
              <div
                key={index}
                style={getNumberStyle(
                  num,
                  winningNumbers.includes(num) || num === bonusNumber,
                  num === bonusNumber
                )}
              >
                {num}
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: "1rem",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            맞춘 개수:{" "}
            {lottoNumbers.filter((num) => winningNumbers.includes(num)).length}
            {lottoNumbers.includes(bonusNumber) && " (보너스 번호 포함)"}
          </p>
          <p
            style={{
              fontSize: "1rem",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            등수:{" "}
            {getRank(
              lottoNumbers.filter((num) => winningNumbers.includes(num)).length,
              lottoNumbers.includes(bonusNumber)
            )}
          </p>
        </div>
      )}
      <div style={numberContainerStyle}>
        <h2 style={subtitleStyle}>이번 회차 당첨 번호:</h2>
        <div style={numberWrapperStyle}>
          {winningNumbers.map((num, index) => (
            <div key={index} style={getNumberStyle(num, false, false)}>
              {num}
            </div>
          ))}
          <div style={getNumberStyle(bonusNumber, false, true)}>
            {bonusNumber}
          </div>
        </div>
      </div>
      <h2 style={subtitleStyle}>히스토리</h2>
      <div style={historyContainerStyle}>
        {history.map((item, index) => (
          <div key={index} style={historyItemStyle}>
            <p style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              {item.date}
            </p>
            <div style={{ ...numberWrapperStyle, gap: "0.5rem" }}>
              {item.numbers.map((num, idx) => (
                <div
                  key={idx}
                  style={{
                    ...getNumberStyle(
                      num,
                      winningNumbers.includes(num) || num === bonusNumber,
                      num === bonusNumber
                    ),
                    width: "1.5rem",
                    height: "1.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
              맞춘 개수: {item.matchCount}
              {item.bonusMatch ? " (보너스 번호 포함)" : ""}
            </p>
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
              등수: {item.rank}
            </p>
          </div>
        ))}
      </div>
      <div style={rightSectionStyle}>
        <h2 style={{ ...subtitleStyle, marginBottom: "1rem" }}>통계</h2>
        <p style={{ marginBottom: "0.5rem" }}>최고 당첨 등수: {highestRank}</p>
        <p>총 손익: {totalProfit.toLocaleString()}원</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          (총 {history.length}게임, {(history.length * 1000).toLocaleString()}원
          사용)
        </p>
        <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginTop: "1rem" }}>
          등수별 당첨 횟수:
        </h3>
        {Object.entries(rankCounts).map(([rank, count]) => (
          <p key={rank} style={{ fontSize: "0.8rem" }}>
            {rank}: {count}회
          </p>
        ))}
      </div>
    </main>
  );
}

const getBackgroundColor = (num: number): CSSProperties => {
  if (num <= 10) return { backgroundColor: "#FBBF24" };
  if (num <= 20) return { backgroundColor: "#60A5FA" };
  if (num <= 30) return { backgroundColor: "#F87171" };
  if (num <= 40) return { backgroundColor: "#9CA3AF" };
  return { backgroundColor: "#34D399" };
};
