
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(5)
  console.log('--- PROFILES ---')
  console.log(data)
  const { data: tenants } = await supabase.from('tenants').select('*').limit(5)
  console.log('--- TENANTS ---')
  console.log(tenants)
}

check()
