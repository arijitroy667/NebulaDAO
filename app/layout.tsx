import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html>
//       <body>
//         <ProposalProvider>
//           {children}
//         </ProposalProvider>
//       </body>
//     </html>
//   )
// }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
<<<<<<< Updated upstream
      <body>{children}</body>
=======
      <body className="min-h-screen w-full m-0 p-0">
        {children}
      </body>
>>>>>>> Stashed changes
    </html>
  )
}