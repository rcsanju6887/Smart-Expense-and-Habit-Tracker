export const metadata = {
  title: 'SmartExpense & Habit Tracker',
  description: 'Track expenses and build habits - Byte_Builders',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}