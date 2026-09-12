import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, code: string) {
    await resend.emails.send({
        from: "Naturale <onboarding@resend.dev>",
        to,
        subject: "Redefinição de senha - Naturale",
        html: `
            <p>Você solicitou a redefinição da sua senha no Naturale.</p>
            <p>Use o código abaixo no app para criar uma nova senha. Ele expira em 15 minutos:</p>
            <h2>${code}</h2>
            <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
        `,
    });
}
