import Header, { HEADER_HEIGHT } from "components/Header";

export default function Layout({ children }) {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <main
        style={{ marginTop: `${HEADER_HEIGHT}px`, height: "max-content" }}
        className="flex flex-col items-center justify-start flex-grow w-full h-full"
      >
        {children}
      </main>
    </div>
  );
}
