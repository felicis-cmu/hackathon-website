import { Resend } from 'resend'

type DecisionStatus = 'accepted' | 'rejected'

type DecisionEmailApplication = {
  email: string
  full_name: string
}

export type EmailDeliveryResult = {
  sent: boolean
  skipped: boolean
  reason?: string
  error?: string
  messageId?: string | null
}

type DecisionEmailContent = {
  subject: string
  text: string
  html: string
}

type ResendConfig = {
  apiKey: string
  senderEmail: string
  senderName: string
}

function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? ''
  const senderEmail = process.env.RESEND_FROM_EMAIL?.trim() ?? ''
  const senderName = process.env.RESEND_FROM_NAME?.trim() || 'VentureHacks'

  if (!apiKey || !senderEmail) {
    return null
  }

  return {
    apiKey,
    senderEmail,
    senderName,
  }
}

function getGreetingName(fullName: string): string {
  const name = fullName.trim()
  if (!name) return 'there'
  return name.split(/\s+/)[0] || name
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildApplicationDecisionEmail(
  application: DecisionEmailApplication,
  status: DecisionStatus
): DecisionEmailContent {
  const name = getGreetingName(application.full_name)

  if (status === 'accepted') {
    return {
      subject: 'You\'re accepted to VentureHacks',
      text: [
        `Hi ${name},`,
        '',
        'Congratulations - you\'ve been accepted to VentureHacks, the Felicis x CMU Hackathon on Saturday, March 28, 2026!',
        '',
        'Here\'s what you need to know:',
        '',
        'Date: Saturday, March 28, 2026',
        'Location: Doherty 2315',
        'Start time: 11 AM',
        '',
        'Prizes:',
        '- $2,500 Grand Prize',
        '- Meta Ray-Bans (2nd Place)',
        '- Nintendo Switches (3rd Place)',
        '- Free swag + Chipotle for all participants',
        '- Top 3 teams may get a coffee chat with the Felicis General Partner who invested in Skild AI and Mercor',
        '',
        'We\'ll also have a live Q&A with a founding member of Skild AI!',
        '',
        'Please confirm your attendance by going to your dashboard at: https://www.venturehacks.dev/apply/dashboard',
        '',
        'See you soon,',
        'Aarush and David',
      ].join('\n'),
      html: [
        `<p>Hi ${escapeHtml(name)},</p>`,
        '<p>Congratulations - you\'ve been accepted to VentureHacks, the Felicis x CMU Hackathon on <strong>Saturday, March 28, 2026</strong>!</p>',
        '<p>Here\'s what you need to know:</p>',
        '<p><strong>Date:</strong> Saturday, March 28, 2026<br /><strong>Location:</strong> Doherty 2315<br /><strong>Start time:</strong> 11 AM</p>',
        '<p><strong>Prizes:</strong></p>',
        '<ul><li>$2,500 Grand Prize</li><li>Meta Ray-Bans (2nd Place)</li><li>Nintendo Switches (3rd Place)</li><li>Free swag + Chipotle for all participants</li><li>Top 3 teams may get a coffee chat with the Felicis General Partner who invested in Skild AI and Mercor</li></ul>',
        '<p>We\'ll also have a live Q&amp;A with a founding member of Skild AI!</p>',
        '<p>Please confirm your attendance by going to your dashboard at <a href="https://www.venturehacks.dev/apply/dashboard">venturehacks.dev/apply/dashboard</a>.</p>',
        '<p>See you soon,<br />Aarush and David</p>',
      ].join(''),
    }
  }

  return {
    subject: 'Your VentureHacks application',
    text: [
      `Hi ${name},`,
      '',
      'Thank you so much for applying to VentureHacks - we really appreciated your interest and the time you put into your application.',
      '',
      'Unfortunately, we weren\'t able to offer you a spot this time around. We had a lot of strong applicants and limited capacity, which made decisions really tough.',
      '',
      'We hope you\'ll keep building and stay plugged into the CMU startup ecosystem - this won\'t be the last event we run. If you have any questions or feedback, feel free to reach out.',
      '',
      'Best of luck with everything,',
      'Aarush and David',
    ].join('\n'),
    html: [
      `<p>Hi ${escapeHtml(name)},</p>`,
      '<p>Thank you so much for applying to VentureHacks - we really appreciated your interest and the time you put into your application.</p>',
      '<p>Unfortunately, we weren\'t able to offer you a spot this time around. We had a lot of strong applicants and limited capacity, which made decisions really tough.</p>',
      '<p>We hope you\'ll keep building and stay plugged into the CMU startup ecosystem - this won\'t be the last event we run. If you have any questions or feedback, feel free to reach out.</p>',
      '<p>Best of luck with everything,<br />Aarush and David</p>',
    ].join(''),
  }
}

export async function sendApplicationDecisionEmail(
  application: DecisionEmailApplication,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<EmailDeliveryResult> {
  if (status === 'pending') {
    return {
      sent: false,
      skipped: true,
      reason: 'Pending applications do not send a decision email.',
    }
  }

  const config = getResendConfig()
  if (!config) {
    return {
      sent: false,
      skipped: false,
      error: 'Resend is not configured yet.',
    }
  }

  try {
    const resend = new Resend(config.apiKey)
    const email = buildApplicationDecisionEmail(application, status)
    const { data, error } = await resend.emails.send({
      from: `${config.senderName} <${config.senderEmail}>`,
      to: application.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    })

    if (error) {
      return {
        sent: false,
        skipped: false,
        error: error.message || 'Failed to send Resend email',
      }
    }

    return {
      sent: true,
      skipped: false,
      messageId: data?.id ?? null,
    }
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      error: error instanceof Error ? error.message : 'Unknown Resend send error',
    }
  }
}
