const crypto = require('crypto');

// Vercel-কে বলা হচ্ছে যেন সে নিজে থেকে বডি পার্স না করে, আমরা ম্যানুয়ালি র-বডি রিড করব
export const config = {
  api: {
    bodyParser: false,
  },
};

// র-বডি (Raw Body) রিড করার হেল্পার ফাংশন (সিগনেচার মিলানোর জন্য এটি বাধ্যতামূলক)
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
    // শুধুমাত্র POST রিকোয়েস্ট অ্যালাউ করা হবে
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const rawPayload = await getRawBody(req);
        
        // CCPayment এর পাঠানো হেডার্স
        const ccSign = req.headers['sign'];
        const ccTimestamp = req.headers['timestamp'];
        
        // আপনার ক্রেডেনশিয়ালস
        const appId = "oKn5NrkrXAI3LPDJ";
        const appSecret = "c369ce3fe0a48557d66f4a4176577535";
        
        // ১. সিকিউরিটি সিগনেচার তৈরি ও ভেরিফিকেশন
        const signText = appId + ccTimestamp + rawPayload;
        const mySign = crypto.createHmac('sha256', appSecret).update(signText).digest('hex');
        
        if (mySign !== ccSign) {
            console.error("❌ Webhook Error: Invalid Signature");
            return res.status(400).send('Invalid Signature');
        }
        
        // ২. ডাটা পার্স করা
        const jsonBody = JSON.parse(rawPayload);
        
        if (jsonBody.code === 10000) {
            const orderData = jsonBody.data;
            
            const userId = orderData.referenceId; // আপনার স্ক্রিপ্ট থেকে পাঠানো ইউজার আইডি
            const amount = orderData.amount;      // কত ডিপোজিট এসেছে
            const coin = orderData.coin;          // কোন কয়েন (যেমন: USDT, LTC)
            const orderId = orderData.orderId;    // আপনার স্ক্রিপ্টের জেনারেট করা অর্ডার আইডি
            
            console.log(`💰 Success Deposit: ${amount} ${coin} received for User: ${userId} (Order: ${orderId})`);
            
            // 📝 এখানে আপনার ডাটাবেস (MongoDB/PostgreSQL) আপডেটের লজিক লিখবেন
            // যেমন: await db.collection('users').updateOne({ id: userId }, { $inc: { balance: amount } });
        }
        
        // ৩. ⚠️ অত্যন্ত গুরুত্বপূর্ণ: CCPayment-কে সাকসেস রেসপন্স পাঠানো
        return res.status(200).send('success');
        
    } catch (err) {
        console.error("❌ Webhook Internal Error:", err.message);
        return res.status(500).send('Internal Error');
    }
}