// import { Proposals } from "@/components/proposals"
// import { ProposalList } from "@/components/ProposalList"

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       <div className="container mx-auto px-4 py-8">
//         <Proposals />
//         <ProposalList />
//       </div>
//     </main>
//   )
// }


// import { Proposals } from "@/components/proposals"
// import { ProposalList } from "@/components/ProposalList"
// import { ProposalProvider } from "@/components/contexts/proposalContext"

// export default function Home() {
//   return (
//     <ProposalProvider>
//       <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//         <div className="container mx-auto px-4 py-8">
//           <Proposals />
//           <ProposalList />
//         </div>
//       </main>
//     </ProposalProvider>
//   )
// }

"use client"
import ProposalList from "@/components/ProposalList"
import { Proposals } from "@/components/proposals"

import { ProposalProvider } from "@/components/contexts/proposalContext"

export default function Home() {
  return (
    <ProposalProvider>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Proposals />
          <ProposalList />
        </div>
      </main>
    </ProposalProvider>
  )
}