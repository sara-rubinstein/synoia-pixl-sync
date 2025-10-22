const { exec } = require("child_process");

const child = exec("start-backend.bat", {
    cwd: "C:\\Users\\sara\\Desktop\\SyncFunctionApp\\SyncFunctionsApp"
});

child.stdout.on("data", data => console.log(data.toString()));
child.stderr.on("data", data => console.error(data.toString()));
