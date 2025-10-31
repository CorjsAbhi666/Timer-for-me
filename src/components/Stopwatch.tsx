import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(10);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [showTargetMessage, setShowTargetMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const targetMilliseconds = targetMinutes * 60000;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          
          // Check if target duration has been reached
          if (newTime >= targetMilliseconds && !hasNotified) {
            playBeep();
            setHasNotified(true);
            setShowTargetMessage(true);
            setTimeout(() => setShowTargetMessage(false), 5000);
          }
          
          return newTime;
        });
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning, hasNotified, targetMilliseconds]);

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
    setShowTargetMessage(false);
  };

  const handleDurationChange = (value: string) => {
    const newMinutes = parseInt(value);
    if (!isNaN(newMinutes) && newMinutes > 0 && newMinutes <= 999) {
      setTargetMinutes(newMinutes);
      setHasNotified(false);
    }
  };


  const { minutes, seconds, centiseconds } = formatTime(time);
  const isAtTarget = time >= targetMilliseconds;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Control button - top right */}
      <div className="fixed top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDurationInput(!showDurationInput)}
          className="h-10 w-10"
        >
          <Clock className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-8 md:p-16 space-y-8 max-w-4xl w-full">
          {/* Duration Input */}
          {showDurationInput && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="duration" className="text-sm font-medium">
                Target Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="999"
                value={targetMinutes}
                onChange={(e) => handleDurationChange(e.target.value)}
                disabled={isRunning}
                className="text-center text-lg font-semibold"
              />
            </div>
          )}
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
            
            {showTargetMessage && (
              <p className="text-accent font-semibold text-lg animate-pulse">
                {targetMinutes} {targetMinutes === 1 ? 'minute' : 'minutes'} reached!
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
            Target: {targetMinutes}:00 {targetMinutes === 1 ? 'minute' : 'minutes'}
          </div>
        </div>

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
