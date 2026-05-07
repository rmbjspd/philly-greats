import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// Fetch all IPs without location
const { data, error } = await supabase
  .from('visits')
  .select('ip_address')
  .is('city', null)

if (error) { console.error(error.message); process.exit(1) }

const ips = [...new Set(data.map(r => r.ip_address).filter(ip => ip && ip !== 'unknown'))]
console.log(`Looking up ${ips.length} IPs: ${ips.join(', ')}`)

for (const ip of ips) {
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,status`)
  const geo = await res.json()
  if (geo.status !== 'success') {
    console.log(`  ${ip}: lookup failed (${geo.message ?? 'unknown'})`)
    continue
  }
  const { city, country } = geo
  console.log(`  ${ip}: ${city}, ${country}`)
  const { error: uErr } = await supabase
    .from('visits')
    .update({ city, country })
    .eq('ip_address', ip)
    .is('city', null)
  if (uErr) console.error(`  update error: ${uErr.message}`)
}

console.log('done')
