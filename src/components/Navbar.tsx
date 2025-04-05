import { ConnectButton } from "@rainbow-me/rainbowkit";

import orbit_go from "../assets/orbit_go.png";

function Navbar() {
  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={orbit_go} alt="OrbitGO" className="w-full h-10" />
        </div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
