const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)
const sendVerificationMail = async (email, token) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: 'IBBU Clearance System',
        },
        To: [
          {
            Email: email,
            Name: 'User',
          },
        ],
        Subject: 'Email Verification',
        TextPart: `Your verification code is: ${token}`,
        HTMLPart: `<p>Your verification code is: <strong>${token}</strong></p>`
      },
    ],
  });

  try {
    const result = await request;
    console.log('Verification email sent:', result.body);
  } catch (error) {
    console.error('Error sending verification email:', error.statusCode, error.message);
  }
};

module.exports = {
  sendVerificationMail
};



// const request = mailjet.post('send', { version: 'v3.1' }).request({
//   Messages: [
//     {
//       From: {
//         Email: '$SENDER_EMAIL',
//         Name: 'IBBU clearance system',
//       },
//       To: [
//         {
//           Email: '$RECIPIENT_EMAIL',
//           Name: 'You',
//         },
//       ],
//       Subject: 'My first Mailjet Email!',
//       TextPart: 'Greetings from Mailjet!',
//       HTMLPart:
//         '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
//     },
//   ],
// })
// request
//   .then(result => {
//     console.log(result.body)
//   })
//   .catch(err => {
//     console.log(err.statusCode)
//   })



// const sendTwoFactorEmail = async (email, token) => {
//   try {
//     await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: 'Confirmation Code',
//       html: `<p>Your confirmation code: ${token}</p>`
//     });
//   } catch (error) {
//     console.error('Error sending two-factor email:', error);
//     throw error;
//   }
// };

// const sendPasswordResetEmail = async (email, token) => {
//   const resetLink = `${domain}/auth/new-password?token=${token}`;

//   try {
//     await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: 'Reset your password',
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
//     });
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     throw error;
//   }
// };

// const sendVerificationMail = async (email, token) => {
//   const confirmLink = `${domain}/auth/new-verification?token=${token}`;

//   try {
//     await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: 'Confirm your email',
//       html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`
//     });
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error;
//   }
// };

// const sendVerificationMail = async (email, token) => {
//   const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

//   const request = mailjet.post('send', { version: 'v3.1' }).request({
//     Messages: [
//       {
//         From: {
//           Email: process.env.SENDER_EMAIL,
//           Name: 'IBBU Clearance System'
//         },
//         To: [
//           {
//             Email: email,
//             Name: 'User'
//           }
//         ],
//         Subject: 'Confirm your email',
//         HTMLPart: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`
//       }
//     ]
//   });

//   try {
//     const result = await request;
//     console.log('Verification email sent:', result.body);
//   } catch (err) {
//     console.error('Error sending verification email:', err.statusCode, err.message);
//   }
// };

