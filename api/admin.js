import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Only allow GET requests to view the data
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // These come from the headers in your js/auth.js fetch call
    const adminUser = req.headers['admin-user'];
    const adminPass = req.headers['admin-pass'];

    // --- OWNER CREDENTIALS ---
    // Change "20ia" and "owner123" to whatever you want your login to be
    if (adminUser === "20ia" && adminPass === "owner123") {
        try {
            // 1. Get the list of all usernames we saved during signup
            const usernames = await kv.lrange('all_users', 0, -1);
            const fullDatabase = [];

            // 2. Loop through each username and get their specific data (password/layers)
            for (const name of usernames) {
                const data = await kv.get(`user:${name}`);
                if (data) {
                    fullDatabase.push({
                        username: name,
                        password: data.password,
                        layers: data.layers ? data.layers.join(', ') : 'None'
                    });
                }
            }

            // 3. Send the whole list back to your website
            return res.status(200).json(fullDatabase);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Database error' });
        }
    } else {
        // If the password doesn't match
        return res.status(403).json({ message: 'Access Denied: Incorrect Owner Credentials' });
    }
}
