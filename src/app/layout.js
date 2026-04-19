import "./globals.css";
import Navbar from "./Component/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
