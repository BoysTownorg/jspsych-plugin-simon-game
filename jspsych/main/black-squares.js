import * as simon from "../../lib/index.js";
import * as simonJsPsychPlugins from "../plugin.js";
import * as jsPsychUtility from "../utility.js";

const simonPluginId = "simon-game-black-squares";
jsPsych.plugins[simonPluginId] = simonJsPsychPlugins.blackSquares(
  new Map([
    [simon.Color.red, 0],
    [simon.Color.green, 1],
    [simon.Color.blue, 2],
    [simon.Color.yellow, 3],
  ])
);
const timeline = [];
jsPsychUtility.pushSpacebarResponse(timeline, [
  "You will see patterns of black squares shown on the screen in different places, one at a time. After watching each pattern, you must correctly copy it by pressing the place where you saw it.",
  'When you finish copying each pattern, press the "Done" button and then the next pattern will be shown.',
  'For example, if you see the pattern of upper left corner, bottom right corner, and upper right corner, then you should press those same places in that order, and then press "Done" in the center.',
  "If you don't know or can't remember what a pattern was, just make your best guess. Once you make a response, you cannot go back and correct it, so take your time in choosing the correct blocks.",
  "Watch me!",
]);
const firstTrial = {
  type: simonPluginId,
  colors: [simon.Color.red, simon.Color.blue, simon.Color.blue],
};
timeline.push(firstTrial);
jsPsychUtility.pushConditionalTrial(
  timeline,
  firstTrial,
  jsPsychUtility.lastTrialIncorrect
);
jsPsychUtility.pushConditionalSpacebarResponse(
  timeline,
  ["Now it's your turn!", "Press the spacebar when you're ready to start"],
  jsPsychUtility.lastTrialCorrect
);
const secondTrial = {
  type: simonPluginId,
  colors: [simon.Color.green, simon.Color.yellow, simon.Color.green],
};
jsPsychUtility.pushConditionalTrial(
  timeline,
  secondTrial,
  jsPsychUtility.allEvaluatedTrialsCorrect
);
jsPsychUtility.pushConditionalSpacebarResponse(
  timeline,
  ["Good job!", "Do you have any questions?", "Press the spacebar to begin."],
  jsPsychUtility.allEvaluatedTrialsCorrect
);
const fixedColorSequence = jsPsych.randomization.sampleWithReplacement(
  [simon.Color.red, simon.Color.green, simon.Color.blue, simon.Color.yellow],
  32
);
let colorSequenceLength = 1;
const fixedTrial = {
  type: simonPluginId,
  colors: function () {
    return fixedColorSequence.slice(0, colorSequenceLength);
  },
  on_finish: function (data) {
    if (data.correct) ++colorSequenceLength;
    else --colorSequenceLength;
    if (colorSequenceLength == 0) colorSequenceLength = 1;
  },
};
const randomTrial = {
  type: simonPluginId,
  colors: function () {
    return jsPsych.randomization.sampleWithReplacement(
      [
        simon.Color.red,
        simon.Color.green,
        simon.Color.blue,
        simon.Color.yellow,
      ],
      colorSequenceLength
    );
  },
  on_finish: function (data) {
    if (data.correct) ++colorSequenceLength;
    else --colorSequenceLength;
    if (colorSequenceLength == 0) colorSequenceLength = 1;
  },
};

timeline.push({
  timeline: [fixedTrial],
  repetitions: 15,
});
timeline.push({
  timeline: [randomTrial],
  repetitions: 15,
});
timeline.push({
  timeline: [fixedTrial],
  repetitions: 15,
});
jsPsych.init({
  timeline: timeline,
});