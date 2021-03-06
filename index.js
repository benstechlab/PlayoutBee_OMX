var Omx = require('node-omxplayer');
const  {HyperdeckServer} = require('hyperdeck-server-connection');
var ON_DEATH = require('death');
const win = null
const s = new HyperdeckServer()
const fs = require('fs')
const clipFolder = './clips/'
var speed = 100;
var slotID = 1;
var clipID = 1;
var status = 'stopped';
var singleClip = 'true';
var videoFormat = '1080p30';
var loop = 'false';
var timecode ="0:27:00:02";
var displayTimecode = "0:27:00:02";
var preview = 'false';
var clips = []
var player = null;
loadCLips();
playerPlay(clipFolder + clips[clipID-1].name);

s.onPlay = cmd => {
    console.log('playing', cmd);
    playerPlay(clipFolder + clips[clipID-1].name);
    status = "play";
    return Promise.resolve()
}
s.onGoTo = cmd =>{
clipID = cmd.parameters['clip id'];
return Promise.resolve()};

s.onClipsAdd = cmd => {console.log('CLIP ADD',cmd)};
s.onClipsClear = cmd => {console.log('CLIP CLEAR',cmd)};

s.onClipsCount = cmd => {
    console.log('CLIP COUNT',cmd);
return Promise.resolve({'clip count': clips.length})};

s.onClipsGet = cmd => {
    var result = {}
    let i = 1;
    clips.forEach(
      clip => {result[i] = " " + clip.name +" 00:00:00:00 00:24:02:00";
      i = i + 1;
    });
    return Promise.resolve(result)};


s.onConfiguration = cmd => {
console.log('CONFIG',cmd)
return Promise.resolve();
};



s.onDeviceInfo = cmd => {
    console.log('DEV INFO',cmd);
    return Promise.resolve();
};

s.onDiskList = cmd => {
    let i = 1;
console.log('DSK LIST',cmd);
var res = {'slot id': 1};
clips.forEach(clip =>{
    res[i] = clip.name +"  QuickTimeUncompressed " + videoFormat +" 24:00:02:00";
    i = i+1;
})

return Promise.resolve(res);
};

s.onFormat = cmd => {console.log('FORMAT',cmd)};

s.onIdentify = cmd => {
console.log('IDENTIFY',cmd)
return Promise.resolve();};


s.onJog = cmd => {console.log('JOG',cmd)};

s.onPlayrangeClear = cmd => {console.log('Play Clear',cmd)};

s.onPlayrangeSet = cmd => {console.log('Playrange set',cmd)};

s.onPreview = cmd => {
    preview = 'true'
    return Promise.resolve();
};
s.onRecord = cmd => {};


s.onRemote = cmd => {return Promise.resolve({'enabled':"true",'override':"false"})}; ;


s.onShuttle = cmd => {console.log('SHTTL',cmd)};


s.onSlotInfo = cmd => {console.log('INFO',cmd)
return Promise.resolve({
'slot id': 1,
'status': "mounted",
'volume name': "Playout Bee",
'recording time': 0,
'video format': videoFormat
})};

s.onSlotSelect = cmd => {
console.log('Slotselct',cmd);
return Promise.resolve();};


s.onStop = cmd => {
status = "stopped";
playerStop();
return Promise.resolve();
};


s.onTransportInfo = cmd => {
let res = {
    'status': status,
    'speed' : speed,
    'slot id': 1,
    'display timecode': displayTimecode,
    'timecode': timecode,
    'clip id' : clipID,
    'video format': videoFormat,
    'loop' : loop
};
updateTC();
return Promise.resolve(res)};


s.onUptime = cmd => {console.log('Recived',cmd)};
s.onWatchdog = cmd => {console.log('Recived',cmd)};
//Player fucntions
function updateTC(){
    console.log(player.info());
}
function playerPlay(clip){
    player = Omx(clip);
 
}
function playerStop(){
    player.quit();
}
player.on('close',()=>{
    status ="stopped";
})

// OWN FUNCTIONS
function loadCLips(){
    let i = 0;
    fs.readdirSync(clipFolder).forEach(file =>{
        console.log("read file :",file);
        let single = {'name':file};
        clips.push(single);
        i = i +1;
    })
    console.log("result ",clips);
}
ON_DEATH(function(signal, err) {
    console.info('SIGTERM signal received.');
    player.quit();
    setTimeout(process.exit(), 3000);
    
  });

