 import { Server } from "socket.io";
 import {spawn} from "child_process";

 const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://bom01.contribute.live-video.net/app/live_558389270_LxAq7duy0SXUDE0k6W5UsM5I70FtKM`,
];

 const io = new Server({
    cors:{
        allowedHeaders: ["*"],
        origin: "*",
    }
 });

 const ffmpegProcess = spawn('ffmpeg', options);
 
 ffmpegProcess.stdout.on('data', (data) => {
   console.log(`ffmpeg stdout: ${data}`);
});

 io.on('connection', socket => {
   console.log('Socket Connected', socket.id);
   socket.on('binarystream', stream => {
       console.log('Binary Stream Incommming...')
       ffmpegProcess.stdin.write(stream, (err) => {
           console.log('Err', err)
       })
   })
})

 io.listen(3000, () => {
    console.log("running on port 3000")
 });