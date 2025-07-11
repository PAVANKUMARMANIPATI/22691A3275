const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

// POST /shorturls — create a new shortened URL
router.post('/shorturls', async (req, res) => {
  try {
    console.log("📩 Received POST /shorturls with body:", req.body);
    const { url, validity, shortcode } = req.body;

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortCode = shortcode || Math.random().toString(36).substring(2, 8);
    const expiresAt = new Date(Date.now() + (validity || 30) * 60000); // default 30 minutes

    const newUrl = await Url.create({
      originalUrl: url,
      shortCode,
      expiresAt,
    });

    return res.status(201).json({
      shortCode: newUrl.shortCode,
      originalUrl: newUrl.originalUrl,
      expiresAt: newUrl.expiresAt,
    });
  } catch (err) {
    console.error('❌ Error in POST /shorturls:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortcode — redirect to the original URL
router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlEntry = await Url.findOne({ shortCode: shortcode });

    if (!urlEntry) {
      return res.status(404).send('Short URL not found');
    }

    if (urlEntry.expiresAt && urlEntry.expiresAt < new Date()) {
      return res.status(410).send('Short URL has expired');
    }

    urlEntry.clicks = (urlEntry.clicks || 0) + 1;
    await urlEntry.save();

    return res.redirect(urlEntry.originalUrl);
  } catch (err) {
    console.error('❌ Error in GET /:shortcode:', err);
    return res.status(500).send('Internal Server Error');

  }
  
});

module.exports = router;
