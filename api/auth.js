import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Only allow POST requests for security
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password, type } = req.body;

    // Basic check to make sure the user didn't leave boxes empty
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        // --- 1. SIGN UP LOGIC ---
        if (type === 'signup') {
            // Check if this username is already taken
            const existingUser = await kv.get(`user:${username}`);
            if (existingUser) {
                return res.status(400).json({ message: 'This username is already taken!' });
            }

            // Save the new user. We give them a default "Classic Shirt" layer.
            await kv.set(`user:${username}`, { 
                password: password, 
                layers: ["Classic Shirt"] 
            });

            // Add the username to our master list so the Admin panel can find them
            await kv.lpush('all_users', username);

            return res.status(200).json({ message: 'Account created! You can now login.' });
        }

        // --- 2. LOGIN LOGIC ---
        if (type === 'login') {
            const userData = await kv.get(`user:${username}`);

            // Check if user exists AND password matches
            if (userData && userData.password === password) {
                return res.status(200).json({ 
                    message: 'Login successful!', 
                    layers: userData.layers 
                });
            } else {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
        }

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ message: 'Database connection failed.' });
    }
}
