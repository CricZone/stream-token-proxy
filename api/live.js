const axios = require('axios');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 12; POCO M2 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Soul/4.0 Chrome/155.0.8059.45 Mobile Safari/537.36',
  'Accept': 'application/json',
  'Cookie': 'PHPSESSID=78116a7f532c4ad6d3daa62cfd99b72e; dom3ic8zudi28v8lr6fgphwffqoz0j6c=6bc29237-de2b-4d02-982b-6de665eb49e5%3A3%3A1; s9ifs0idfjlwfie32dekl=1'
};

module.exports = async (req, res) => {
  const streamId = req.query.id || '1345';

  try {
    // auth.php থেকে নতুন টোকেন সংগ্রহ
    const authResponse = await axios.get('https://hey-lookme.shop/auth.php', {
      headers: {
        ...HEADERS,
        'Referer': `https://hey-lookme.shop/play.html?id=${streamId}`
      }
    });

    const { exp, sig } = authResponse.data;

    if (!sig || !exp) {
      return res.status(500).send('টোকেন পাওয়া যায়নি');
    }

    // ফ্রেশ টোকেনযুক্ত লাইভ URL
    const freshLiveUrl = `https://hey-lookme.shop/live.php?id=${streamId}&exp=${exp}&sig=${sig}`;

    // প্লেয়ারকে রিডাইরেক্ট (302) করা
    res.writeHead(302, { Location: freshLiveUrl });
    res.end();

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stream token', details: error.message });
  }
};
