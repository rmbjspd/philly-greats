import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const dummyIps = ['1.2.3.4', '5.6.7.8', '127.0.0.1', 'unknown']

const { data: existing } = await supabase
  .from('visits')
  .select('ip_address')
  .in('ip_address', dummyIps)

console.log(`Found ${existing?.length ?? 0} dummy visit rows`)

const { error } = await supabase
  .from('visits')
  .delete()
  .in('ip_address', dummyIps)

if (error) { console.error(error.message); process.exit(1) }
console.log('✓ Cleared dummy IP visits')
