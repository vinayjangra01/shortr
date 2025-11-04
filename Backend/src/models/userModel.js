import pool from '../config/db.js'

class UserModel {
    static async create({name, email, passwordHash})
    {
        const query = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
        `;

        const values = [name, email, passwordHash];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email){
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }

    static async findById(userId){
        const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);
        return result.rows[0] || null;
    }

    static async emailExits(email){
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
        const result = await pool.query(query, [email]);
        return result.rows[0].exists;
    }
}

export default UserModel;