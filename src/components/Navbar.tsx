import { ConnectButton } from "@rainbow-me/rainbowkit";

import orbitgoLogo from "../assets/orbit_go.svg";
import { Link } from "@tanstack/react-router";

function Navbar() {
  return (
    <div className="bg-white shadow-md fixed w-full z-[9999]">
      <div className="mx-auto px-6 py-2 flex justify-between items-center">
        <Link
          to="/dashboard"
          className="flex justify-center flex-row items-center"
        >
          <img src={orbitgoLogo} alt="OrbitGO Logo" className="w-16" />
          <div
            className="text-md font-bold"
            style={{
              color: "#3B82F6",
            }}
          >
            Orbit GO
          </div>
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
