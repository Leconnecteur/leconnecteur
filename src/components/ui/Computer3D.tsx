'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { Vector3, Group } from 'three';

function Model(props: { scale?: number[] }) {
  const group = useRef<Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      const time = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(time * 0.2) * 0.15;
      group.current.rotation.x = Math.sin(time * 0.15) * 0.05;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Base of laptop */}
      <mesh 
        castShadow 
        receiveShadow 
        position={[0, -0.15, 0]} 
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Screen of laptop */}
      <group position={[0, 0.6, -0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1.2, 0.05]} />
          <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Screen content */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.9, 1.1]} />
          <meshBasicMaterial color="#1e40af" />
        </mesh>
        
        {/* Website mockup on screen */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.85, 1.05]} />
          <meshBasicMaterial color="white" />
        </mesh>
        
        {/* Header bar */}
        <mesh position={[0, 0.45, 0.05]}>
          <planeGeometry args={[1.85, 0.15]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        
        {/* Content blocks - simplified for mobile */}
        <mesh position={[-0.5, 0.1, 0.05]}>
          <planeGeometry args={[0.8, 0.6]} />
          <meshBasicMaterial color="#f1f5f9" />
        </mesh>
        
        <mesh position={[0.6, 0.1, 0.05]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial color="#f1f5f9" />
        </mesh>
        
        <mesh position={[0, -0.35, 0.05]}>
          <planeGeometry args={[1.7, 0.2]} />
          <meshBasicMaterial color="#f1f5f9" />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, -0.09, 0.3]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Computer3D() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="h-[400px] w-full bg-gray-900/20 rounded-lg"></div>;
  }

  return (
    <div className={`w-full ${isMobile ? 'h-[250px]' : 'h-[400px]'}`}>
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ 
          position: new Vector3(0, isMobile ? 1.5 : 1, isMobile ? 4 : 5), 
          fov: isMobile ? 60 : 50 
        }}
        gl={{ 
          antialias: true,  
          powerPreference: "high-performance" 
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        
        <Model 
          position={[0, isMobile ? -0.8 : -1, 0]} 
          scale={[isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8]} 
        />
        
        <ContactShadows 
          rotation-x={Math.PI / 2}
          position={[0, -1.6, 0]}
          opacity={0.6}
          width={10}
          height={10}
          blur={1.5}
          far={1.6}
        />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>
    </div>
  );
}
