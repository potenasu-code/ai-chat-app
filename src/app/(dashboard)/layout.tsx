import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardRayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-full">
        <div className="hidden lg:w-1/4 lg:block"><Sidebar /></div>
        <main className="bg-blue-300 w-full lg:w-3/4">
          <div className="flex flex-col h-full">
            <Navbar />
            {children}
          </div>
        </main>
      </div>
    );
  }
  