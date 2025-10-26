export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Alex Guo. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Code Educator & Innovation Leader
          </p>
        </div>
      </div>
    </footer>
  )
}
