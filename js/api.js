import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { username, password, type } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    // 1. SIGN UP LOGIC
    if (type === 'signup') {
        const existingUser = await kv.get(`user:${username}`);
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Save user to KV (Database)
        await kv.set(`user:${username}`, { 
            password: password, 
            layers: ["Classic Shirt"] 
        });

        // Add to a list of all users for the Owner Panel
        await kv.lpush('all_users', username);

        return res.status(200).json({ message: 'Account created!' });
    }

    // 2. LOGIN LOGIC
    if (type === 'login') {
        const userData = await kv.get(`user:${username}`);

        if (userData && userData.password === password) {
            return res.status(200).json({ message: 'Login successful!', user: userData });
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    }
}
