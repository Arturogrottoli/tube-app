const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to get video info
app.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const cookiesPath = path.join(__dirname, 'cookies.txt');
    const args = [
        '--dump-json',
        '--no-playlist',
        '--js-runtimes', 'node',
        '--no-warnings',
        '--extractor-args', 'youtube:player-client=web,ios',
        videoUrl
    ];

    if (fs.existsSync(cookiesPath)) {
        args.unshift('--cookies', cookiesPath);
    }

    const ytDlp = spawn('yt-dlp', args);


    let output = '';
    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => {
        output += data.toString();
    });

    ytDlp.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    ytDlp.on('close', (code) => {
        if (code !== 0 && !output) { // Only error if no output AND non-zero code
            console.error(`yt-dlp exited with code ${code}: ${errorOutput}`);
            
            // Extract the actual ERROR line if possible
            const errorMatch = errorOutput.match(/ERROR: (.*)/);
            const actualError = errorMatch ? errorMatch[1] : errorOutput.split('\n')[0];

            return res.status(500).json({ 
                error: 'Failed to fetch video info', 
                details: actualError 
            });
        }

        try {
            const info = JSON.parse(output);
            res.json({
                title: info.title,
                thumbnail: info.thumbnail,
                duration: info.duration_string,
                uploader: info.uploader,
                id: info.id
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse video info' });
        }
    });
});

// Endpoint to download audio or video
app.get('/download', (req, res) => {
    const { url, format, title } = req.query;
    if (!url) return res.status(400).send('URL is required');

    const isAudio = format === 'mp3';
    const extension = isAudio ? 'mp3' : 'mp4';
    
    // Sanitize title for filename
    const safeTitle = (title || 'download')
        .replace(/[^\w\s-]/gi, '') // Remove special characters
        .trim();
    
    const cookiesPath = path.join(__dirname, 'cookies.txt');
    const args = [
        '--no-playlist',
        '--js-runtimes', 'node',
        '--no-warnings',
        '--extractor-args', 'youtube:player-client=web,ios',
        '-o', '-', // output to stdout
        url
    ];

    if (fs.existsSync(cookiesPath)) {
        args.unshift('--cookies', cookiesPath);
    }

    if (isAudio) {
        args.push('-x', '--audio-format', 'mp3');
    } else {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    }

    const ytDlp = spawn('yt-dlp', args);


    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${extension}"`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

    // Pipe the output to the response
    ytDlp.stdout.pipe(res);

    let errorCaptured = '';
    ytDlp.stderr.on('data', (data) => {
        errorCaptured += data.toString();
        // Log errors but don't break the stream unless it's fatal
        if (errorCaptured.includes('ERROR:')) {
            console.error(`yt-dlp error: ${data}`);
        }
    });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp process exited with code ${code}. Error: ${errorCaptured}`);
            // If the headers haven't been sent yet, we can send an error
            if (!res.headersSent) {
                res.status(500).send('Error processing download');
            }
        }
    });

    req.on('close', () => {
        if (ytDlp) ytDlp.kill();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
