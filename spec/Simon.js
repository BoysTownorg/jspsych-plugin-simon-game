import { Simon } from '../lib/Simon.js'
import { Color } from '../lib/Color.js'

class PresenterStub {
    clearState() {
        this.redLitUp_ = false;
        this.yellowLitUp_ = false;
        this.greenLitUp_ = false;
        this.blueLitUp_ = false;
    }

    redLitUp() { return this.redLitUp_; }

    greenLitUp() { return this.greenLitUp_; }

    yellowLitUp() { return this.yellowLitUp_; }

    blueLitUp() { return this.blueLitUp_; }

    lightUpRed() { this.redLitUp_ = true; }

    lightUpGreen() { this.greenLitUp_ = true; }

    lightUpYellow() { this.yellowLitUp_ = true; }

    lightUpBlue() { this.blueLitUp_ = true; }
}

class AudioPlayerStub {
    clearState() {
        this.redPlayed_ = false;
        this.yellowPlayed_ = false;
        this.greenPlayed_ = false;
        this.bluePlayed_ = false;
    }

    redPlayed() { return this.redPlayed_; }

    greenPlayed() { return this.greenPlayed_; }

    yellowPlayed() { return this.yellowPlayed_; }

    bluePlayed() { return this.bluePlayed_; }

    playRed() { this.redPlayed_ = true; }

    playGreen() { this.greenPlayed_ = true; }

    playYellow() { this.yellowPlayed_ = true; }

    playBlue() { this.bluePlayed_ = true; }
}

class TimerStub {
    constructor() {
        this.scheduledNotifications_ = 0;
    }

    callback() {
        this.listener.notify();
    }

    subscribe(e) { this.listener = e; }

    scheduledNotificationTimeMilliseconds() { return this.scheduledNotificationTimeMilliseconds_; }

    scheduleNotificationAfterMilliseconds(x) {
        ++this.scheduledNotifications_;
        this.scheduledNotificationTimeMilliseconds_ = x;
    }

    scheduledNotifications() { return this.scheduledNotifications_; }
}

function say(simon, colors) {
    simon.say(colors);
}

function callback(timer) {
    timer.callback();
}

function redLitUp(presenter) {
    return presenter.redLitUp();
}

function greenLitUp(presenter) {
    return presenter.greenLitUp();
}

function blueLitUp(presenter) {
    return presenter.blueLitUp();
}

function yellowLitUp(presenter) {
    return presenter.yellowLitUp();
}

function redPlayed(audioPlayer) {
    return audioPlayer.redPlayed();
}

function greenPlayed(audioPlayer) {
    return audioPlayer.greenPlayed();
}

function bluePlayed(audioPlayer) {
    return audioPlayer.bluePlayed();
}

function yellowPlayed(audioPlayer) {
    return audioPlayer.yellowPlayed();
}

function expectTrue(b) {
    expect(b).toBeTrue();
}

function scheduledNotificationTimeMilliseconds(timer) {
    return timer.scheduledNotificationTimeMilliseconds();
}

function scheduledNotifications(timer) {
    return timer.scheduledNotifications();
}

function expectScheduledNotificationTimeMillisecondsToEqual(timer, x) {
    expect(scheduledNotificationTimeMilliseconds(timer)).toEqual(x);
}

function expectScheduledNotificationsToEqual(timer, n) {
    expect(scheduledNotifications(timer)).toEqual(n);
}

function setScheduleNotifactionTimeMilliseconds(simon, x) {
    simon.setScheduleNotifactionTimeMilliseconds(x);
}

function clearPresenterState(presenter) {
    presenter.clearState();
}

function clearAudioPlayerState(audioPlayer) {
    audioPlayer.clearState();
}

function enterYellow(simon) {
    simon.enterYellow();
}

function enterRed(simon) {
    simon.enterRed();
}

function enterGreen(simon) {
    simon.enterGreen();
}

function enterBlue(simon) {
    simon.enterBlue();
}

describe("Simon", function () {
    beforeEach(function () {
        this.presenter = new PresenterStub();
        this.audioPlayer = new AudioPlayerStub();
        this.timer = new TimerStub();
        this.simon = new Simon(this.presenter, this.audioPlayer, this.timer);
    });

    it("should light each color while playing corresponding tone", function () {
        say(this.simon, [Color.red, Color.green, Color.blue, Color.yellow]);
        expectTrue(redLitUp(this.presenter));
        expectTrue(redPlayed(this.audioPlayer));
        callback(this.timer);
        expectTrue(greenLitUp(this.presenter));
        expectTrue(greenPlayed(this.audioPlayer));
        callback(this.timer);
        expectTrue(blueLitUp(this.presenter));
        expectTrue(bluePlayed(this.audioPlayer));
        callback(this.timer);
        expectTrue(yellowLitUp(this.presenter));
        expectTrue(yellowPlayed(this.audioPlayer));
    });

    it("should schedule timed notification on say", function () {
        setScheduleNotifactionTimeMilliseconds(this.simon, 1);
        say(this.simon, [Color.red, Color.green, Color.blue, Color.yellow]);
        expectScheduledNotificationTimeMillisecondsToEqual(this.timer, 1);
    });

    it("should schedule timed notification on notify", function () {
        setScheduleNotifactionTimeMilliseconds(this.simon, 1);
        say(this.simon, [Color.red, Color.green, Color.blue, Color.yellow]);
        callback(this.timer);
        expectScheduledNotificationTimeMillisecondsToEqual(this.timer, 1);
        expectScheduledNotificationsToEqual(this.timer, 2);
    });

    it("should only schedule timed notification on say when more than one color", function () {
        say(this.simon, [Color.red]);
        expectScheduledNotificationsToEqual(this.timer, 0);
    });

    it("should only schedule timed notification on notify when more than one color remaining", function () {
        say(this.simon, [Color.red, Color.green]);
        callback(this.timer);
        expectScheduledNotificationsToEqual(this.timer, 1);
    });

    it("should light up and play entered colors that are correct", function () {
        say(this.simon, [Color.red, Color.green, Color.blue, Color.yellow]);
        clearPresenterState(this.presenter);
        clearAudioPlayerState(this.audioPlayer);
        enterRed(this.simon);
        expectTrue(redLitUp(this.presenter));
        expectTrue(redPlayed(this.audioPlayer));
        enterGreen(this.simon);
        expectTrue(greenLitUp(this.presenter));
        expectTrue(greenPlayed(this.audioPlayer));
        enterBlue(this.simon);
        expectTrue(blueLitUp(this.presenter));
        expectTrue(bluePlayed(this.audioPlayer));
        enterYellow(this.simon);
        expectTrue(yellowLitUp(this.presenter));
        expectTrue(yellowPlayed(this.audioPlayer));
    });
});
