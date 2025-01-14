import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  console.log('Received order submission request');
  const { items } = await req.json()
  console.log('Order items:', items);

  // Get the auth token from cookies
  const cookieStore = await cookies()
  const authToken = cookieStore.get('authToken')?.value
  console.log('Auth token:', authToken); // Log the auth token

  let username = 'Guest'

  if (authToken) {
    try {
      // Fetch user data from your authentication API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('Auth API response status:', response.status); // Log the response status

      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData); // Log the entire user data object
        username = userData.user?.username || 'Guest';
        console.log('Username:', username); // Log the extracted username
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch user data. Status:', response.status, 'Error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    console.log('No auth token found in cookies');
  }

  // Create a transporter using SMTP
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Generate the email content
  const totalPrice = items.reduce((total: number, item: any) => {
    const itemPrice = typeof item.article.prix === 'number' ? item.article.prix : 0;
    return total + itemPrice * item.quantity;
  }, 0);

  const emailContent = `
    <h1>Confirmation de commande</h1>
    <p>Merci pour votre commande, ${username}. Voici un récapitulatif :</p>
    <ul>
      ${items.map((item: any) => `
        <li>
          ${item.article.nom} - Quantité: ${item.quantity} - Prix: ${(Number(item.article.prix) * item.quantity).toFixed(2)} TND
        </li>
      `).join('')}
    </ul>
    <p><strong>Total : ${Number(totalPrice.toFixed(2))} TND</strong></p>
  `

  try {
    console.log('Attempting to send email');
    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to the same email for now
      subject: 'Nouvelle commande',
      html: emailContent,
    })
    console.log('Email sent successfully');

    return NextResponse.json({ message: 'Order submitted successfully', username }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to submit order', details: error.message }, { status: 500 })
  }
}

