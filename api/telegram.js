// api/telegram.js - Optimized for Vercel Serverless
export default async function handler(req, res) {
    // Set security headers for Telegram WebApp
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { type, name, email, message, source = 'web' } = payload;
        
        // Validate required fields
        if (!type || !['project', 'feedback', 'subscribe'].includes(type)) {
            return res.status(400).json({ error: 'Invalid transmission type' });
        }
        
        if (type === 'project' && (!name || !email || !message)) {
            return res.status(400).json({ error: 'Missing required fields for project' });
        }
        
        if (type === 'subscribe' && !email) {
            return res.status(400).json({ error: 'Email required for subscription' });
        }
        
        // Telegram bot configuration (use your actual bot token)
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';
        
        if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
            console.warn('Telegram bot token not configured');
            return res.status(200).json({
                status: 'success',
                message: 'Form received (Telegram not configured)',
                data: payload
            });
        }
        
        // Create message
        let telegramMessage = `🚀 *New Transmission*\n`;
        telegramMessage += `📡 Type: ${type.toUpperCase()}\n`;
        telegramMessage += `⏰ Time: ${new Date().toLocaleString()}\n\n`;
        
        switch(type) {
            case 'project':
                telegramMessage += `🎬 *Project Inquiry*\n`;
                telegramMessage += `👤 Name: ${name}\n`;
                telegramMessage += `📧 Email: ${email}\n`;
                telegramMessage += `📋 Project: ${message}\n`;
                break;
            case 'feedback':
                telegramMessage += `💬 *Feedback*\n`;
                telegramMessage += `👤 Name: ${name || 'Anonymous'}\n`;
                telegramMessage += `📝 Message: ${message}\n`;
                break;
            case 'subscribe':
                telegramMessage += `📧 *Newsletter Subscription*\n`;
                telegramMessage += `📬 Email: ${email}\n`;
                break;
        }
        
        telegramMessage += `\n---\n`;
        telegramMessage += `🌐 Source: ${source === 'webapp' ? 'Telegram Mini App' : 'Website'}`;
        
        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            throw new Error('Telegram API error');
        }
        
        return res.status(200).json({
            status: 'success',
            message: 'Quantum transmission successful!',
            transmissionId: `TX-${Date.now()}`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Transmission error:', error);
        
        // Still return success to user even if Telegram fails
        return res.status(200).json({
            status: 'success',
            message: 'Message received (backend processing)',
            note: 'Telegram notification may be delayed'
        });
    }
}

// Serverless configuration
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
        externalResolver: true,
    },
};
