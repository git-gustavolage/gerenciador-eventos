import Navbar from "./Common/Navbar";

export default function AuthenticatedLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main>{children}</main>
        </div>
    );
}
