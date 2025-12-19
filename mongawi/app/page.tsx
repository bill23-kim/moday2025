"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"
import Image from "next/image"

const CANDIDATES = ["ravi.lb", "colton.kim", "yell.ow", "vaughn.k", "mjet.plane"]
const ANIMATION_DURATION = 10000 // 10 seconds

function ChairmanFrames({ winner, isCompact }: { winner: string | null; isCompact: boolean }) {
  return (
    <div
      className={`flex justify-center gap-6 md:gap-10 lg:gap-12 transition-all duration-700 ease-in-out ${
        isCompact ? "mb-4 scale-75 md:scale-80" : "mb-12 scale-100"
      }`}
    >
      {/* 1대 문개위원장 */}
      <div className="relative">
        <div
          className={`border-4 border-amber-600 bg-gradient-to-b from-amber-800 to-amber-900 shadow-xl rounded-sm overflow-hidden transition-all duration-700 ${
            isCompact ? "w-24 h-32 md:w-32 md:h-44" : "w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80"
          }`}
        >
          <div className="absolute inset-1 border border-amber-500/50" />
          <Image src="/images/1-e1-84-83-e1-85-a2.jpg" alt="1대 문개위원장" fill className="object-cover" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 px-3 py-1 text-sm md:text-base text-amber-100 font-semibold rounded shadow">
          1대
        </div>
      </div>

      {/* 2대 문개위원장 */}
      <div className="relative">
        <div
          className={`border-4 border-amber-600 bg-gradient-to-b from-amber-800 to-amber-900 shadow-xl rounded-sm overflow-hidden transition-all duration-700 ${
            isCompact ? "w-24 h-32 md:w-32 md:h-44" : "w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80"
          }`}
        >
          <div className="absolute inset-1 border border-amber-500/50" />
          <Image src="/images/2-e1-84-83-e1-85-a2.jpg" alt="2대 문개위원장" fill className="object-cover" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 px-3 py-1 text-sm md:text-base text-amber-100 font-semibold rounded shadow">
          2대
        </div>
      </div>

      {/* 3대 문개위원장 - 물음표 또는 당첨자 */}
      <div className="relative">
        <div
          className={`border-4 border-amber-600 bg-gradient-to-b from-amber-800 to-amber-900 shadow-xl rounded-sm overflow-hidden flex items-center justify-center transition-all duration-700 ${
            isCompact ? "w-24 h-32 md:w-32 md:h-44" : "w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80"
          }`}
        >
          <div className="absolute inset-1 border border-amber-500/50" />
          {winner ? (
            <div className="text-center p-2 z-10">
              <div
                className={`text-white font-bold break-all transition-all duration-700 ${
                  isCompact ? "text-sm" : "text-base md:text-lg lg:text-xl"
                }`}
              >
                {winner}
              </div>
            </div>
          ) : (
            <div
              className={`font-bold text-amber-300/80 z-10 transition-all duration-700 ${
                isCompact ? "text-5xl md:text-6xl" : "text-7xl md:text-8xl lg:text-9xl"
              }`}
            >
              ?
            </div>
          )}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 px-3 py-1 text-sm md:text-base text-amber-100 font-semibold rounded shadow">
          3대
        </div>
      </div>
    </div>
  )
}

