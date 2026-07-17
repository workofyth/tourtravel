-- Remove price and duration_days from packages (price will be in description)
ALTER TABLE packages DROP COLUMN IF EXISTS price;
ALTER TABLE packages DROP COLUMN IF EXISTS duration_days;
