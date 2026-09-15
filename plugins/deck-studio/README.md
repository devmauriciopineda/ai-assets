# deck-studio

Plugin autocontenido para generar **presentaciones sobre cualquier tema** en una sola conversación:
un deck HTML a pantalla completa, su informe de soporte en Markdown y el fichero de fuentes.

No requiere nada del repositorio de origen: agentes, skill, plantillas, sistema visual y validador
viajan dentro del paquete.

## Qué produce

```text
decks/<tema-slug>/
├─ presentacion/
│  ├─ index.html       # todas las slides en un único archivo
│  ├─ styles.css       # paleta + composición + microanimaciones
│  ├─ slides.js        # índice, prev/next, teclado, pantalla completa
│  └─ assets/
│     ├─ people/       # retratos y perfiles
│     └─ context/      # mapas, diagramas, imágenes de contexto
├─ informe-soporte.md  # mismo índice temático, en prosa y con más detalle
└─ fuentes.md          # fuentes consultadas, atribución de imágenes y citas
```

HTML estático, sin dependencias, sin build y sin red en tiempo de proyección.

## Componentes

| Componente | Ruta | Qué hace |
|---|---|---|
| Agente `deck-builder` | `com.github.copilot/agents/deck-builder.agent.md` | Entrevista una pregunta por turno, propone derrotero y plan, delega la investigación y genera los tres entregables |
| Agente `topic-researcher` | `com.github.copilot/agents/topic-researcher.agent.md` | Investigación de solo lectura, con jerarquía de fuentes, presupuesto duro de ciclos y contrato de salida |
| Skill `universal-deck` | `skills/universal-deck/` | Procedimiento, plantillas, sistema visual, piso de cobertura y validador |

## Requisitos

- **GitHub Copilot** en VS Code o Copilot CLI, con los plugins habilitados (`chat.plugins.enabled`).
- **Node.js** — solo para el validador (`validate-deck.mjs`, sin dependencias).
- **Python** — opcional, solo para proyectar el deck en localhost (`python -m http.server`).

## Instalación

```bash
copilot plugin install ./deck-studio
copilot plugin list
```

## Uso

Pide una presentación indicando el tema; el agente `deck-builder` arranca la entrevista guiada:

```text
Quiero una presentación sobre la Revolución Industrial
```

Flujo: entrevista → derrotero y plan aprobados → investigación con presupuesto → HTML + informe +
fuentes → validación → proyección en `http://localhost:8080` → ajustes quirúrgicos.

Para proyectar:

```bash
python -m http.server 8080 --directory decks/<slug>/presentacion
```

Navegación: `→` / `←`, espacio, `Inicio` / `Fin`, `I` para el índice, `F` para pantalla completa.

## Validación

El validador vive dentro de la skill:

```bash
node <skill-dir>/scripts/validate-deck.mjs              # todos los decks bajo ./decks
node <skill-dir>/scripts/validate-deck.mjs decks/<slug> # un deck
```

Comprueba archivos requeridos, `lang`, ids y `data-title` de cada slide, slides vacías,
cover/índice/cierre, enlaces del índice resolubles, medios remotos, `alt`/`data-credit` de las
imágenes, fallback de `prefers-reduced-motion`, teclado y pantalla completa, secciones del informe,
paridad del índice temático y entradas de fuentes. Sale con código 1 si hay algún FAIL.

## Origen y mantenimiento

Este paquete es una **copia derivada** de las customizaciones de `.github/` del repositorio
`slides`. No hay script de sincronización: si cambias el sistema visual, las plantillas o el
procedimiento en `.github/`, replica el cambio aquí y sube `version` en `plugin.json` (el
marketplace no publica releases de una versión que no cambia).

## Fuera de alcance

- Sin PPTX, PDF ni formatos de oficina: solo HTML.
- Sin frontend, backend, base de datos, autenticación ni build.
- Sin servidores MCP y sin hooks: nada de este flujo exige comportamiento determinista en runtime.
