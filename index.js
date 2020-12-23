const config = require("./config.json");
const screenshot = require("screenshot-desktop");
const ioHook = require("iohook");
const exec = require("child_process").exec;

let i = 0;
let recording = false;
let intervalID;

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function execute(command) {
  exec(command, (err, stdout, stderr) => {
    process.stdout.write(stdout);
  });
}

ioHook.start();
ioHook.on("keydown", (event) => {
  if (event.shiftKey === true && event.keycode === 87) {
    recording = !recording;
    console.log(`Recording = ${recording}`);
    if (recording) {
      intervalID = setInterval(function () {
        screenshot({
          format: config.format,
          filename: `${config.imgPath}/${pad(i, 6)}.${config.format}`,
        });
        console.log(pad(i, 6));
        i++;
      }, config.interval);
    } else {
      clearInterval(intervalID);
      execute(
        `ffmpeg -framerate ${config.framerate} -i ${config.imgPath}/%06d.${config.format} ./output/timelapse.mp4`
      );
    }
  }
});
