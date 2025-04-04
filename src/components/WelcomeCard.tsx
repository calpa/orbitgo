import React from "react";
import { Address } from "viem";

interface WelcomeCardProps {
  address: Address;
}

function WelcomeCard(props: WelcomeCardProps) {
  const { address } = props;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100 transform transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Your Treasury
          </h2>
          <p className="text-gray-600">
            Connected with address:{" "}
            <span className="font-mono text-sm bg-blue-50 p-1.5 rounded border border-blue-100">
              {address?.slice(0, 4)}...{address?.slice(-4)}
            </span>
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full opacity-80 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
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
                  points="392.07,1277.38 392.07,956.52 -0,724.89"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
