import type { Metadata } from 'next'
import './globals.css'
import { ProposalProvider } from '@/components/context/proposalContext'

// export const metadata: Metadata = {
//   title: 'v0 App',
//   description: 'Created with v0',
//   generator: 'v0.dev',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
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
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ProposalProvider>
          {children}
        </ProposalProvider>
      </body>
    </html>
  )
}
