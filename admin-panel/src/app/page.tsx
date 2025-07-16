export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">MT5 CRM Admin Panel</h1>
        <p className="text-lg mb-4">Welcome to the administration dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Trading Accounts</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Active Trades</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
