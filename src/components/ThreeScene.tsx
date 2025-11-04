import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'

type ThreeSceneProps = ComponentPropsWithoutRef<'div'>

type ThreeModule = typeof import('three')

type LoseContextExtension = {
  loseContext?: () => void
} | null

const canCreateWebGLContext = () => {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    if (typeof canvas.getContext !== 'function') {
      return false
    }
    const context = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl') ||
      canvas.getContext('webgl2')) as WebGLRenderingContext | null
    if (!context) {
      return false
    }
    const loseContextExtension = context.getExtension('WEBGL_lose_context') as LoseContextExtension
    loseContextExtension?.loseContext?.()
    return true
  } catch {
    return false
  }
}

const ThreeScene = ({
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const webglSupported =
      typeof window !== 'undefined' &&
      'WebGLRenderingContext' in window &&
      'HTMLCanvasElement' in window &&
      canCreateWebGLContext()

    if (!webglSupported) {
      mount.innerHTML = ''
      const message = document.createElement('p')
      message.className =
        'flex h-full items-center justify-center rounded-3xl bg-slate-900/80 px-4 text-center text-sm text-slate-100'
      message.setAttribute('role', 'status')
      message.setAttribute('aria-live', 'polite')
      message.textContent = 'WebGL preview unavailable. A static mock is shown instead.'
      mount.appendChild(message)
      return
    }

    let animationFrame = 0
    let shouldAnimate = true
    let motionQuery: MediaQueryList | null = null
    let motionHandler: ((event: MediaQueryListEvent) => void) | null = null
    let renderer: import('three').WebGLRenderer | null = null
    let cube: import('three').Mesh | null = null
    let cubeMaterial: import('three').MeshPhysicalMaterial | null = null
    let halo: import('three').LineSegments | null = null
    let haloMaterial: import('three').LineBasicMaterial | null = null
    let floor: import('three').LineSegments | null = null
    let scene: import('three').Scene | null = null
    let camera: import('three').PerspectiveCamera | null = null
    let isCancelled = false
    let removeResizeListener: (() => void) | null = null

    const updateMotionPreference = (event: MediaQueryList | MediaQueryListEvent) => {
      shouldAnimate = !event.matches
    }

    const setupScene = async () => {
      const THREE = (await import('three')) as ThreeModule
      if (isCancelled || !mountRef.current) return

      scene = new THREE.Scene()
      scene.background = new THREE.Color('#020617')

      camera = new THREE.PerspectiveCamera(
        45,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100,
      )
      camera.position.set(2.2, 1.9, 3.4)

      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMappingExposure = 1.1
      renderer.shadowMap.enabled = true
      renderer.setPixelRatio(globalThis.devicePixelRatio ?? 1)
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      mount.appendChild(renderer.domElement)

      cubeMaterial = new THREE.MeshPhysicalMaterial({
        color: '#7dd3fc',
        metalness: 0.95,
        roughness: 0.2,
        reflectivity: 1,
        clearcoat: 0.6,
        emissive: '#0ea5e9',
        emissiveIntensity: 0.8,
      })

      cube = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.35, 1.4), cubeMaterial)
      cube.castShadow = true
      scene.add(cube)

      haloMaterial = new THREE.LineBasicMaterial({
        color: '#f472b6',
        transparent: true,
        opacity: 0.75,
      })
      halo = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.3, 2)),
        haloMaterial,
      )
      scene.add(halo)

      floor = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.PlaneGeometry(6, 6, 12, 12)),
        new THREE.LineBasicMaterial({ color: '#1d4ed8', transparent: true, opacity: 0.2 }),
      )
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -1.8
      scene.add(floor)

      const ambient = new THREE.HemisphereLight('#dbeafe', '#020617', 0.8)
      const keyLight = new THREE.PointLight('#38bdf8', 35, 0, 2)
      keyLight.position.set(4, 4, 5)
      const rimLight = new THREE.DirectionalLight('#f472b6', 4)
      rimLight.position.set(-4, 3, 1)
      const fillLight = new THREE.PointLight('#fef3c7', 15, 0, 2)
      fillLight.position.set(0, 2.5, -3)
      scene.add(ambient, keyLight, rimLight, fillLight)

      if (typeof window.matchMedia === 'function') {
        motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        updateMotionPreference(motionQuery)
        motionHandler = (event: MediaQueryListEvent) => updateMotionPreference(event)
        if (motionQuery.addEventListener) {
          motionQuery.addEventListener('change', motionHandler)
        } else {
          motionQuery.addListener(motionHandler)
        }
      }

      const animate = () => {
        animationFrame = window.requestAnimationFrame(animate)
        if (shouldAnimate && cube && halo) {
          cube.rotation.x += 0.01
          cube.rotation.y += 0.017
          halo.rotation.y -= 0.003
          halo.rotation.x -= 0.001
        }
        if (renderer && scene && camera) {
          renderer.render(scene, camera)
        }
      }
      animate()

      const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return
        const { clientWidth, clientHeight } = mountRef.current
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)
      }

      window.addEventListener('resize', handleResize)
      removeResizeListener = () => window.removeEventListener('resize', handleResize)
    }

    setupScene()

    return () => {
      isCancelled = true
      window.cancelAnimationFrame(animationFrame)
      removeResizeListener?.()
      if (motionQuery && motionHandler) {
        if (motionQuery.removeEventListener) {
          motionQuery.removeEventListener('change', motionHandler)
        } else {
          motionQuery.removeListener(motionHandler)
        }
      }
      if (renderer && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
      renderer?.dispose()
      cube?.geometry.dispose()
      cubeMaterial?.dispose()
      halo?.geometry.dispose()
      haloMaterial?.dispose()
      floor?.geometry.dispose()
      if (floor?.material && 'dispose' in floor.material) {
        ;(floor.material as { dispose?: () => void }).dispose?.()
      }
      scene = null
      camera = null
      renderer = null
    }
  }, [])

  const classes = [
    'relative h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950 to-black shadow-2xl shadow-cyan-500/30 md:h-96',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={mountRef}
      role="img"
      aria-live="off"
      aria-label={ariaLabel ?? 'Luminous cube with magenta rim lighting on a dark background.'}
      className={classes}
      {...rest}
    />
  )
}

export default ThreeScene
