export class Timer {
    isPaused = false
    length: number
    startTime: number
    timerLength: number
    timePaused: number = 0
    lastPausedAt: number = null

    constructor(length) {
        this.startTime = Timer.currentTime();
        this.timerLength = length
    }

    static currentTime() { return new Date().getTime() }

    timeRemaining() { return Math.max(0, this.finishesAt() - Timer.currentTime()) }
    finishesAt() { return this.startTime + this.timePaused + this.timerLength }
    isFinished() { return Timer.currentTime() > this.finishesAt() }

    pause() {
        if (!this.isPaused) this.lastPausedAt = Timer.currentTime();
        this.isPaused = true;
    }
    start() { this.timePaused += Timer.currentTime() - this.lastPausedAt; this.isPaused = false }

    timeString() { return `${this.hoursRemaining()}:${this.minutesRemaining()}:${this.secondsRemaining()}` }

    daysRemaining() { }
    hoursRemaining() { return Math.floor(this.timeRemaining() / 1000 / 60 / 60) }
    minutesRemaining() { return Math.floor((this.timeRemaining() / 1000 / 60 / 60 - this.hoursRemaining()) * 60) }
    secondsRemaining() { return Math.floor(((this.timeRemaining() / 1000 / 60 / 60 - this.hoursRemaining()) * 60 - this.minutesRemaining()) * 60) }

    restart() {
        this.timePaused = 0;
        this.lastPausedAt = null;
        this.startTime = Timer.currentTime() + this.timerLength;
    }

    toJSON() {
        return JSON.stringify({
            timePaused: this.timePaused,
            isPaused: this.isPaused,
            lastPausedAt: this.lastPausedAt,
            timerLength: this.timerLength,
            startTime: this.startTime
        })
    }

    static fromJSON(data: string) {
        const { timePaused = 0, isPaused = false, lastPausedAt = null, timerLength = 3600000, startTime = Timer.currentTime() } = JSON.parse(data);
        const timer = new Timer(timerLength);
        timer.isPaused = isPaused;
        timer.timePaused = timePaused;
        timer.lastPausedAt = lastPausedAt;
        timer.startTime = startTime;
        return timer
    }
}