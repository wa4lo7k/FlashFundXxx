-- Migration: Add payment_provider column to orders table
-- This script adds the payment_provider column to track which payment service was used

-- Add payment_provider column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_provider'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders 
        ADD COLUMN payment_provider TEXT;
        
        -- Update existing crypto orders to mark them as nowpayments
        UPDATE public.orders 
        SET payment_provider = 'nowpayments' 
        WHERE payment_method = 'crypto' 
        AND payment_provider_id IS NOT NULL;
        
        RAISE NOTICE 'Added payment_provider column to orders table';
    ELSE
        RAISE NOTICE 'payment_provider column already exists';
    END IF;
END $$;
