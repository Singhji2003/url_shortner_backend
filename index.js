const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());

mongoose.connect('mongodb+srv://arpansinghrajput123:Arpan123@cluster0.2l1jzqu.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String
});

const Url = mongoose.model('Url', UrlSchema);

app.use(bodyParser.json());

app.post('/api/url/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const shortCode = shortid.generate();
    const shortUrl = `http://singhji/${shortCode}`;

    try {
        let url = await Url.findOne({ longUrl });
        if (url) {
            res.json(url);
        } else {
            url = new Url({ longUrl, shortUrl });
            await url.save();
            res.json(url);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// Endpoint to redirect short URL to original URL
app.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: `http://singhji/${req.params.shortUrl}` });

        if (url) {
            res.redirect(url.longUrl);
        } else {
            res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// Endpoint to delete the url

app.delete('/api/url/:id', async (req, res) => {
    try {
        const url = await Url.findByIdAndDelete(req.params.id);
        res.json(url)
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
