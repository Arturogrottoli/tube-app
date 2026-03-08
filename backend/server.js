const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

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

    const ytDlp = spawn('yt-dlp', [
        '--dump-json',
        '--no-playlist',
        videoUrl
    ]);

    let output = '';
    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => {
        output += data.toString();
    });

    ytDlp.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp exited with code ${code}: ${errorOutput}`);
            return res.status(500).json({ error: 'Failed to fetch video info' });
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
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL is required');

    const isAudio = format === 'mp3';
    const args = [
        '--no-playlist',
        '-o', '-', // output to stdout
        url
    ];

    if (isAudio) {
        args.push('-x', '--audio-format', 'mp3');
    } else {
        args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    }

    const ytDlp = spawn('yt-dlp', args);

    res.setHeader('Content-Disposition', `attachment; filename="download.${isAudio ? 'mp3' : 'mp4'}"`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

    ytDlp.stdout.pipe(res);

    ytDlp.stderr.on('data', (data) => {
        // Log errors but don't break the stream unless it's fatal
        console.error(`yt-dlp error: ${data}`);
    });

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp process exited with code ${code}`);
        }
    });

    req.on('close', () => {
        ytDlp.kill();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
