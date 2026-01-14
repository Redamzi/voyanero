export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Help Center</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Safety info</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Community</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Forum</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Hosting</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Voyanero your home</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Hosting resources</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">About</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Newsroom</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Investors</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
                    <p className="text-base text-gray-400">&copy; 2026 Voyanero, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
