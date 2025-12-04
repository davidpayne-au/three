import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'

type WeatherAnimationProps = ComponentPropsWithoutRef<'div'>

type ThreeModule = typeof import('three')

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
    const loseContextExtension = context.getExtension('WEBGL_lose_context') as {
      loseContext?: () => void
    } | null
    loseContextExtension?.loseContext?.()
    return true
  } catch {
    return false
  }
}

const WeatherAnimation = ({ className = '', ...rest }: WeatherAnimationProps) => {
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
        'flex h-full items-center justify-center text-center text-sm text-slate-600 dark:text-slate-400'
      message.setAttribute('role', 'status')
      message.setAttribute('aria-live', 'polite')
      message.textContent = '☀️ Loading weather...'
      mount.appendChild(message)
      return
    }

    let animationFrame = 0
    let shouldAnimate = true
    let motionQuery: MediaQueryList | null = null
    let motionHandler: ((event: MediaQueryListEvent) => void) | null = null
    let renderer: import('three').WebGLRenderer | null = null
    let sun: import('three').Mesh | null = null
    let sunMaterial: import('three').MeshBasicMaterial | null = null
    let rays: import('three').Group | null = null
    let clouds: import('three').Group | null = null
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
      scene.background = new THREE.Color('#f0f9ff')

      camera = new THREE.PerspectiveCamera(
        45,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100,
      )
      camera.position.set(0, 0, 8)

      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.setPixelRatio(globalThis.devicePixelRatio ?? 1)
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      mount.appendChild(renderer.domElement)

      // Create sun
      sunMaterial = new THREE.MeshBasicMaterial({
        color: '#fbbf24',
      })
      sun = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), sunMaterial)
      scene.add(sun)

      // Create sun rays
      rays = new THREE.Group()
      const rayCount = 12
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: '#fcd34d',
      })

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2
        const rayGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8)
        const ray = new THREE.Mesh(rayGeometry, rayMaterial)

        const distance = 2.2
        ray.position.x = Math.cos(angle) * distance
        ray.position.y = Math.sin(angle) * distance

        // Rotate ray to point outward from sun
        ray.rotation.z = angle + Math.PI / 2

        rays.add(ray)
      }
      scene.add(rays)

      // Create fluffy clouds
      clouds = new THREE.Group()
      const cloudMaterial = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.9,
      })

      // Cloud 1 (left)
      const cloud1 = new THREE.Group()
      const cloud1_sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), cloudMaterial)
      cloud1_sphere1.position.x = -0.4
      const cloud1_sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), cloudMaterial)
      cloud1_sphere2.position.x = 0
      cloud1_sphere2.position.y = 0.2
      const cloud1_sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), cloudMaterial)
      cloud1_sphere3.position.x = 0.4
      cloud1.add(cloud1_sphere1, cloud1_sphere2, cloud1_sphere3)
      cloud1.position.set(-3.5, -1.5, 2)
      clouds.add(cloud1)

      // Cloud 2 (right)
      const cloud2 = new THREE.Group()
      const cloud2_sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), cloudMaterial)
      cloud2_sphere1.position.x = -0.3
      const cloud2_sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), cloudMaterial)
      cloud2_sphere2.position.x = 0.1
      cloud2_sphere2.position.y = 0.15
      const cloud2_sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), cloudMaterial)
      cloud2_sphere3.position.x = 0.4
      cloud2.add(cloud2_sphere1, cloud2_sphere2, cloud2_sphere3)
      cloud2.position.set(3.2, 1.2, 2)
      clouds.add(cloud2)

      scene.add(clouds)

      // Ambient lighting
      const ambient = new THREE.AmbientLight('#ffffff', 1)
      scene.add(ambient)

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

      let time = 0
      const animate = () => {
        animationFrame = window.requestAnimationFrame(animate)
        if (shouldAnimate) {
          time += 0.01
          if (rays) {
            rays.rotation.z += 0.01
          }
          if (clouds) {
            // Gentle floating motion for clouds
            clouds.children[0].position.x = -3.5 + Math.sin(time * 0.5) * 0.3
            clouds.children[0].position.y = -1.5 + Math.cos(time * 0.7) * 0.2
            clouds.children[1].position.x = 3.2 + Math.sin(time * 0.6) * 0.3
            clouds.children[1].position.y = 1.2 + Math.cos(time * 0.8) * 0.2
          }
          if (sun) {
            // Subtle pulsing effect
            const scale = 1 + Math.sin(time * 2) * 0.05
            sun.scale.set(scale, scale, scale)
          }
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
      sun?.geometry.dispose()
      sunMaterial?.dispose()
      // Dispose rays - simple cleanup without instanceof check
      if (rays) {
        rays.children.forEach((child) => {
          const mesh = child as import('three').Mesh
          mesh.geometry?.dispose()
          if (mesh.material && 'dispose' in mesh.material) {
            ;(mesh.material as { dispose?: () => void }).dispose?.()
          }
        })
      }
      // Dispose clouds
      if (clouds) {
        clouds.children.forEach((cloudGroup) => {
          const group = cloudGroup as import('three').Group
          group.children.forEach((child) => {
            const mesh = child as import('three').Mesh
            mesh.geometry?.dispose()
            if (mesh.material && 'dispose' in mesh.material) {
              ;(mesh.material as { dispose?: () => void }).dispose?.()
            }
          })
        })
      }
      scene = null
      camera = null
      renderer = null
    }
  }, [])

  const classes = [
    'relative h-64 w-full overflow-hidden rounded-2xl',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={mountRef}
      role="img"
      aria-live="off"
      aria-label="Cheerful sun with rotating rays and floating clouds"
      className={classes}
      {...rest}
    />
  )
}

export { WeatherAnimation }
