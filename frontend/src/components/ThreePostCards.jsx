import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Html,
  Stars,
  Float,
  MeshReflectorMaterial,
  Environment,
  Sparkles,
  useTexture,
  RoundedBox,
  Text,
} from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════
   SINGLE 3D POST CARD
   ══════════════════════════════════════════════════════════ */
function PostCard3D({ post, position, rotation, index }) {
  const meshRef  = useRef();
  const glowRef  = useRef();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Unique animation phase per card
  const phase = useMemo(() => index * (Math.PI * 2) / 7, [index]);

  // Load image texture if post has one
  // Soft pastel colors matching app palette (#F2C7C7, #D5F3D8, etc.)
  const fallbackColor = useMemo(() => {
    const colors = ['#F2C7C7', '#D5F3D8', '#F8D5D5', '#CCEED1', '#F5BCBC', '#BEE8C3'];
    return colors[index % colors.length];
  }, [index]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle floating: bobbing + slight sway
    meshRef.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.18;
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3 + phase) * 0.08;
    meshRef.current.rotation.z = Math.sin(t * 0.25 + phase) * 0.02;

    // Hover: pull toward camera
    const targetZ = hovered ? position[2] + 1.2 : position[2];
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.08;

    // Scale on hover
    const targetScale = hovered ? 1.08 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = hovered
        ? 1.8 + Math.sin(t * 4) * 0.4
        : 0.6 + Math.sin(t * 2 + phase) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={meshRef}>
      {/* Glow point light behind card */}
      <pointLight ref={glowRef} color={fallbackColor} intensity={0.8} distance={3} />

      {/* Card body */}
      <RoundedBox
        args={[2.4, 3.2, 0.07]}
        radius={0.12}
        smoothness={4}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={() => { setClicked(true); setTimeout(() => navigate(`/post/${post.slug}`), 300); }}
      >
        {/* Glassmorphism front face */}
        <meshPhysicalMaterial
          color={hovered ? '#ffffff' : '#e0e7ff'}
          transmission={0.85}
          roughness={0.05}
          metalness={0.1}
          thickness={0.5}
          envMapIntensity={1.2}
          transparent
          opacity={0.92}
          side={THREE.FrontSide}
        />
      </RoundedBox>

      {/* Colored accent bar on top */}
      <RoundedBox args={[2.4, 0.18, 0.08]} radius={0.04} position={[0, 1.51, 0.01]}>
        <meshStandardMaterial color={fallbackColor} roughness={0.2} metalness={0.5} />
      </RoundedBox>

      {/* HTML content overlay — rendered inside the 3D card */}
      <Html
        position={[0, 0, 0.05]}
        center
        distanceFactor={3.5}
        occlude={false}
        style={{ pointerEvents: hovered ? 'auto' : 'none' }}
      >
        <div
          style={{
            width: '200px',
            height: '280px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '10px',
            userSelect: 'none',
          }}
        >
          {/* Featured image */}
          <div style={{
            height: '120px',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${fallbackColor}88, ${fallbackColor}22)`,
            position: 'relative',
          }}>
            {post.featuredImage?.url ? (
              <img
                src={post.featuredImage.url}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '40px',
              }}>
                ✍️
              </div>
            )}
            {/* Caption overlay */}
            {post.featuredImage?.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.55)',
                color: '#fff', fontSize: '9px', padding: '3px 6px',
                fontFamily: 'sans-serif',
              }}>
                {post.featuredImage.caption}
              </div>
            )}
          </div>

          {/* Card body */}
          <div style={{
            flex: 1, padding: '10px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            {/* Title */}
            <p style={{
              margin: 0, fontWeight: 700, fontSize: '12px',
              color: '#1e1b4b', lineHeight: 1.3,
              fontFamily: 'sans-serif',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {post.title}
            </p>

            {/* Excerpt */}
            <p style={{
              margin: 0, fontSize: '9px', color: '#4b5563',
              fontFamily: 'sans-serif', lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              flex: 1,
            }}>
              {post.excerpt || 'Click to read more...'}
            </p>

            {/* Author + date row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginTop: 'auto',
            }}>
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name}
                  style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: fallbackColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '9px', fontFamily: 'sans-serif',
                }}>
                  {post.author?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <span style={{ fontSize: '9px', color: '#6b7280', fontFamily: 'sans-serif' }}>
                {post.author?.name || 'Anonymous'}
              </span>
              <span style={{ fontSize: '8px', color: '#9ca3af', fontFamily: 'sans-serif', marginLeft: 'auto' }}>
                👁 {post.views || 0}
              </span>
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    fontSize: '8px', padding: '2px 5px', borderRadius: '4px',
                    background: `${fallbackColor}33`, color: fallbackColor,
                    fontFamily: 'sans-serif', fontWeight: 600,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Html>

      {/* Hover: read button */}
      {hovered && (
        <Html position={[0, -1.75, 0.06]} center distanceFactor={3.5}>
          <button
            onClick={() => navigate(`/post/${post.slug}`)}
            style={{
              background: fallbackColor,
              color: '#fff', border: 'none',
              borderRadius: '20px', padding: '6px 18px',
              fontSize: '11px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'sans-serif',
              boxShadow: `0 4px 20px ${fallbackColor}88`,
              transform: clicked ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.15s',
            }}
          >
            Read Post →
          </button>
        </Html>
      )}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REFLECTIVE FLOOR
   ══════════════════════════════════════════════════════════ */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={15}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050510"
        metalness={0.8}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════
   ROTATING CAMERA RIG
   ══════════════════════════════════════════════════════════ */
function CameraRig() {
  const { camera } = useThree();
  useFrame(({ clock, mouse }) => {
    // Gentle horizontal sway following mouse
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 0.4 + 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ══════════════════════════════════════════════════════════
   AMBIENT ORBITING PARTICLES
   ══════════════════════════════════════════════════════════ */
function OrbitParticles() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={ref}>
      <Sparkles
        count={120}
        scale={[14, 8, 14]}
        size={1.2}
        speed={0.4}
        color="#818cf8"
        noise={0.1}
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORTED COMPONENT
   Props:
     posts  — array of post objects from your API/Appwrite
     visible — boolean to show/hide
   ══════════════════════════════════════════════════════════ */
export default function ThreePostCards({ posts = [], visible = true }) {
  if (!visible || posts.length === 0) return null;

  // Spread cards in a curved arc in 3D space (max 8 at a time)
  const displayPosts = posts.slice(0, 8);

  const cardPositions = displayPosts.map((_, i) => {
    const total = displayPosts.length;
    const angle = (i / total) * Math.PI * 1.6 - Math.PI * 0.8;  // spread arc
    const radius = 5.5;
    return {
      position: [
        Math.sin(angle) * radius,          // x
        0.2,                                // y (base, floats via animation)
        Math.cos(angle) * radius - 3,       // z
      ],
      rotation: [
        0,
        -angle + 0.1,                       // face toward center
        0,
      ],
    };
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0,
        background: 'radial-gradient(ellipse at center, #0a0520 0%, #020108 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Suspense fallback={null}>
          {/* ── Lighting ─── */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
          <pointLight position={[-8, 4, 4]} color="#F2C7C7" intensity={1.4} />
          <pointLight position={[8, 4, -4]} color="#D5F3D8" intensity={1.2} />
          <spotLight
            position={[0, 12, 0]}
            angle={0.5}
            penumbra={0.8}
            intensity={1.5}
            color="#FFFFFF"
            castShadow
          />

          {/* ── Environment reflections ─── */}
          <Environment preset="night" />

          {/* ── Starfield ─── */}
          <Stars
            radius={80}
            depth={60}
            count={4000}
            factor={3}
            saturation={0.5}
            fade
            speed={0.6}
          />

          {/* ── Ambient particles ─── */}
          <OrbitParticles />

          {/* ── Floor reflection ─── */}
          <Floor />

          {/* ── Post Cards ─── */}
          {displayPosts.map((post, i) => (
            <Float
              key={post._id || post.$id || i}
              speed={1.2 + i * 0.1}
              rotationIntensity={0.08}
              floatIntensity={0.3}
            >
              <PostCard3D
                post={post}
                position={cardPositions[i].position}
                rotation={cardPositions[i].rotation}
                index={i}
              />
            </Float>
          ))}

          {/* ── Mouse-responsive camera ─── */}
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
