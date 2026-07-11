import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypgnvwemsibsmydcqkon.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZ252d2Vtc2lic215ZGNxa29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODg3NjMsImV4cCI6MjA3NTY2NDc2M30.ZEU6ySQtXnCHnHmgHVfgjfTajYnzoUqek03xSv-CY7M';
export const supabase = createClient(supabaseUrl, supabaseKey);