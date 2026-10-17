const axios = require('axios');

module.exports = async (req, res) => {
  const streamId = req.query.id || '1345';

  const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 12; POCO M2 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Soul/4.0 Chrome/155.0.8059.45 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'X-Requested-With': 'com.mycompany.app.soulbrowser',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': `https://hey-lookme.shop/play.html?id=${streamId}`,
    'Cookie': 'PHPSESSID=78116a7f532c4ad6d3daa62cfd99b72e; dom3ic8zudi28v8lr6fgphwffqoz0j6c=6bc29237-de2b-4d02-982b-6de665eb49e5%3A3%3A1; s9ifs0idfjlwfie32dekl=1'
  };

  try {
    // id প্যারামিটার সহ কল করা
    const authUrl = `https://hey-lookme.shop/auth.php?id=${streamId}`;
    
    const authResponse = await axios.get(authUrl, {
      headers: HEADERS,
      timeout: 5000
    });

    const { exp, sig } = authResponse.data;

    if (!sig || !exp) {
      return res.status(500).send('টোকেন জেনারেট হয়নি');
    }

    const freshLiveUrl = `https://hey-lookme.shop/live.php?id=${streamId}&exp=${exp}&sig=${sig}`;

    // প্লেয়ারকে সরাসরি স্ট্রিমে রিডাইরেক্ট
    res.writeHead(302, { Location: freshLiveUrl });
    res.end();

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch stream token',
      status: error.response?.status,
      response_data: error.response?.data || error.message
    });
  }
};
