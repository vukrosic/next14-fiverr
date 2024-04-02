import { SellerNavbar } from "./_components/seller-navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const SellerLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <main className="h-full">
            <SellerNavbar />
            {children}
        </main>
    );
}

export default SellerLayout;