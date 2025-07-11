const Url = require('../models/Url');

exports.createShortUrl = async (req, res) => {
  console.log('📩 Request received:', req.body);

  try {
    const { url: originalUrl, validity, shortcode } = req.body;

    if (!originalUrl || !originalUrl.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    const code = shortcode || Math.random().toString(36).substring(2, 8);

    const newUrl = new Url({
      originalUrl,
      shortCode: code,
      expiresAt: new Date(Date.now() + (validity || 30) * 60000)
    });

    await newUrl.save();

    res.status(201).json({
      shortCode: code,
      originalUrl,
      expiresAt: newUrl.expiresAt
    });
  } catch (err) {
    console.error('❌ Error in createShortUrl:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getAllStats = async (req, res) => {
  const urls = await Url.find();
  const result = urls.map((url) => ({
    shortLink: `http://localhost:5000/${url.shortcode}`,
    clicks: url.clicks,
    createdAt: url.createdAt,
    expiry: url.expiry,
  }));
  res.json(result);
};

exports.redirectToOriginal = async (req, res) => {
  const { shortcode } = req.params;
  const url = await Url.findOne({ shortcode });

  if (!url || new Date() > url.expiry) {
    return res.status(404).send('Link expired or not found');
  }

  url.clicks += 1;
  await url.save();

  res.redirect(url.originalUrl);
};
