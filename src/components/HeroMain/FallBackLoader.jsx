import { Html } from "@react-three/drei";

export default function FallBackLoader() {
    return (
      <Html center>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-white">Loading...</span>
        </div>
      </Html>
    );
  }