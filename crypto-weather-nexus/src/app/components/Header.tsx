export default function Header() {
    return (
      <header className="flex justify-between items-center bg-white shadow-md py-4 px-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600">📅 {new Date().toDateString()}</p>
      </header>
    );
  }
  