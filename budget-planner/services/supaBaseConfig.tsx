import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://vvofzbnnqtsfmfkdnohy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b2Z6Ym5ucXRzZm1ma2Rub2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NjQwOTUsImV4cCI6MjA0MDI0MDA5NX0.l5I2-wo7JvqW0Q5gwdh309OLqxuCWwcmH4vFZ5GHPIo')
