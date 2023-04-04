import AptosConnect from "./AptosConnect";

export default function NavBar() {
  return (
    <nav className="navbar py-4 px-4">
      <div className="flex-1">
        <a href="https://movebit.xyz/" target="_blank">
          <img src="/logo.png" width={169} height={35} alt="logo" />
        </a>
      </div>
      <AptosConnect />
    </nav>
  );
}
