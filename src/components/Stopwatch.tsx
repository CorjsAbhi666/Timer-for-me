import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          
          // Check if 10 minutes (600000ms) has been reached
          if (newTime >= 600000 && !hasNotified) {
            playBeep();
            setHasNotified(true);
          }
          
          return newTime;
        });
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning, hasNotified]);

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      centiseconds: centiseconds.toString().padStart(2, "0"),
    };
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setHasNotified(false);
  };

  const { minutes, seconds, centiseconds } = formatTime(time);
  const isAtTarget = time >= 600000;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card 
        className={`relative overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 ${
          isRunning ? "animate-pulse-glow border-primary" : "border-border"
        } ${isAtTarget ? "border-accent" : ""}`}
      >
        <div className="p-8 md:p-16 space-y-8">
          {/* Time Display */}
          <div className="text-center space-y-2">
            <div className="font-mono text-7xl md:text-9xl font-bold tracking-tight">
              <span className={isAtTarget ? "text-accent" : "text-foreground"}>
                {minutes}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className={isAtTarget ? "text-accent" : "text-foreground"}>
                {seconds}
              </span>
              <span className="text-muted-foreground">.</span>
              <span className="text-4xl md:text-5xl text-muted-foreground">
                {centiseconds}
              </span>
            </div>
            
            {isAtTarget && (
              <p className="text-accent font-semibold text-lg animate-pulse">
                10 minutes reached!
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStartPause}
              className="w-32 h-14 text-lg font-semibold"
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="w-32 h-14 text-lg font-semibold"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Target indicator */}
          <div className="text-center text-sm text-muted-foreground">
            Target: 10:00 minutes
          </div>
        </div>
      </Card>

      {/* Audio element for beep sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRA0NVqzn77BdGAg+ltvy0H0pBSl+zPLaizsIGGS57OihUhENT6Xh8bllHAU2jdXzxnMoBiJ0xPDcjkAKE1y06u2nVBELRJrb8r1qIAQuhM/z14k5CBZmuuzpm1gRDU+k4fG7aR8GM4rS88h1LAUjdsLx3Y9BCxNctOvurVgSC0OZ2vLBbiMMK4HO8tyJOwgZaLrs6aFTEg1Op+Hxu2oeBjKK0/PJdigFI3fE8d6PQgsUW7Ts7q5aEwtDmNry1oFJDAAAAAA="
        preload="auto"
      />
    </div>
  );
};

export default Stopwatch;
