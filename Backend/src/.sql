-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1️⃣ USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- 2️⃣ URLS TABLE
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    original_url TEXT NOT NULL,
    short_url TEXT NOT NULL,
    custom_url TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- link to user
    title TEXT,
    qr_code TEXT
);

-- 3️⃣ VISITS TABLE
CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    url_id BIGINT REFERENCES urls(id) ON DELETE CASCADE,  -- link to url
    city TEXT,
    device TEXT,
    country TEXT
);
