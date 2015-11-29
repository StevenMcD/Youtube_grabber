'use strict';

let fs = require('fs');
let youtubedl = require('youtube-dl');

let videoUrls = [
    'https://www.youtube.com/watch?v=7V7zLrlX-T0',
    'https://www.youtube.com/watch?v=db4wXnvBbPc'
];

function processNextVideo(){
    let videoUrl = videoUrls.shift();
    if(videoUrl){
        downloadVideo(videoUrl);
    }
};

function downloadVideo(videoUrl){

    youtubedl.getInfo(videoUrl, [], function(err, info) {
        if (err) throw err;

        let videoTitleWithoutEscapes = info.title.replace(/\//g, '-');
        console.log('title:', videoTitleWithoutEscapes);

        let video = youtubedl(videoUrl,
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
