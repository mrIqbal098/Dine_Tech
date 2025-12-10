"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Maximize2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Model3DViewerProps {
  modelUrl?: string;
  dishName: string;
  thumbnailUrl?: string | null;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function FallbackModel() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#ff6b35" roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

class ModelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    // Error caught and handled
  }

  render() {
    if (this.state.hasError) {
      return <FallbackModel />;
    }
    return this.props.children;
  }
}

export default function Model3DViewer({ modelUrl, dishName, thumbnailUrl }: Model3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasValidModel = modelUrl && !modelUrl.includes("cdn.example.com");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const proxiedUrl = modelUrl ? `${apiBaseUrl}/api/proxy?url=${encodeURIComponent(modelUrl)}` : undefined;

  return (
    <>
      {/* Thumbnail View: show the dish image (thumbnail). Open fullscreen to view 3D model. */}
      <div className="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden group">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={dishName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FallbackModel />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="w-4 h-4" />
          View in 3D
        </Button>

        {!hasValidModel && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium">
            Preview Model
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          >
            <div className="absolute inset-0">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <spotLight position={[-10, 10, 5]} intensity={0.5} />
                <Suspense fallback={<FallbackModel />}>
                  {hasValidModel && proxiedUrl ? (
                    <ModelErrorBoundary>
                      <Model url={proxiedUrl} />
                    </ModelErrorBoundary>
                  ) : (
                    <FallbackModel />
                  )}
                  <Environment preset="studio" />
                </Suspense>
                <OrbitControls
                  enableZoom={true}
                  autoRotate
                  autoRotateSpeed={1}
                  enablePan={true}
                />
              </Canvas>
            </div>

            <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div>
                  <h3 className="text-2xl font-bold text-white">{dishName}</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    Drag to rotate • Scroll to zoom • Right-click to pan
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0">
              <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <p className="text-white text-center text-sm">
                    {hasValidModel
                      ? "Interactive 3D Model • Explore from every angle"
                      : "Preview Model • Upload your GLB file for interactive 3D view"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
