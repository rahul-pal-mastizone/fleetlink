import Header from '../components/Header.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
    </div>
  )
}
