const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const tables = ['tenants', 'profiles', 'leads', 'expenses', 'schedules', 'lessons', 'training_plans', 'notifications', 'payments']
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`❌ Table ${table} error:`, error.message)
    } else {
      console.log(`✅ Table ${table} exists! Columns:`, data.length > 0 ? Object.keys(data[0]) : '(empty)')
    }
  }
}

check()
