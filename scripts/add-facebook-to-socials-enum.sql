-- Add 'facebook' to enum_users_socials_platform enum
-- This migration adds the missing 'facebook' value to the platform enum

ALTER TYPE enum_users_socials_platform ADD VALUE IF NOT EXISTS 'facebook';
