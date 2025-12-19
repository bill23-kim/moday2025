"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Minus } from "lucide-react"
import { quizzes, type Quiz } from "@/data/quizzes"

const shuffleArray = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

type Team = {
  id: number
  name: string
  score: number
}

export default function QuizBoard() {
  const [gameStarted, setGameStarted] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeamName, setNewTeamName] = useState("")

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [displayedQuestion, setDisplayedQuestion] = useState("")
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set())

  const isPausedRef = useRef(false)
  const [isPausedDisplay, setIsPausedDisplay] = useState(false)
  const currentIndexRef = useRef(0)

  const [quizData, setQuizData] = useState<Quiz[]>([])

  useEffect(() => {
    setQuizData(quizzes)
  }, [])

  const playFallbackSound = (type: "click" | "typing") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return

      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === "click") {
        osc.type = "sine"
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.1)
      } else {
        // Typing sound - short crisp tick
        osc.type = "triangle"
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.05)
      }
    } catch (e) {
      console.error("Fallback audio failed", e)
    }
  }

  const playSound = (type: "click" | "typing") => {
    const audio = new Audio(type === "click" ? "/sounds/click-v2.mp3" : "/sounds/type-v2.mp3")
    audio.volume = 0.5
    audio.play().catch((e) => {
      console.log(`[v0] ${type} sound play failed, using fallback:`, e)
      playFallbackSound(type)
    })
  }

  const addTeam = () => {
    if (newTeamName.trim()) {
      playSound("click")
      setTeams([...teams, { id: Date.now(), name: newTeamName.trim(), score: 0 }])
      setNewTeamName("")
    }
  }

  const removeTeam = (id: number) => {
    playSound("click")
    setTeams(teams.filter((team) => team.id !== id))
  }

  const increaseScore = (id: number) => {
    playSound("click")
    setTeams(teams.map((team) => (team.id === id ? { ...team, score: team.score + 10 } : team)))
  }

  const decreaseScore = (id: number) => {
    playSound("click")
    setTeams(teams.map((team) => (team.id === id ? { ...team, score: Math.max(0, team.score - 10) } : team)))
  }

  const startGame = () => {
    if (teams.length > 0) {
      playSound("click")
      setGameStarted(true)
    }
  }

  const handleCardClick = (quiz: Quiz) => {
    playSound("click")
    setSelectedQuiz(quiz)
    setDisplayedQuestion("")
    setIsOpen(true)
    isPausedRef.current = false
    setIsPausedDisplay(false)
    currentIndexRef.current = 0
  }

  useEffect(() => {
    if (!selectedQuiz || !isOpen) return

    const question = selectedQuiz.question

    const interval = setInterval(() => {
      if (!isPausedRef.current && currentIndexRef.current < question.length) {
        currentIndexRef.current++
        setDisplayedQuestion(question.slice(0, currentIndexRef.current))

        playSound("typing")
      } else if (currentIndexRef.current >= question.length) {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [selectedQuiz, isOpen])

  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      if (e.code === "Space" && isOpen) {
        e.preventDefault()
        isPausedRef.current = !isPausedRef.current
        setIsPausedDisplay(isPausedRef.current)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen])

  const handleComplete = () => {
    if (selectedQuiz) {
      setCompletedQuizzes(new Set([...completedQuizzes, selectedQuiz.id]))
    }
    setIsOpen(false)
    setTimeout(() => {
      setSelectedQuiz(null)
      setDisplayedQuestion("")
    }, 200)
  }

  const handleTeamSelect = (teamId: number) => {
    playSound("click")
    if (selectedQuiz) {
      setTeams(teams.map((team) => (team.id === teamId ? { ...team, score: team.score + selectedQuiz.points } : team)))
      setCompletedQuizzes(new Set([...completedQuizzes, selectedQuiz.id]))
    }
    setIsOpen(false)
    setTimeout(() => {
      setSelectedQuiz(null)
      setDisplayedQuestion("")
    }, 200)
  }

  const handleNoWinner = () => {
    playSound("click")
    if (selectedQuiz) {
      setCompletedQuizzes(new Set([...completedQuizzes, selectedQuiz.id]))
    }
    setIsOpen(false)
    setTimeout(() => {
      setSelectedQuiz(null)
      setDisplayedQuestion("")
    }, 200)
  }

  const getFontSize = (text: string) => {
    const length = text.length
    if (length < 20) return "text-5xl md:text-6xl lg:text-7xl"
    if (length < 50) return "text-4xl md:text-5xl lg:text-6xl"
    if (length < 100) return "text-3xl md:text-4xl lg:text-5xl"
    return "text-2xl md:text-3xl lg:text-4xl"
  }

  if (!gameStarted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-xl border-2 border-border bg-card p-8 shadow-lg">
            <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-foreground">
              2025 모니터링기술 장학퀴즈
            </h1>
            <p className="mb-8 text-center text-lg text-muted-foreground">참가 팀을 등록하세요</p>

            <div className="mb-6 flex gap-2">
              <Input
                type="text"
                placeholder="팀 이름을 입력하세요"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTeam()}
                className="text-lg"
              />
              <Button onClick={addTeam} size="lg" className="shrink-0">
                <Plus className="mr-2 h-5 w-5" />
                추가
              </Button>
            </div>

            <div className="mb-8 space-y-2">
              {teams.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">등록된 팀이 없습니다</p>
              ) : (
                teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="text-lg font-semibold text-foreground">{team.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(team.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <Button onClick={startGame} disabled={teams.length === 0} size="lg" className="w-full text-lg">
              퀴즈 시작하기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">2025 모니터링기술 장학퀴즈</h1>
          <p className="mt-2 text-lg text-muted-foreground">카드를 선택하여 퀴즈에 도전하세요</p>
        </header>

        <div className="mb-8 rounded-xl border-2 border-border bg-card p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-foreground">점수 현황판</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted p-4"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground" title={team.name}>
                      {team.name}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => decreaseScore(team.id)} className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center text-2xl font-bold text-primary">{team.score}</span>
                  <Button variant="outline" size="icon" onClick={() => increaseScore(team.id)} className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 md:grid-cols-8 md:gap-4 lg:grid-cols-10">
          {quizData.map((quiz, index) => {
            const isCompleted = completedQuizzes.has(quiz.id)

            return (
              <Card
                key={quiz.id}
                className={`group relative aspect-square cursor-pointer overflow-hidden border-2 border-border bg-card transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-lg ${
                  isCompleted ? "opacity-40 grayscale" : ""
                }`}
                onClick={() => handleCardClick(quiz)}
              >
                <span className="absolute left-1 top-1 text-xs text-muted-foreground">{index + 1}</span>
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                  <span className="text-sm font-bold text-primary transition-colors md:text-base lg:text-lg">
                    {quiz.points === 50 && quiz.topic === "추리" ? "뺏 50점" : `${quiz.points}점`}
                  </span>
                  <p className="mt-1 text-base font-bold leading-tight text-card-foreground transition-colors group-hover:text-primary md:text-lg lg:text-xl">
                    {quiz.topic}
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[90vh] max-w-[95vw] flex-col md:max-w-7xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center justify-between text-4xl font-bold">
              <span className="text-primary">{selectedQuiz?.topic}</span>
              <span className="rounded-full bg-primary px-6 py-2 text-2xl text-primary-foreground">
                {selectedQuiz?.points === 50 && selectedQuiz?.topic === "추리"
                  ? "뺏 50점"
                  : `${selectedQuiz?.points}점`}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-6 py-4">
            <div className="flex flex-1 flex-col items-center justify-center overflow-hidden rounded-lg bg-muted p-10">
              <div className="w-full text-center">
                <h3 className="mb-6 text-base font-semibold uppercase tracking-wide text-muted-foreground">
                  문제 {isPausedDisplay && <span className="ml-2 text-primary">(일시정지 - Space로 계속)</span>}
                </h3>
                <p
                  className={`font-medium leading-relaxed text-foreground ${getFontSize(selectedQuiz?.question || "")}`}
                >
                  {displayedQuestion}
                  {displayedQuestion.length < (selectedQuiz?.question.length || 0) && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <h3 className="mb-2 text-lg font-semibold uppercase tracking-wide text-muted-foreground">
                정답을 맞춘 팀을 선택하세요
              </h3>
              <div className="flex flex-wrap gap-2">
                {teams.map((team) => (
                  <Button
                    key={team.id}
                    onClick={() => handleTeamSelect(team.id)}
                    size="lg"
                    variant="outline"
                    className="flex-1 text-xl font-semibold"
                  >
                    {team.name}
                  </Button>
                ))}
                <Button onClick={handleNoWinner} size="lg" variant="secondary" className="flex-1 text-xl font-semibold">
                  아무도 못맞힘
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
