const stack = [
  { label: 'Vite', detail: 'Lightning-fast dev server and bundler.' },
  { label: 'React 19', detail: 'Modern component model with hooks.' },
  { label: 'Three.js', detail: 'WebGL abstraction powering the canvas demo.' },
  { label: 'Tailwind CSS', detail: 'Utility classes for rapid presentation tweaks.' },
  { label: 'HashRouter', detail: 'Enables multi-page UX on static hosting.' },
  { label: 'Vitest + RTL', detail: 'Confidence via component-level tests.' },
]

const About = () => (
  <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-black/40">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">About</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">About This Demo</h2>
      <p className="mt-4 text-base text-slate-300">
        ThreeJS Explorer is a compact starter that proves how little code you need to deliver a
        polished WebGL landing page. The 3D scene is authored directly with Three.js so you can drop
        in custom shaders, load GLTF assets, or hook up physics without waiting on additional
        wrappers.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {stack.map((tech) => (
        <div
          key={tech.label}
          className="rounded-2xl border border-white/5 bg-slate-900/80 p-4 text-sm text-slate-200"
        >
          <p className="font-semibold text-white">{tech.label}</p>
          <p className="text-slate-400">{tech.detail}</p>
        </div>
      ))}
    </div>

    <p className="text-sm text-slate-400">
      Try editing <code className="font-mono text-brand">src/components/ThreeScene.tsx</code> to
      experiment with different meshes or materials. The dev server hot-reloads instantly, so you
      can iterate on lighting, colors, or camera moves without a lengthy build.
    </p>
  </section>
)

export { About }
