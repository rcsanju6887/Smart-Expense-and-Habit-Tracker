/*This is the homepage. As soon as someone visits localhost:3000, this file runs and immediately sends them to /login. It's just a redirect.*/
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}