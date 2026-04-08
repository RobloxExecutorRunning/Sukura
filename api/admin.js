import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const adminUser = req.headers['admin-user'];
    const adminPass = req.headers['admin-pass'];

    // --- UPDATED OWNER CREDENTIALS ---
    if (adminUser === "20ia" && adminPass === "twinboys112211!") {
        try {
            const usernames = await kv.lrange('all_users', 0, -1);
            const fullDatabase = [];

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

            return res.status(200).json(fullDatabase);

        } catch (error) {
            return res.status(500).json({ message: 'Database error' });
        }
    } else {
        return res.status(403).json({ message: 'Access Denied: Incorrect Owner Credentials' });
    }
}
