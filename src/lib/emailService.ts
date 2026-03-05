import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function sendReceiptEmail(
    toEmail: string,
    customerName: string,
    productName: string,
    downloadUrl: string
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Mocking email send to:", toEmail);
        console.log(`Email content -> Product: ${productName}, Link: ${downloadUrl}`);
        return { success: true, mocked: true };
    }

    try {
        const data = await resend.emails.send({
            from: 'Pranav Kashyap <hello@pranavkashyap.com>', // Update this to verified domain when live
            to: [toEmail],
            subject: `Your Receipt & Download Link: ${productName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Your Purchase!</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hi <strong>${customerName}</strong>,</p>
            <p style="font-size: 16px;">Your payment for <strong>${productName}</strong> was successful. We’re excited for you to start using it!</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" style="background: #a855f7; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Download Your Product
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #6366f1; word-break: break-all;">${downloadUrl}</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            
            <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">Best regards,</p>
            <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">Pranav Kashyap</p>
          </div>
        </div>
      `,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send receipt email:", error);
        return { success: false, error };
    }
}
