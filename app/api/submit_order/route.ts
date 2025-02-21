import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  console.log('Received order submission request');
  const { items } = await req.json()
  console.log('Order items:', items);

  let username = 'Khalil Sfaxi';
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string) as { userId: string, email: string, username: string };
      username = decoded.username;
      console.log('Authenticated user:', username);
    } catch (error) {
      console.error('Error decoding auth token:', error);
    }
  } else {
    console.log('No auth token found in cookies');
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const totalPrice = items.reduce((total: number, item: any) => {
    const itemPrice = typeof item.article.prix === 'number' ? item.article.prix : 0;
    return total + item.article.prix*1.19 * item.quantity;
  }, 0);

  const emailContent = `
    <h1>Confirmation de commande</h1>
    <p>Merci pour votre commande, ${username}. Voici un récapitulatif :</p>
    <ul>
      ${items.map((item: any) => `
        <li>
          ${item.article.name} - Quantité: ${item.quantity} - Prix: ${(Number(item.article.prix*1.19) * item.quantity).toFixed(2)} TND
        </li>
      `).join('')}
    </ul>
    <p><strong>Total : ${Number(totalPrice.toFixed(2))} TND</strong></p>
  `

  try {
    console.log('Attempting to send email to:', process.env.EMAIL_USER);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Nouvelle commande',
      html: emailContent,
    });

    console.log('Email sent successfully');
    return NextResponse.json({ message: 'Order submitted successfully', username }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to submit order', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

