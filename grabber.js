var fs = require('fs');
var youtubedl = require('youtube-dl');

var videoUrls = [
    'https://www.youtube.com/watch?v=fLlItGWiVFc&index=1&list=PLWbHc_FXPo2jBXpr1IjyUgJ7hNS1eTf7H',
    'https://www.youtube.com/watch?v=nbpZRm9gl50&index=2&list=PLWbHc_FXPo2jBXpr1IjyUgJ7hNS1eTf7H'
];

function processNextVideo(){
    var videoUrl = videoUrls.shift();
    if(videoUrl){
        downloadVideo(videoUrl);
    }
};

function downloadVideo(videoUrl){

    youtubedl.getInfo(videoUrl, [], function(err, info) {
        if (err) throw err;

        var videoTitleWithoutEscapes = info.title.replace(/\//g, '-');
        console.log('title:', videoTitleWithoutEscapes);

        var video = youtubedl(videoUrl,
                              ['--format=18'],
                              { cwd: __dirname });

        // Will be called when the download starts.
        video.on('info', function(info) {
            console.log('Download started');
            console.log('size: ' + info.size);
            console.log('--------------------');
        });

        video.pipe(fs.createWriteStream(videoTitleWithoutEscapes + '.mp4'));
        video.on('end', function(a, b, c){
            console.log('NEXT VIDEO PLEASE!');
            console.log('--------------------');
            processNextVideo();
        })
    });

};

processNextVideo();