export default function LotteryPage() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  const drumrollRef = useRef<OscillatorNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playDrumroll = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      drumrollRef.current = oscillator

      const pulse = setInterval(() => {
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
      }, 150)

      return { oscillator, audioContext, pulse }
    } catch (error) {
      console.log("[v0] Web Audio API error:", error)
      return null
    }
  }

  const playFanfare = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()

      const playNote = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration)

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start(audioContext.currentTime + startTime)
        oscillator.stop(audioContext.currentTime + startTime + duration)
      }

      playNote(523.25, 0, 0.2) // C5
      playNote(659.25, 0.2, 0.2) // E5
      playNote(783.99, 0.4, 0.2) // G5
      playNote(1046.5, 0.6, 0.5) // C6

      return audioContext
    } catch (error) {
      console.log("[v0] Web Audio API error:", error)
      return null
    }
  }

  const startDraw = () => {
    setIsDrawing(true)
    setWinner(null)
    setShowFireworks(false)
    setIsCompact(true)

    const drumrollAudio = playDrumroll()

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * CANDIDATES.length)
      const selectedWinner = CANDIDATES[randomIndex]
      setWinner(selectedWinner)
      setIsDrawing(false)
      setShowFireworks(true)

      if (drumrollAudio) {
        drumrollAudio.oscillator.stop()
        clearInterval(drumrollAudio.pulse)
        drumrollAudio.audioContext.close()
      }

      playFanfare()
    }, ANIMATION_DURATION)
  }

  const reset = () => {
    setWinner(null)
    setShowFireworks(false)
    setIsDrawing(false)
    setIsCompact(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      {showFireworks && <Fireworks />}

      {isDrawing && <FloatingParticles />}
      {isDrawing && <EnergySphere />}

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 text-center">
        <ChairmanFrames winner={winner} isCompact={isCompact} />

        <div
          className={`flex items-center justify-center mb-12 transition-all duration-700 ${
            isCompact ? "min-h-[350px]" : "min-h-[150px]"
          }`}
        >
          {!winner && !isDrawing && null}

          {isDrawing && (
            <div className="relative space-y-8">
              <div className="relative flex items-center justify-center h-48">
                <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-spin-slow">
                  ?
                </div>
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 opacity-50 animate-pulse" />
              </div>

              <div className="flex justify-center relative h-40">
                <div className="absolute w-40 h-40">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`outer-${i}`}
                      className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50"
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-70px)`,
                        animation: "spin-reverse 3s linear infinite",
                      }}
                    />
                  ))}
                </div>
                <div className="absolute w-28 h-28">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`middle-${i}`}
                      className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-50px)`,
                        animation: "spin 2s linear infinite",
                      }}
                    />
                  ))}
                </div>
                <div className="absolute w-16 h-16">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`inner-${i}`}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg shadow-yellow-500/50"
                      style={{
                        transform: `rotate(${i * 60}deg) translateY(-30px)`,
                        animation: "spin-reverse 1.5s linear infinite",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {winner && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-1000">
              <div className="text-2xl md:text-3xl text-yellow-300 font-semibold mb-4">당첨자</div>
              <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                {winner}
              </div>
              <div className="text-xl md:text-2xl text-green-300 mt-8 animate-in fade-in duration-1000 delay-500">
                축하합니다!
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isDrawing && !winner && (
            <Button
              onClick={startDraw}
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              START
            </Button>
          )}

          {winner && !isDrawing && (
            <Button
              onClick={reset}
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <RefreshCw className="w-6 h-6 mr-2" />
              RESET
            </Button>
          )}
        </div>

        {isDrawing && (
          <div className="mt-12 space-y-4">
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-white/80 text-lg animate-pulse font-semibold">추첨 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Fireworks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(25)].map((_, i) => (
        <Firework key={i} delay={i * 0.1} />
      ))}
    </div>
  )
}

function Firework({ delay }: { delay: number }) {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 60 + 10
  const randomColor = [
    "bg-yellow-400",
    "bg-pink-400",
    "bg-purple-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-red-400",
    "bg-orange-400",
  ][Math.floor(Math.random() * 7)]

  return (
    <div
      className="absolute"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        animationDelay: `${delay}s`,
      }}
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${randomColor} rounded-full opacity-0 animate-firework`}
          style={{
            transform: `rotate(${i * 30}deg)`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-400/40 rounded-full animate-float shadow-lg shadow-purple-500/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}

function EnergySphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="relative w-96 h-96">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl animate-pulse" />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-48 bg-gradient-to-t from-transparent via-purple-400/50 to-transparent"
            style={{
              transform: `rotate(${i * 60}deg) translateY(-96px)`,
              animation: "spin 4s linear infinite",
            }}
          />
        ))}
      </div>
    </div>
  )
}
