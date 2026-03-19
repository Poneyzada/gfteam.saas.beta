import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public webhook — receives leads from landing pages
// Body: { name, phone, email?, turma?, source?, utm_source?, utm_campaign?, tenant_slug }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      phone,
      email,
      turma,
      source = 'landing_page',
      utm_source,
      utm_campaign,
      tenant_slug,
      trial_date,
      trial_time,
    } = body

    if (!name || !phone || !tenant_slug) {
      return NextResponse.json(
        { error: 'name, phone e tenant_slug são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('slug', tenant_slug)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Academia não encontrada' }, { status: 404 })
    }

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        tenant_id: tenant.id,
        name,
        phone,
        email: email || null,
        turma: turma || null,
        source,
        utm_source: utm_source || null,
        utm_campaign: utm_campaign || null,
        status: trial_date ? 'agendado' : 'novo',
        trial_date: trial_date || null,
        trial_time: trial_time || null,
      })
      .select()
      .single()

    if (leadError) {
      console.error('Lead insert error:', leadError)
      return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 })
    }

    // Fire-and-forget → n8n → Evolution API → WhatsApp
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_LEADS
    if (n8nWebhookUrl) {
      const now = new Date()
      const dateStr = now.toLocaleDateString('pt-BR')
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Lead data
          lead_id: lead.id,
          name,
          phone,
          email: email || '—',
          turma: turma || 'Não informado',
          source,
          utm_source: utm_source || '—',
          utm_campaign: utm_campaign || '—',
          // Context
          tenant_name: tenant.name,
          tenant_slug,
          date: dateStr,
          time: timeStr,
          trial_date: trial_date || null,
          trial_time: trial_time || null,
          crm_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gfteam-saas.vercel.app'}/dashboard/crm`,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, lead_id: lead.id }, { status: 201 })
  } catch (err) {
    console.error('API /leads error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
