import Header from "components/Header";
import Footer from "app/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <main className="mt-[200px] flex flex-col items-center justify-start flex-grow w-full h-full">
        {children}
      </main>
      <Footer />
      <div id="destination" />
    </div>
  );
}
