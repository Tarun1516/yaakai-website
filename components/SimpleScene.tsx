"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { OrbitControls, Box, Sphere } from "@react-three/drei"

export default function SimpleScene() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Box args={[1, 1, 1]} position={[-1.5, 0, 0]}>
            <meshStandardMaterial color="#0066cc" />
          </Box>
          <Sphere args={[0.75, 32, 32]} position={[1.5, 0, 0]}>
            <meshStandardMaterial color="#f59f0a" />
          </Sphere>
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
