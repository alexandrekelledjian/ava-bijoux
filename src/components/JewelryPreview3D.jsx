import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// Necklace Pendant Component
function NecklacePendant({ text, font, color }) {
  const meshRef = useRef()
  const chainRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const materialColor = useMemo(() => {
    const colors = {
      gold: '#d4af37',
      silver: '#c0c0c0',
      rose: '#e8c4c4',
    }
    return colors[color] || colors.gold
  }, [color])

  const fontFamily = useMemo(() => {
    const fonts = {
      elegant: '/fonts/CormorantGaramond-Regular.ttf',
      script: '/fonts/DancingScript-Regular.ttf',
      modern: '/fonts/Montserrat-Regular.ttf',
      classic: '/fonts/PlayfairDisplay-Regular.ttf',
    }
    return fonts[font] || fonts.elegant
  }, [font])

  return (
    <group ref={meshRef}>
      {/* Chain */}
      <group ref={chainRef}>
        {/* Simple chain representation */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[1.2, 0.02, 8, 100, Math.PI]} />
          <meshStandardMaterial color={materialColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Pendant Plate */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 0.08]} />
        <meshStandardMaterial
          color={materialColor}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Engraved Text */}
      {text && (
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.18}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
        >
          {text}
        </Text>
      )}

      {/* Bail (connection to chain) */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color={materialColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Heart Pendant Component
function HeartPendant({ text, font, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  const materialColor = useMemo(() => {
    const colors = {
      gold: '#d4af37',
      silver: '#c0c0c0',
      rose: '#e8c4c4',
    }
    return colors[color] || colors.rose
  }, [color])

  // Heart shape
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0, y = 0
    shape.moveTo(x, y + 0.35)
    shape.bezierCurveTo(x, y + 0.35, x - 0.05, y + 0.5, x - 0.25, y + 0.5)
    shape.bezierCurveTo(x - 0.55, y + 0.5, x - 0.55, y + 0.25, x - 0.55, y + 0.25)
    shape.bezierCurveTo(x - 0.55, y, x - 0.35, y - 0.22, x, y - 0.5)
    shape.bezierCurveTo(x + 0.35, y - 0.22, x + 0.55, y, x + 0.55, y + 0.25)
    shape.bezierCurveTo(x + 0.55, y + 0.25, x + 0.55, y + 0.5, x + 0.25, y + 0.5)
    shape.bezierCurveTo(x + 0.05, y + 0.5, x, y + 0.35, x, y + 0.35)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }

  return (
    <group ref={meshRef}>
      {/* Chain */}
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[1, 0.02, 8, 100, Math.PI]} />
        <meshStandardMaterial color={materialColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Heart */}
      <mesh position={[0, 0, -0.04]} castShadow>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial
          color={materialColor}
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1}
        />
      </mesh>

      {/* Text */}
      {text && (
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.12}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
        >
          {text}
        </Text>
      )}

      {/* Bail */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color={materialColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Bracelet Component
function Bracelet({ text, font, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const materialColor = useMemo(() => {
    const colors = {
      gold: '#d4af37',
      silver: '#c0c0c0',
      rose: '#e8c4c4',
    }
    return colors[color] || colors.gold
  }, [color])

  return (
    <group ref={meshRef}>
      {/* Bangle/Cuff */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1, 0.15, 16, 100, Math.PI * 1.7]} />
        <meshStandardMaterial
          color={materialColor}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Engraving plate */}
      <mesh position={[0, 0, 1.05]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.05]} />
        <meshStandardMaterial
          color={materialColor}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Text on plate */}
      {text && (
        <Text
          position={[0, 0, 1.1]}
          fontSize={0.1}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.75}
        >
          {text}
        </Text>
      )}
    </group>
  )
}

// Main 3D Preview Component
export default function JewelryPreview3D({ productType, text, font, color }) {
  const JewelryComponent = useMemo(() => {
    if (productType?.includes('coeur') || productType?.includes('medaillon')) {
      return HeartPendant
    }
    if (productType?.includes('bracelet') || productType?.includes('jonc')) {
      return Bracelet
    }
    return NecklacePendant
  }, [productType])

  return (
    <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[-5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
        />

        {/* Jewelry */}
        <JewelryComponent text={text} font={font} color={color} />

        {/* Environment & Controls */}
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">
        🖱️ Glissez pour faire pivoter • Scrollez pour zoomer
      </div>
    </div>
  )
}
