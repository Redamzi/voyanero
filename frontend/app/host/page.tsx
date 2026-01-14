import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HostPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-24 px-4 max-w-7xl mx-auto w-full">
                <div className="text-center py-20">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Become a Host</h1>
                    <p className="text-xl text-gray-600 mb-8">Earn money by sharing your space with travelers.</p>
                    <div className="bg-rose-50 p-8 rounded-2xl max-w-2xl mx-auto border border-rose-100">
                        <h2 className="text-2xl font-semibold mb-4 text-rose-600">Coming Soon</h2>
                        <p className="text-gray-700">We are currently building the host onboarding experience.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
