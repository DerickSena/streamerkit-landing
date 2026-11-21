// Cena 3D do bonding: 2 conexões (5G e Wi-Fi) saem do celular, se juntam no ingest,
// seguem para o OBS e de lá vão para as plataformas. Os "pacotes" são pontos
// de luz correndo pelos caminhos. Carregada só quando a seção entra na tela.
import * as THREE from 'three'

export type LinkId = '5g' | 'wifi'
export type AnchorId = 'phone' | '5g' | 'wifi' | 'ingest' | 'obs' | 'twitch' | 'kick' | 'youtube'
export type SceneState = { links: Record<LinkId, boolean>; brb: boolean }

type PathDef = {
  id: string
  color: THREE.Color
  curve: THREE.CatmullRomCurve3
  lut: THREE.Vector3[]
  count: number
  speed: number
  level: number // 0..1 suavizado (ligado/desligado)
  target: number
  tube: THREE.Mesh
}

const C = {
  ink: 0x140404,
  paper: 0xf7eeec,
  live: 0xff2a1c,
  ok: 0x30d158,
  g5: 0xf2b04e,
  wifi: 0x3b9bff,
  brb: 0xf2b04e,
  twitch: 0x9146ff,
  kick: 0x53fc18,
  youtube: 0xff3b30,
  dead: 0x4a2a27,
}

const V = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)
const LINK_IDS: LinkId[] = ['5g', 'wifi']
/** Índice do caminho ingest → OBS: antes dele ficam as conexões; depois, as saídas para as plataformas. */
const TRUNK = LINK_IDS.length

