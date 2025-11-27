import pool from '../config/db.js';

class UrlModel{
    
    static async create({originalUrl, shortUrl, customUrl, userId, title, qrCode }){
        const query =  `
            INSERT INTO urls (original_url, short_url, custom_url, user_id, title, qr_code)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, original_url, short_url, custom_url, user_id, title, created_at, updated_at
        `;
        
        const values = [originalUrl, shortUrl, customUrl || null, userId, title || null, qrCode || null];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByShortUrl(shortUrl){
        const query = `
            SELECT * FROM urls WHERE short_url = $1 OR custom_url = $1
        `;

        const result = await pool.query(query, [shortUrl]);
        return result.rows[0] || null;
    }



    static async updateQr(id, qrKey){
        const query = `UPDATE urls SET qr_code = $1 WHERE id = $2`
        return pool.query(query, [qrKey, id]);
    }

    //there must be some common column between two tables
    static async findByUserId(userId){

        //1. what we want and from which tables
        const query = `
            SELECT u.id, u.original_url, u.short_url, u.custom_url, u.title,
            u.created_at, u.updated_at, COUNT(v.id) as visit_count FROM urls u LEFT JOIN visits v ON u.id = v.url_id
            WHERE u.user_id = $1
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    }

    static async customUrlExists(customUrl){
        const query = 'SELECT EXISTS(SELECT 1 FROM urls WHERE custom_url = $1)';
        const result = await pool.query(query, [customUrl]);
        return result.rows[0].exists;
    }

    static async recordVisit({urlId, city, device, country})
    {
        const query =  `
            INSERT INTO visits (url_id, city, device, country)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [urlId, city || null, device || null, country || null];

        const result = await pool.query(query,values);

        return result.rows[0];
    }

    static async getAnalytics(urlId)
    {
        const query =  `
            SELECT 
                COUNT(*) as total_visits, 
                COUNT(DISTINCT country) as unique_countries,
                COUNT(DISTINCT device) as unique_devices,
                json_agg(DISTINCT country) FILTER (WHERE country IS NOT NULL) as countries,
                json_agg(DISTINCT device) FILTER (WHERE device IS NOT NULL) as devices,
                json_agg(DISTINCT city) FILTER (WHERE city IS NOT NULL) as cities
            FROM visits
            WHERE url_id = $1        
        `;

        const result = await pool.query(query, [urlId]);
        return result.rows[0];
    }

    static async findById(id, userId) {
        const query = `
            SELECT * FROM urls WHERE id = $1 AND user_id = $2
        `;
        const result = await pool.query(query, [id, userId]);
        return result.rows[0] || null;
    }

    static async update({ id, userId, originalUrl, customUrl, title }) {
        const query = `
            UPDATE urls 
            SET original_url = $1, custom_url = $2, title = $3, updated_at = NOW()
            WHERE id = $4 AND user_id = $5
            RETURNING id, original_url, short_url, custom_url, user_id, title, created_at, updated_at
        `;
        const values = [originalUrl, customUrl || null, title || null, id, userId];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    static async delete(id, userId) {
        const query = `
            DELETE FROM urls 
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;
        const result = await pool.query(query, [id, userId]);
        return result.rows[0] || null;
    }
}


export default UrlModel;