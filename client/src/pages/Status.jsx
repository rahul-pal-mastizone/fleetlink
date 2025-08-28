import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'

export default function Status() {
  const [ping, setPing] = useState('…')
  useEffect(() => {
    fetch('/api/ping').then(r=>r.json()).then(d=>setPing(d.message || 'ok')).catch(()=>setPing('error'))
  }, [])

  return (
    <Layout>
      <section className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold mb-2">System Status</h2>
        <p className="text-slate-300">API ping: <span className="font-mono">{ping}</span></p>
      </section>
    </Layout>
  )
}