export function createBondingScene(
  canvas: HTMLCanvasElement,
  onAnchors: (pts: Record<AnchorId, { x: number; y: number }>) => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(C.ink, 13, 26)
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  const root = new THREE.Group()
  scene.add(root)

  // ---------- nós ----------
  const P = {
    phone: V(-5.4, 0, 0),
    ingest: V(-0.5, 0, 0),
    obs: V(2.2, 0, 0),
    twitch: V(5.4, 1.55, 0),
    kick: V(5.4, 0, 0),
    youtube: V(5.4, -1.55, 0),
  }

  const edges = (geo: THREE.BufferGeometry, color: number, opacity = 0.9) => {
    const l = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    )
    return l
  }
  const solid = (geo: THREE.BufferGeometry, color: number, opacity = 0.9) =>
    new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity }))

  // celular
  const phone = new THREE.Group()
  phone.add(solid(new THREE.BoxGeometry(0.62, 1.16, 0.07), 0x0b0202, 0.95))
  phone.add(edges(new THREE.BoxGeometry(0.62, 1.16, 0.07), C.paper, 0.85))
  const screen = solid(new THREE.PlaneGeometry(0.5, 1.02), C.live, 0.2)
  screen.position.z = 0.04
  phone.add(screen)
  phone.position.copy(P.phone)
  phone.rotation.y = 0.5
  root.add(phone)

  // ingest (rack de 3 andares)
  const ingest = new THREE.Group()
  const rackLights: THREE.Mesh[] = []
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(1.05, 0.26, 0.8)
    const y = (i - 1) * 0.34
    const body = solid(g, 0x0b0202, 0.95)
    const frame = edges(g, C.paper, 0.6)
    body.position.y = frame.position.y = y
    const led = solid(new THREE.CircleGeometry(0.035, 12), C.ok, 1)
    led.position.set(-0.38, y, 0.41)
    rackLights.push(led)
    ingest.add(body, frame, led)
  }
  ingest.position.copy(P.ingest)
  ingest.rotation.y = -0.45
  root.add(ingest)

  // OBS (octaedro girando dentro de um anel)
  const obs = new THREE.Group()
  const core = edges(new THREE.OctahedronGeometry(0.46, 0), C.paper, 0.95)
  const coreFill = solid(new THREE.OctahedronGeometry(0.44, 0), C.live, 0.16)
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.008, 6, 72),
    new THREE.MeshBasicMaterial({ color: C.paper, transparent: true, opacity: 0.4 }),
  )
  ring.rotation.x = 1.2
  obs.add(core, coreFill, ring)
  obs.position.copy(P.obs)
  root.add(obs)

  // plataformas
  const plat = (pos: THREE.Vector3, color: number) => {
    const g = new THREE.Group()
    g.add(solid(new THREE.CircleGeometry(0.2, 32), color, 0.95))
    const r = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.312, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
    )
    g.add(r)
    g.position.copy(pos)
    root.add(g)
    return { g, r }
  }
  const plats = [plat(P.twitch, C.twitch), plat(P.kick, C.kick), plat(P.youtube, C.youtube)]

  const nodeGroups: THREE.Object3D[] = [phone, ingest, obs, ...plats.map((p) => p.g)]

  // chão em grade, para dar profundidade
  const grid = new THREE.GridHelper(40, 40, 0x5a2420, 0x2a100e)
  grid.position.y = -2.7
  ;(grid.material as THREE.Material).transparent = true
  ;(grid.material as THREE.Material).opacity = 0.55
  scene.add(grid)

  // ---------- caminhos ----------
  const mk = (id: string, color: number, pts: THREE.Vector3[], count: number, speed: number): PathDef => {
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
    const lut = curve.getSpacedPoints(120)
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 90, 0.012, 6, false),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.38 }),
    )
    root.add(tube)
    return { id, color: new THREE.Color(color), curve, lut, count, speed, level: 1, target: 1, tube }
  }
  const a = P.phone.clone().add(V(0.36, 0, 0))
  const b = P.ingest.clone().add(V(-0.62, 0, 0))
  // As duas conexões abrem em arcos espelhados: 5G por cima, Wi-Fi por baixo (no celular em pé, à direita e à esquerda).
  const paths: PathDef[] = [
    mk('5g', C.g5, [a, V(-4.2, 1.05, 0.45), V(-2.9, 1.55, 0.7), V(-1.7, 0.95, 0.35), b], 56, 0.34),
    mk('wifi', C.wifi, [a, V(-4.2, -1.05, 0.45), V(-2.9, -1.55, 0.7), V(-1.7, -0.95, 0.35), b], 42, 0.28),
    mk('trunk', C.paper, [P.ingest.clone().add(V(0.6, 0, 0)), V(0.9, 0.12, 0.2), P.obs.clone().add(V(-0.6, 0, 0))], 40, 0.5),
    mk('o-twitch', C.twitch, [P.obs.clone().add(V(0.6, 0, 0)), V(3.6, 0.5, 0.3), V(4.5, 1.35, 0.1), P.twitch.clone().add(V(-0.36, 0, 0))], 26, 0.42),
    mk('o-kick', C.kick, [P.obs.clone().add(V(0.6, 0, 0)), V(3.7, 0.02, -0.25), P.kick.clone().add(V(-0.36, 0, 0))], 26, 0.46),
    mk('o-youtube', C.youtube, [P.obs.clone().add(V(0.6, 0, 0)), V(3.6, -0.5, 0.3), V(4.5, -1.35, 0.1), P.youtube.clone().add(V(-0.36, 0, 0))], 26, 0.42),
  ]

  // ---------- pacotes ----------
  const total = paths.reduce((n, p) => n + p.count, 0)
  const pos = new Float32Array(total * 3)
  const col = new Float32Array(total * 3)
  const alpha = new Float32Array(total)
  const size = new Float32Array(total)
  const meta: { path: number; u: number; jit: number }[] = []
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  paths.forEach((p, pi) => {
    for (let i = 0; i < p.count; i++) meta.push({ path: pi, u: (i + rnd() * 0.6) / p.count, jit: 0.75 + rnd() * 0.5 })
  })
  meta.forEach((m, i) => {
    size[i] = 0.7 + rnd() * 0.9
    const c = paths[m.path].color
    col.set([c.r, c.g, c.b], i * 3)
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPx: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute vec3 aColor; attribute float aAlpha; attribute float aSize;
      uniform float uPx; varying vec3 vColor; varying float vAlpha;
      void main(){
        vColor = aColor; vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPx * (115.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * (0.6 + a), a * a * vAlpha);
      }`,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  root.add(points)

  // ---------- estado ----------
  let state: SceneState = { links: { '5g': true, wifi: true }, brb: false }
  const brbColor = new THREE.Color(C.brb)
  const tmp = new THREE.Color()
  const setState = (s: SceneState) => {
    state = s
    const up = LINK_IDS.filter((k) => s.links[k]).length
    paths[0].target = s.links['5g'] ? 1 : 0
    paths[1].target = s.links.wifi ? 1 : 0
    paths[TRUNK].target = up > 0 ? 0.45 + up * 0.27 : 0
    // Com tudo caído, o OBS continua mandando a cena de BRB para as plataformas.
    for (let i = TRUNK + 1; i < paths.length; i++) paths[i].target = up > 0 ? 0.5 + up * 0.25 : 0.55
  }

  // ---------- tamanho e câmera ----------
  let w = 1
  let h = 1
  let vertical = false
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  const resize = () => {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, r.width)
    h = Math.max(1, r.height)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    mat.uniforms.uPx.value = dpr * Math.min(1.25, Math.max(0.62, h / 520))
    camera.aspect = w / h
    vertical = w / h < 0.95
    // No celular a cena gira: o fluxo desce em vez de ir para a direita.
    root.rotation.z = vertical ? -Math.PI / 2 : 0
    // em pé, o leque das conexões abre mais para os botões não se atropelarem
    const k = vertical ? 2.25 : 1
    root.scale.set(1, k, 1)
    nodeGroups.forEach((g) => g.scale.set(1, 1 / k, 1))
    // deitado, sobra espaço à direita para os nomes das plataformas não cortarem
    root.position.set(vertical ? 0 : -0.55, vertical ? 1.0 : 0, 0)
    const span = vertical ? 16.4 : 14.9
    const fit = vertical ? span / 2 / Math.tan((camera.fov * Math.PI) / 360) : span / 2 / Math.tan((camera.fov * Math.PI) / 360) / camera.aspect
    const dist = Math.max(fit, vertical ? 12 : 9.5)
    camera.userData.dist = dist
    const fog = scene.fog as THREE.Fog
    fog.near = dist + 1.5
    fog.far = dist + 15
    camera.updateProjectionMatrix()
  }

  const anchorsWorld: Record<AnchorId, THREE.Vector3> = {
    phone: P.phone.clone().add(V(0, -0.95, 0)),
    '5g': paths[0].curve.getPointAt(0.48),
    wifi: paths[1].curve.getPointAt(0.48),
    ingest: P.ingest.clone().add(V(0, -0.95, 0)),
    obs: P.obs.clone().add(V(0, -1.12, 0)),
    twitch: P.twitch.clone().add(V(0.95, 0, 0)),
    kick: P.kick.clone().add(V(0.85, 0, 0)),
    youtube: P.youtube.clone().add(V(1.05, 0, 0)),
  }
  const out = {} as Record<AnchorId, { x: number; y: number }>
  const v3 = new THREE.Vector3()

  let t = 0
  const frame = (dt: number, moving: boolean) => {
    t += dt
    pointer.sx += (pointer.x - pointer.sx) * 0.06
    pointer.sy += (pointer.y - pointer.sy) * 0.06
    const d = camera.userData.dist as number
    const sway = moving ? Math.sin(t * 0.35) * 0.25 : 0
    camera.position.set(pointer.sx * 1.5 + sway, 1.25 - pointer.sy * 0.9 + (vertical ? 0.4 : 0), d)
    camera.lookAt(0, vertical ? 0 : -0.1, 0)

    const up = LINK_IDS.filter((k) => state.links[k]).length
    paths.forEach((p, i) => {
      p.level += (p.target - p.level) * Math.min(1, dt * 6)
      const m = p.tube.material as THREE.MeshBasicMaterial
      const dead = i < TRUNK && p.target === 0
      const isOut = i > TRUNK
      tmp.copy(dead ? tmp.set(C.dead) : isOut && state.brb ? brbColor : p.color)
      m.color.lerp(tmp, Math.min(1, dt * 6))
      m.opacity = dead ? 0.22 : 0.16 + p.level * 0.3
    })

    let k = 0
    for (let i = 0; i < meta.length; i++) {
      const m = meta[i]
      const p = paths[m.path]
      if (moving) m.u = (((m.u + p.speed * m.jit * dt * (0.35 + p.level * 0.9)) % 1) + 1) % 1
      const f = m.u * (p.lut.length - 1)
      const i0 = Math.floor(f)
      const i1 = Math.min(p.lut.length - 1, i0 + 1)
      const fr = f - i0
      const A = p.lut[i0]
      const B = p.lut[i1]
      pos[k] = A.x + (B.x - A.x) * fr
      pos[k + 1] = A.y + (B.y - A.y) * fr
      pos[k + 2] = A.z + (B.z - A.z) * fr
      const edge = Math.min(1, m.u * 9, (1 - m.u) * 9)
      alpha[i] = edge * p.level
      if (m.path > TRUNK) {
        tmp.copy(state.brb ? brbColor : p.color)
        col[k] += (tmp.r - col[k]) * 0.1
        col[k + 1] += (tmp.g - col[k + 1]) * 0.1
        col[k + 2] += (tmp.b - col[k + 2]) * 0.1
      }
      k += 3
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aAlpha.needsUpdate = true
    geo.attributes.aColor.needsUpdate = true

    if (moving) {
      core.rotation.y += dt * (0.5 + up * 0.25)
      core.rotation.x += dt * 0.2
      coreFill.rotation.copy(core.rotation)
      ring.rotation.z += dt * 0.25
      phone.rotation.y = 0.5 + Math.sin(t * 0.7) * 0.12
    }
    ;(coreFill.material as THREE.MeshBasicMaterial).color.lerp(tmp.set(state.brb ? C.brb : C.live), 0.1)
    ;(screen.material as THREE.MeshBasicMaterial).opacity = up > 0 ? 0.22 + Math.sin(t * 3) * 0.04 : 0.06
    // LEDs do rack, de baixo para cima: Wi-Fi, entrada (acesa se alguma conexão chega) e 5G.
    rackLights.forEach((l, i) => {
      const on = [state.links.wifi, up > 0, state.links['5g']][i]
      ;(l.material as THREE.MeshBasicMaterial).color.set(on ? [C.wifi, C.ok, C.g5][i] : C.live)
      l.visible = on || Math.sin(t * 9) > 0
    })
    plats.forEach((pl, i) => {
      const s = 1 + Math.sin(t * 2.2 + i * 1.3) * 0.06
      pl.r.scale.setScalar(s)
    })

    renderer.render(scene, camera)

    root.updateMatrixWorld()
    ;(Object.keys(anchorsWorld) as AnchorId[]).forEach((id) => {
      v3.copy(anchorsWorld[id]).applyMatrix4(root.matrixWorld).project(camera)
      out[id] = { x: (v3.x * 0.5 + 0.5) * w, y: (-v3.y * 0.5 + 0.5) * h }
    })
    onAnchors(out)
  }

  resize()
  setState(state)

  return {
    frame,
    resize,
    setState,
    setPointer(x: number, y: number) {
      pointer.x = x
      pointer.y = y
    },
    isVertical: () => vertical,
    dispose() {
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mm = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose())
        else if (mm) mm.dispose()
      })
    },
  }
}
