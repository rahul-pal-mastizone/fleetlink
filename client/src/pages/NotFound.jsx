export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
        <a className="inline-block mt-4 text-blue-600 underline" href="/">Go home</a>
      </div>
    </div>
  )
}
