const EXAMPLES = {
  phishing: `Subject: URGENT: Your account has been suspended

Dear Customer,

We have detected suspicious activity on your account. Your online banking access has been temporarily suspended for your protection.

To restore access immediately, you MUST verify your identity within 24 hours or your account will be permanently closed.

Click here to verify now: http://secure-bankverify.net/restore-access?token=xK92mP

You will need to provide:
- Full name and date of birth
- Account number and sort code
- Online banking password
- One-time passcode from your card reader

IMPORTANT: Failure to verify within 24 hours will result in permanent account closure and possible legal action.

Security Team
National Bank Support`,

  lottery: `CONGRATULATIONS!!!

You have been selected as the GRAND PRIZE WINNER of the International Online Lottery 2024!

Prize Amount: $1,500,000 USD (One Million Five Hundred Thousand US Dollars)

Your email was randomly selected from over 50 million email addresses worldwide. Your winning ticket number is: LTY-2024-88472-X

To claim your prize you must:
1. Pay a one-time processing fee of $299 USD
2. Send your full name, home address, phone number, and bank account details to: claims@intl-lottery-winner.com
3. Keep this notification STRICTLY CONFIDENTIAL

You have 72 hours to respond or your prize will be forfeited to another winner.

Mr. James Williams
International Lottery Claims Department`,

  delivery: `[USPS] Your package #US9514901185421 delivery attempt failed.

Customs clearance required. A small fee of $2.99 must be paid to release your shipment.

Package details:
- Tracking: US9514901185421
- Weight: 1.2 kg
- Status: HELD AT CUSTOMS

Pay the release fee now to avoid return shipment:
http://usps-customs-clearance.com/pay?id=US9514901185421

Payment must be completed within 48 hours. After this period your package will be returned to sender and you may be charged a $35 return fee.

USPS Delivery Services`,

  legit: `Hi Marcus,

Just following up on our call earlier today. I've attached the Q3 budget spreadsheet you asked for — let me know if the figures look right to you.

Also, the team sync tomorrow is moved to 3pm instead of 2pm. Same meeting link as usual.

Let me know if you need anything else before the review on Friday.

Best,
Priya

—
Priya Sharma | Senior Analyst
priya.sharma@company.com | Ext. 4821`
};

document.querySelectorAll('[data-example]').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-example');
    if (EXAMPLES[key]) {
      const ta = document.getElementById('msg-input');
      ta.value = EXAMPLES[key];
      ta.dispatchEvent(new Event('input'));
      ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
