import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ✅ توليد رمز OTP عشوائي 6 أرقام
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ✅ إرسال إيميل التحقق
export async function sendVerificationEmail(
  email: string,
  otp: string,
  name: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: email,
      subject: '🔐 رمز التحقق — SAAIT Platform',
      html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
        
        <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

          <!-- ✦ Header -->
          <div style="text-align:center;margin-bottom:36px;">
            <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);
                        display:inline-block;padding:14px 36px;
                        border-radius:18px;margin-bottom:10px;">
              <span style="color:white;font-size:26px;font-weight:900;
                           letter-spacing:4px;">⚡ SAAIT</span>
            </div>
            <div>
              <span style="color:#8b5cf6;font-size:11px;
                           letter-spacing:6px;text-transform:uppercase;">
                AI PLATFORM
              </span>
            </div>
          </div>

          <!-- ✦ Main Card -->
          <div style="background:#1a1a2e;
                      border:1px solid rgba(124,58,237,0.3);
                      border-radius:24px;padding:40px;
                      box-shadow:0 0 60px rgba(124,58,237,0.15);">

            <!-- AI Icon -->
            <div style="text-align:center;margin-bottom:28px;">
              <div style="width:88px;height:88px;
                          background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.2));
                          border:2px solid rgba(103, 25, 238, 0.57);
                          border-radius:50%;display:inline-flex;
                          align-items:center;justify-content:center;
                          font-size:40px;
                          box-shadow:0 0 30px rgba(124,58,237,0.3);">
                🤖
              </div>
            </div>

            <!-- Title -->
            <h2 style="color:white;text-align:center;
                       font-size:22px;font-weight:700;
                       margin:0 0 8px 0;">
              مرحباً ${name}! 👋
            </h2>
            <p style="color:#9ca3af;text-align:center;
                      font-size:14px;line-height:1.7;margin:0 0 32px 0;">
              استخدم رمز التحقق أدناه لتفعيل حسابك في SAAIT Platform
            </p>

            <!-- OTP Box -->
            <div style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,70,229,0.1));
                        border:2px solid #7c3aed;border-radius:18px;
                        padding:28px;text-align:center;margin-bottom:28px;">
              <p style="color:#a78bfa;font-size:11px;letter-spacing:4px;
                        text-transform:uppercase;margin:0 0 14px 0;">
                رمز التحقق الخاص بك
              </p>
              <div style="letter-spacing:14px;font-size:46px;font-weight:900;
                          color:white;font-family:monospace;
                          text-shadow:0 0 20px rgba(139,92,246,0.8);">
                ${otp}
              </div>
              <div style="margin-top:14px;display:inline-block;
                          background:rgba(124,58,237,0.2);
                          border:1px solid rgba(124,58,237,0.4);
                          border-radius:20px;padding:6px 16px;">
                <span style="color:#c4b5fd;font-size:12px;">
                  ⏱️ صالح لمدة 10 دقائق فقط
                </span>
              </div>
            </div>

            <!-- Steps -->
            <div style="background:rgba(255,255,255,0.03);
                        border-radius:14px;padding:20px;margin-bottom:24px;">
              <p style="color:#6b7280;font-size:12px;margin:0 0 10px 0;
                        text-align:center;">كيفية الاستخدام</p>
              <div style="color:#d1d5db;font-size:13px;line-height:2;">
                <div>1️⃣ &nbsp;ارجع إلى صفحة التحقق</div>
                <div>2️⃣ &nbsp;أدخل الرمز في الخانات</div>
                <div>3️⃣ &nbsp;انضم لمجتمع SAAIT 🚀</div>
              </div>
            </div>

            <!-- Warning -->
            <div style="background:rgba(239,68,68,0.08);
                        border:1px solid rgba(239,68,68,0.25);
                        border-radius:12px;padding:14px;">
              <p style="color:#fca5a5;font-size:12px;
                        text-align:center;margin:0;line-height:1.6;">
                🔒 لا تشارك هذا الرمز مع أي شخص<br>
                فريق SAAIT لن يطلبه منك أبداً
              </p>
            </div>

          </div>

          <!-- ✦ Footer -->
          <div style="text-align:center;margin-top:28px;">
            <p style="color:#374151;font-size:11px;line-height:1.8;margin:0 0 8px 0;">
              تم الإرسال تلقائياً — إذا لم تطلب هذا يمكنك تجاهل الرسالة
            </p>
            <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);
                        -webkit-background-clip:text;
                        display:inline-block;">
              <span style="color:#7c3aed;font-size:11px;
                           letter-spacing:3px;font-weight:700;">
                POWERED BY AI ⚡
              </span>
            </div>
          </div>

        </div>
      </body>
      </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: err }
  }
}