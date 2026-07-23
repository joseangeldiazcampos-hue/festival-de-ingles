/**
 * Email utility using Nodemailer + Gmail SMTP
 *
 * Required environment variables:
 *   GMAIL_USER        → your Gmail address (e.g. joseangeldiazcampos@gmail.com)
 *   GMAIL_APP_PASSWORD → 16-char Google App Password (not your normal password)
 *   ADMIN_EMAIL       → recipient of quiz result notifications
 */

import nodemailer from "nodemailer";

interface QuizResultEmailParams {
  countryName: string;
  studentName?: string;
  correct: number;
  incorrect: number;
  total: number;
  isPerfect: boolean;
  submittedAt: Date;
}

function getResultLabel(correct: number, total: number): string {
  const percentage = (correct / total) * 100;
  if (percentage === 100) return "⭐ PERFECT SCORE";
  if (percentage >= 90) return "🏆 Excellent";
  if (percentage >= 70) return "✅ Passed";
  if (percentage >= 50) return "⚠️ Needs Improvement";
  return "❌ Failed";
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Sends a quiz result notification email to the admin.
 */
export async function sendQuizResultEmail(params: QuizResultEmailParams): Promise<void> {
  const { countryName, studentName, correct, incorrect, total, isPerfect, submittedAt } = params;

  // Format date and time
  const date = submittedAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Mexico_City",
  });
  const time = submittedAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Mexico_City",
  });

  const percentage = Math.round((correct / total) * 100);
  const resultLabel = getResultLabel(correct, total);
  const nameDisplay = studentName || "Anonymous Student";

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .card { background: white; border-radius: 12px; padding: 30px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 24px; }
    .title { font-size: 22px; font-weight: bold; color: #1a1a2e; margin: 0; }
    .subtitle { font-size: 13px; color: #666; margin: 4px 0 0; }
    .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; margin: 10px 0; }
    .label { color: #555; font-size: 14px; }
    .value { font-weight: bold; color: #1a1a2e; font-size: 14px; }
    .result-box { background: #f0f7ff; border-radius: 8px; padding: 16px; text-align: center; margin-top: 20px; }
    .result-label { font-size: 20px; font-weight: bold; color: #1565c0; }
    .score { font-size: 32px; font-weight: bold; color: #1a1a2e; }
    .perfect { background: #fff8e1; }
    .perfect .result-label { color: #f57f17; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <p class="title">🎓 Quiz Result Notification</p>
      <p class="subtitle">Violence Is Never The Answer – English Festival</p>
    </div>
    <hr class="divider" />
    <div class="row">
      <span class="label">Student Name</span>
      <span class="value">${nameDisplay}</span>
    </div>
    <div class="row">
      <span class="label">Country</span>
      <span class="value">${countryName}</span>
    </div>
    <div class="row">
      <span class="label">Date</span>
      <span class="value">${date}</span>
    </div>
    <div class="row">
      <span class="label">Time</span>
      <span class="value">${time}</span>
    </div>
    <div class="row">
      <span class="label">Correct Answers</span>
      <span class="value">${correct} / ${total}</span>
    </div>
    <div class="row">
      <span class="label">Incorrect Answers</span>
      <span class="value">${incorrect} / ${total}</span>
    </div>
    <hr class="divider" />
    <div class="result-box ${isPerfect ? "perfect" : ""}">
      <div class="score">${percentage}%</div>
      <div class="result-label">${resultLabel}</div>
    </div>
  </div>
</body>
</html>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"English Festival Quiz" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
    subject: `[Quiz Result] ${nameDisplay} (${countryName}) – ${date} ${time}`,
    html: htmlBody,
    text: `
Student Name: ${nameDisplay}
Country: ${countryName}
Date: ${date}
Time: ${time}
Correct Answers: ${correct}/${total}
Incorrect Answers: ${incorrect}/${total}
Score: ${percentage}%
Result: ${resultLabel}
    `.trim(),
  });
}
