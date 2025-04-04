import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 784.37 1277.39"
            >
              <g>
                <polygon
                  fill="currentColor"
                  fillRule="nonzero"
                  points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                />
                <polygon
                  fill="currentColor"
                  fillRule="nonzero"
                  points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                />
                <polygon
                  fill="currentColor"
                  fillRule="nonzero"
                  points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                />
                <polygon
                  fill="currentColor"
                  fillRule="nonzero"
                  points="392.07,956.52 0,724.89 392.07,1277.38 392.07,962.41"
                />
              </g>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Treasury Management
          </h1>
        </div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
