"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skull, Crown, Users, Trophy, Volume2, VolumeX } from "lucide-react"

export default function LuckyDrawPage() {
  const [ids, setIds] = useState<string[]>([
    "gilbert.k",
    "allen.k1m",
    "bill.23",
    "colton.kim",
    "davi.d",
    "eve.y2k",
    "grimm.lee",
    "kevin.12",
    "mjet.plane",
    "ravi.lb",
    "shore.crab",
    "tate.yun",
    "vaughn.k",
    "voy.moon",
    "yell.ow",
  ])
  const [newId, setNewId] = useState("")
  const [winner, setWinner] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [winners, setWinners] = useState<string[]>([])
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    audioContextRef.current = new AudioContext()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playTickSound = () => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = "square"
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }

  const playWinSound = () => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const playNote = (freq: number, time: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.1, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration)
      osc.start(time)
      osc.stop(time + duration)
    }

    // Dramatic minor chord arpeggio
    playNote(440.0, now, 0.2) // A4
    playNote(523.25, now + 0.1, 0.2) // C5
    playNote(659.25, now + 0.2, 0.2) // E5
    playNote(880.0, now + 0.3, 0.8) // A5
  }

  const addId = () => {
    if (newId.trim() && !ids.includes(newId.trim())) {
      setIds([...ids, newId.trim()])
      setNewId("")
    }
  }

  const removeId = (id: string) => {
    setIds(ids.filter((i) => i !== id))
    if (winner === id) setWinner(null)
    setWinners(winners.filter((w) => w !== id))
    setActiveIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const toggleActive = (id: string) => {
    setActiveIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const startDraw = () => {
    // 활성화된 참가자 중 아직 당첨되지 않은 사람만 추첨 대상
    const drawCandidates = ids.filter((id) => activeIds.has(id) && !winners.includes(id))

    if (drawCandidates.length === 0) {
      alert("추첨 가능한 활성화된 참가자가 없습니다!")
      return
    }

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume()
    }

    setIsSpinning(true)
    setWinner(null)
    setCurrentIndex(0)

    const duration = 6000
    const startTime = Date.now()
    let animationFrame: number
    let lastIndex = -1

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const totalSpins = 30
        const currentPos = Math.floor(easeOut * totalSpins)
        const newIndex = currentPos % drawCandidates.length

        if (newIndex !== lastIndex) {
          playTickSound()
          lastIndex = newIndex
        }

        setCurrentIndex(newIndex)
        animationFrame = requestAnimationFrame(animate)
      } else {
        const winnerIndex = Math.floor(Math.random() * drawCandidates.length)
        const selectedWinner = drawCandidates[winnerIndex]
        setCurrentIndex(winnerIndex)
        setWinner(selectedWinner)
        setWinners([...winners, selectedWinner])
        setIds((prev) => prev.filter((id) => id !== selectedWinner)) // 당첨자를 참가자 목록에서 제거
        setIsSpinning(false)
        setActiveIds(new Set()) // 추첨 후 모든 참가자 비활성화
        setShowWinnerModal(true) // 당첨자 모달 표시
        playWinSound() // Play win sound
      }
    }

    animationFrame = requestAnimationFrame(animate)
  }

  // 추첨 대상: 활성화 + 미당첨
  const drawCandidates = ids.filter((id) => activeIds.has(id) && !winners.includes(id))

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background py-12 px-4">
      {/* Winner Modal */}
      {showWinnerModal && winner && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowWinnerModal(false)}
        >
          <div className="text-center space-y-8 animate-in zoom-in-50 duration-500">
            <div className="flex items-center justify-center gap-4">
              <Crown className="w-16 h-16 text-destructive animate-bounce" />
              <Crown className="w-16 h-16 text-destructive animate-bounce" />
            </div>
            <div className="text-[8rem] md:text-[12rem] font-bold text-destructive drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse">
              {winner}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white">
              🎉 당첨을 축하합니다! 🎉
            </div>
            <div className="text-xl text-muted-foreground mt-8">
              (클릭하여 닫기)
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-destructive/20 to-transparent pointer-events-none" />

      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Skull className="w-12 h-12 text-destructive animate-pulse" />
            <h1 className="text-5xl font-bold text-balance bg-clip-text text-transparent bg-gradient-to-r from-destructive via-foreground to-destructive">
              2025 MATRIX Lucky Draw
            </h1>
            <Crown className="w-12 h-12 text-destructive animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground text-balance">어둠 속에서 한 명의 당첨자가 선택됩니다...</p>
        </div>

        <Card className="p-8 border-2 border-destructive/30 bg-card/90 backdrop-blur shadow-2xl shadow-destructive/20">
          <div className="space-y-8">
            {/* Roulette Display */}
            <div
              className={`relative overflow-hidden rounded-xl border-4 transition-all duration-500 ${
                isSpinning
                  ? "border-destructive shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                  : winner
                    ? "border-destructive shadow-[0_0_80px_rgba(220,38,38,0.8)]"
                    : "border-destructive/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              }`}
            >
              <div className="bg-gradient-to-br from-background to-destructive/5 min-h-[300px] flex items-center justify-center p-8">
                {drawCandidates.length > 0 || isSpinning ? (
                  <div className="text-center space-y-4 w-full">
                    <div
                      className={`text-6xl md:text-8xl font-bold transition-all duration-200 ${
                        isSpinning
                          ? "text-foreground animate-pulse"
                          : winner
                            ? "text-destructive scale-110"
                            : "text-foreground/50"
                      }`}
                    >
                      {isSpinning ? drawCandidates[currentIndex] : winner || "???"}
                    </div>
                    {isSpinning && <div className="text-sm text-muted-foreground animate-pulse">추첨 중...</div>}
                  </div>
                ) : (
                  <div className="text-2xl text-muted-foreground text-center">
                    {ids.length === 0 ? "참가자를 추가해주세요" : activeIds.size === 0 ? "참가자를 활성화해주세요" : "모든 활성 참가자가 당첨되었습니다!"}
                  </div>
                )}
              </div>

              {/* Decorative side markers */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-24 bg-destructive/50 rounded-r" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-24 bg-destructive/50 rounded-l" />
            </div>

            {/* Winner announcement */}
            {winner && !isSpinning && (
              <div className="text-center space-y-2 animate-fadeIn">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-destructive animate-bounce" />
                  <span className="text-2xl font-bold text-destructive">당첨을 축하합니다!</span>
                  <Crown className="w-6 h-6 text-destructive animate-bounce" />
                </div>
              </div>
            )}

            {/* Draw button */}
            <div className="flex justify-center">
              <Button
                onClick={startDraw}
                disabled={isSpinning || drawCandidates.length === 0}
                size="lg"
                className="text-lg px-12 py-6 bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none"
              >
                {isSpinning ? (
                  <>
                    <Skull className="w-5 h-5 mr-2 animate-spin" />
                    추첨 중...
                  </>
                ) : (
                  <>
                    <Skull className="w-5 h-5 mr-2" />
                    추첨 시작
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {winners.length > 0 && (
          <Card className="p-6 bg-card/90 backdrop-blur border-destructive/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold">당첨자 기록</h2>
                <span className="ml-auto text-sm text-muted-foreground">{winners.length}명 당첨</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {winners.map((winnerId, index) => (
                  <div
                    key={`${winnerId}-${index}`}
                    className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg border bg-destructive/20 border-destructive text-destructive font-semibold shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    <Crown className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate flex-1">{winnerId}</span>
                    <span className="text-xs opacity-70 flex-shrink-0">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ID Management */}
        <Card className="p-6 bg-card/90 backdrop-blur border-destructive/30">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-semibold">참가자 관리</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                총 {ids.length}명 (활성: {activeIds.size}명, 추첨 가능: {drawCandidates.length}명)
              </span>
            </div>

            {/* Add ID */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="newId" className="sr-only">
                  새 ID 추가
                </Label>
                <Input
                  id="newId"
                  placeholder="새 ID 입력"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addId()}
                  className="h-12 border-destructive/30 focus:border-destructive"
                />
              </div>
              <Button
                onClick={addId}
                disabled={!newId.trim()}
                className="h-12 px-8 bg-destructive hover:bg-destructive/90 text-white"
              >
                추가
              </Button>
            </div>

            {/* ID List */}
            {ids.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ids.map((id) => {
                  const isWinner = winners.includes(id)
                  const isActive = activeIds.has(id)
                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border transition-all ${
                        isWinner
                          ? "bg-destructive/20 border-destructive text-destructive font-semibold shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                          : isActive
                            ? "bg-primary/20 border-primary text-foreground shadow-[0_0_10px_rgba(100,100,255,0.3)]"
                            : "bg-accent/30 border-border text-muted-foreground opacity-50"
                      }`}
                    >
                      {isWinner && <Crown className="w-4 h-4 flex-shrink-0" />}
                      <button
                        onClick={() => !isWinner && toggleActive(id)}
                        disabled={isWinner}
                        className={`text-sm truncate flex-1 text-left ${!isWinner ? "cursor-pointer hover:underline" : "cursor-default"}`}
                        aria-label={`${id} ${isActive ? "비활성화" : "활성화"}`}
                      >
                        {id}
                      </button>
                      <button
                        onClick={() => removeId(id)}
                        className="text-destructive hover:text-destructive/80 text-xl leading-none transition-transform hover:scale-125"
                        aria-label={`${id} 삭제`}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">참가자를 추가해주세요</div>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
