import { Metadata } from "next"

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function ManageGigsLayout({ children }: SettingsLayoutProps) {
    return (
        <div className="block space-y-6 pb-16 pt-32 p-12">
            {children}
        </div>
    )
}
