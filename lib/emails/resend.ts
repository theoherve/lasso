import { Resend } from "resend"

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = process.env.RESEND_FROM_EMAIL ?? "Lasso <noreply@lasso.paris>"

export async function sendBookingConfirmation({
  to,
  firstName,
  missionTitle,
  date,
  address,
}: {
  to: string
  firstName: string
  missionTitle: string
  date: string
  address: string | null
}) {
  if (!resend) {
    console.log("[EMAIL] Resend not configured, skipping booking confirmation to", to)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Reservation confirmee — ${missionTitle}`,
    html: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="color: #C4622D; font-size: 24px; margin-bottom: 8px;">C'est reserve !</h1>
        <p>Salut ${firstName},</p>
        <p>Ta reservation pour <strong>${missionTitle}</strong> est confirmee.</p>
        <div style="background: #FAF7F2; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Date :</strong> ${date}</p>
          ${address ? `<p style="margin: 4px 0;"><strong>Lieu :</strong> ${address}</p>` : ""}
        </div>
        <p>Tu recevras un rappel avant ta mission. Pense a prevenir si tu ne peux plus venir.</p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">Lasso — Benevolat ponctuel a Paris</p>
      </div>
    `,
  })
}

export async function sendBookingReminder({
  to,
  firstName,
  missionTitle,
  date,
  address,
  hoursLeft,
}: {
  to: string
  firstName: string
  missionTitle: string
  date: string
  address: string | null
  hoursLeft: number
}) {
  if (!resend) {
    console.log("[EMAIL] Resend not configured, skipping reminder to", to)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Rappel — ${missionTitle} dans ${hoursLeft}h`,
    html: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="color: #C4622D; font-size: 24px; margin-bottom: 8px;">Rappel mission</h1>
        <p>Salut ${firstName},</p>
        <p>Ta mission <strong>${missionTitle}</strong> a lieu dans <strong>${hoursLeft} heure${hoursLeft > 1 ? "s" : ""}</strong>.</p>
        <div style="background: #FAF7F2; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Date :</strong> ${date}</p>
          ${address ? `<p style="margin: 4px 0;"><strong>Lieu :</strong> ${address}</p>` : ""}
        </div>
        <p>A tout a l'heure !</p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">Lasso — Benevolat ponctuel a Paris</p>
      </div>
    `,
  })
}
