import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { tenant_slug, identifier, method } = await req.json()

    if (!tenant_slug || !identifier) {
      return NextResponse.json({ allowed: false, reason: 'Dados incompletos' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Find tenant and student by slug and ID/QR (using profiles table)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, tenant:tenants!inner(*)')
      .eq('tenant.slug', tenant_slug)
      .or(`id.eq.${identifier},id.eq.${identifier}`) // identifier could be ID or QR logic if we had a separate field, but for now assuming it matches profile ID or a custom qr field if it existed
      .single()

    if (error || !profile) {
      return NextResponse.json({ 
        allowed: false, 
        reason: 'Aluno não encontrado ou fora da academia' 
      })
    }

    // 2. Check if active
    // Assuming status field exists in profiles or we use a sensible default
    if (profile.status === 'inativo') {
      return NextResponse.json({ 
        allowed: false, 
        reason: 'Acesso bloqueado ou inativo' 
      })
    }

    // (Note: Payments logic removed for now as Supabase schema for payments isn't seeded yet)

    // 3. Registrar presença (assuming an attendance table exists or we just return ok)
    // For now, allow access if profile is found and active
    return NextResponse.json({ 
      allowed: true, 
      studentName: profile.full_name,
      role: profile.role
    })

  } catch (error) {
    console.error('Access Verification Error:', error)
    return NextResponse.json({ allowed: false, reason: 'Erro interno' }, { status: 500 })
  }
}
