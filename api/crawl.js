import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/crawl', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing url' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.evaluate(() => {
      document.querySelectorAll('script, style').forEach(el => el.remove());
      return document.body.textContent.replace(/\s+/g, ' ').trim();
    });

    res.json({ text: content.slice(0, 5000), status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'fail' });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Puppeteer webhook is running on port ${PORT}`);
});
