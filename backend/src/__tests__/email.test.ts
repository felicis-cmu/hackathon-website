import { buildApplicationDecisionEmail } from '../lib/email'

describe('Decision email templates', () => {
  it('builds the acceptance email copy', () => {
    const email = buildApplicationDecisionEmail(
      {
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      },
      'accepted'
    )

    expect(email.subject).toBe('You\'re accepted to VentureHacks')
    expect(email.text).toContain('Hi Jane,')
    expect(email.text).toContain('Saturday, March 28, 2026')
    expect(email.text).toContain('$2,500 Grand Prize')
    expect(email.text).toContain('https://www.venturehacks.dev/apply/dashboard')
    expect(email.html).toContain('Meta Ray-Bans (2nd Place)')
    expect(email.html).toContain('Skild AI')
  })

  it('builds the rejection email copy', () => {
    const email = buildApplicationDecisionEmail(
      {
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      },
      'rejected'
    )

    expect(email.subject).toBe('Your VentureHacks application')
    expect(email.text).toContain('Hi Jane,')
    expect(email.text).toContain('Thank you so much for applying to VentureHacks')
    expect(email.text).toContain('we weren\'t able to offer you a spot this time around')
    expect(email.text).toContain('Aarush and David')
    expect(email.html).toContain('CMU startup ecosystem')
  })
})
