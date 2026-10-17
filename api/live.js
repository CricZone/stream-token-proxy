const axios = require('axios');

module.exports = async (req, res) => {
  const streamId = req.query.id || '1345';

  const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 12; POCO M2 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Soul/4.0 Chrome/155.0.8059.45 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Cookie': 'PHPSESSID=78116a7f532c4ad6d3daa62cfd99b72e; dom3ic8zudi28v8lr6fgphwffqoz0j6c=6bc29237-de2b-4d02-982b-6de665eb49e5%3A3%3A1; s9ifs0idfjlwfie32dekl=1'
  };

  try {
    // ১. টোকেন সংগ্রহ
    const authUrl = `https://hey-lookme.shop/auth.php?id=${streamId}`;
    const authRes = await axios.get(authUrl, {
      headers: { ...HEADERS, 'Referer': `https://hey-lookme.shop/play.html?id=${streamId}` }
    });

    const { exp, sig } = authRes.data;
    if (!sig || !exp) return res.status(500).send('No token');

    const liveUrl = `https://hey-lookme.shop/live.php?id=${streamId}&exp=${exp}&sig=${sig}`;

    // ২. রিডাইরেক্ট না করে সরাসরি m3u8 ডাটা ফেচ করা
    const streamRes = await axios.get(liveUrl, {
      headers: {
        'User-Agent': HEADERS['User-Agent'],
        'Referer': `https://hey-lookme.shop/play.html?id=${streamId}`
      },
      responseType: 'text'
    });

    // ৩. প্লেয়ারের জন্য m3u8 রেসপন্স ডেলিভারি
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(streamRes.data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
