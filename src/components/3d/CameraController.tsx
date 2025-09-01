import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../../store-simple';
import * as THREE from 'three';

const CameraController = () => {
  const { camera } = useThree();
  const { cameraTarget, setCameraTarget } = useStore();
  const startPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const endPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const endTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const isMoving = useRef(false);
  const progress = useRef(0);
  const duration = 0.8;

  useEffect(() => {
    if (cameraTarget) {
      // Desabilitar OrbitControls durante animação
      const orbitControls = (window as any).orbitControls;
      if (orbitControls) {
        orbitControls.enabled = false;
      }
      
      // Capturar posição inicial da câmera
      startPosition.current.copy(camera.position);
      endPosition.current.set(...cameraTarget.position);
      
      // Capturar target inicial dos OrbitControls se disponível
      if (orbitControls && orbitControls.target) {
        startTarget.current.copy(orbitControls.target);
      } else {
        // Fallback: calcular direção atual
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        startTarget.current.copy(camera.position).add(direction.multiplyScalar(10));
      }
      endTarget.current.set(...cameraTarget.target);
      
      // Iniciar animação
      isMoving.current = true;
      progress.current = 0;
      
      console.log('🎥 Animação iniciada - OrbitControls desabilitado');
    }
  }, [cameraTarget, camera]);

  useFrame((_, delta) => {
    if (isMoving.current && progress.current < 1) {
      progress.current += delta / duration;
      
      if (progress.current >= 1) {
        progress.current = 1;
        isMoving.current = false;
        
        // Finalização suave: atualizar OrbitControls com nova posição
        const orbitControls = (window as any).orbitControls;
        if (orbitControls) {
          // Definir posição final
          camera.position.copy(endPosition.current);
          orbitControls.target.copy(endTarget.current);
          
          // Atualizar controles e reabilitar
          orbitControls.update();
          orbitControls.enabled = true;
        }
        
        // Limpar estado
        setTimeout(() => {
          setCameraTarget(null);
          console.log('🎥 Animação concluída - OrbitControls reabilitado');
        }, 50);
        
        return; // Sair early para evitar interpolação extra
      }
      
      // Interpolação suave usando easing
      const t = progress.current < 0.5 
        ? 2 * progress.current * progress.current 
        : 1 - Math.pow(-2 * progress.current + 2, 2) / 2;
      
      // Interpolar posição da câmera
      const newPosition = new THREE.Vector3().lerpVectors(
        startPosition.current,
        endPosition.current,
        t
      );
      
      // Interpolar target da câmera
      const newTarget = new THREE.Vector3().lerpVectors(
        startTarget.current,
        endTarget.current,
        t
      );
      
      // Aplicar nova posição e target
      camera.position.copy(newPosition);
      camera.lookAt(newTarget);
    }
  });

  return null;
};

export default CameraController;
