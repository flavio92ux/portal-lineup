import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos.' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Por favor, forneça um endereço de e-mail válido.' },
        { status: 400 },
      )
    }

    // Registra a mensagem recebida para log do servidor
    console.log('[Portal Lineup - Contato]', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Sua mensagem foi enviada com sucesso! A equipe do Portal Lineup entrará em contato em breve.',
    })
  } catch (error) {
    console.error('[Portal Lineup - Contato Error]', error)
    return NextResponse.json(
      { error: 'Ocorreu uma falha interna ao processar seu contato. Tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}
