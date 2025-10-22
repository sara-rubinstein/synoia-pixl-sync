const { spawn } = require("child_process");
const child = spawn("cmd.exe", ["/c", "start-client.bat"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});
