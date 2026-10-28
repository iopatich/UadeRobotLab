# Dashboard de telemetría Unitree

Dashboard web desarrollado para el **TP05 de Desarrollo de Aplicaciones II**. La aplicación permite supervisar en tiempo real la telemetría de los robots Unitree **Go2** y **G1**, utilizando el backend FastAPI provisto por la materia.

El proyecto está construido con React, TypeScript y Vite. La información inicial del robot se obtiene mediante `GET /info` y las lecturas en vivo llegan mediante el WebSocket `WS /ws`.

## Funcionalidades implementadas

- Detección automática del modelo, nombre y cantidad de motores del robot.
- Compatibilidad con Go2, de 12 motores, y G1, de 29 motores.
- Visualización de ángulo, velocidad, torque estimado y temperatura de cada motor.
- Semáforo térmico para motores:
  - verde por debajo de 40 °C;
  - amarillo entre 40 °C y 60 °C;
  - rojo por encima de 60 °C.
- Resumen de motores normales, en precaución y críticos.
- Visualización de roll, pitch, yaw y aceleración de la IMU.
- Gráfico histórico de orientación con hasta 300 muestras.
- Estado de batería, corriente, temperatura, voltajes de celda y voltaje total.
- Estado de contacto de las cuatro patas del Go2.
- Estados visuales de conexión, reconexión y desconexión.
- Reconexión automática del WebSocket con hasta cinco intentos.
- Conservación de la última lectura si se pierde la conexión.
- Alerta de datos desactualizados y botón de reintento manual.
- Captura manual de muestras mediante una copia profunda de la telemetría.
- Exportación de las capturas a CSV compatible con Excel.
- Diseño responsive para escritorio, tablet y celular.

## Arquitectura

El flujo principal de datos es el siguiente:

```text
Simulador o robot
       ↓
Backend FastAPI
       ↓
GET /info + WebSocket /ws
       ↓
telemetryClient
       ↓
RobotTelemetryFacade
       ↓
useTelemetry
       ↓
Componentes React
       ↓
Captura y exportación CSV
```

La implementación utiliza los siguientes patrones:

- **Adapter:** `apiToTelemetry.ts` transforma el contrato JSON del backend al modelo utilizado por la interfaz.
- **Facade:** `RobotTelemetryFacade.ts` ofrece un único punto de acceso al backend y evita que el hook conozca los detalles de `fetch`, WebSocket, URLs o reconexión.
- **Observer:** `useTelemetry.ts` centraliza el estado; React actualiza los componentes cuando llega una nueva lectura.

## Tecnologías

- React 19
- TypeScript 7
- Vite 8
- Chart.js y `react-chartjs-2`
- Lucide React
- CSS responsive

## Requisitos

- Node.js `20.19` o superior, o Node.js `22.12` o superior.
- npm.
- El simulador y backend del TP05 en ejecución.

La instalación del simulador y del backend está explicada en [INSTALACION.md](../INSTALACION.md). El contrato completo del backend se encuentra en [API.md](../API.md).

## Instalación

Desde esta carpeta, instalar las dependencias bloqueadas en `package-lock.json`:

```bash
npm ci
```

Si se está trabajando sin el lockfile, también se puede utilizar:

```bash
npm install
```

## Configuración del backend

La URL predeterminada es:

```text
http://127.0.0.1:8001
```

Puede modificarse mediante la variable `VITE_TELEMETRY_BASE_URL` del archivo `.env`:

```env
VITE_TELEMETRY_BASE_URL=http://10.0.0.5:8001
```

Se debe indicar solamente la dirección HTTP base. El dashboard genera automáticamente la dirección `ws://` o `wss://` para conectarse a `/ws`.

## Ejecución

### 1. Iniciar el simulador y el backend

Desde la carpeta superior `TP05_Desarrollo_de_Aplicaciones_II`:

**Windows**

```bat
INICIAR_TP05.bat
```

**Linux o macOS**

```bash
./INICIAR_TP05.sh
```

El script solicita elegir el robot G1 o Go2 y muestra la dirección del backend. Si la dirección no es `127.0.0.1`, debe copiarse al archivo `.env` del dashboard.

### 2. Iniciar el dashboard

Desde `mi_dashboard`:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local que debe abrirse en el navegador.

## Uso

1. Mantener abiertas las ventanas del simulador y del backend.
2. Abrir el dashboard en el navegador.
3. Verificar que el encabezado indique **Conectado**.
4. Consultar los paneles de motores, IMU, batería y contactos.
5. Presionar **Capturar muestra** para guardar la lectura actual en la sesión.
6. Presionar **Exportar CSV** cuando exista al menos una captura.

Cada captura guarda una copia profunda del snapshot. De este modo, sus valores no cambian cuando llega nueva telemetría.

El CSV genera una fila por motor y por captura e incluye fecha, robot, tiempo de API, datos del motor, IMU, batería y contactos. Utiliza `;` como separador y BOM UTF-8 para facilitar su apertura en Excel con configuración regional argentina.

## Manejo de desconexiones

Si el WebSocket se interrumpe, el dashboard intenta reconectarse automáticamente. Durante ese proceso muestra el estado **Reconectando**.

Cuando se agotan los intentos:

- se conserva la última lectura recibida;
- las capturas anteriores permanecen disponibles;
- aparece una alerta indicando que los valores pueden estar desactualizados;
- el botón **Reintentar** vuelve a consultar `/info`, limpia la lectura anterior y abre un WebSocket nuevo.

## Estructura principal

```text
src/
├── adapters/
│   └── apiToTelemetry.ts
├── charts/
│   └── ImuChart.tsx
├── components/
│   ├── layout/
│   ├── telemetry/
│   └── ui/
├── config/
│   └── env.ts
├── features/
│   ├── capture/
│   │   └── captureSession.ts
│   └── export/
│       └── csvExport.ts
├── hooks/
│   └── useTelemetry.ts
├── services/
│   ├── RobotTelemetryFacade.ts
│   └── telemetryClient.ts
├── styles/
│   └── global.css
├── types/
│   ├── api.ts
│   └── telemetry.ts
├── App.tsx
└── main.tsx
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Comprueba TypeScript y genera el bundle de producción. |
| `npm run preview` | Sirve localmente el bundle generado. |

## Generar una versión de producción

```bash
npm run build
npm run preview
```

Los archivos generados se guardan en `dist/`.

## Consideraciones sobre los datos

En el simulador algunos valores son mediciones directas y otros son derivados para representar un comportamiento coherente. Por ejemplo, las temperaturas, el torque, la batería y algunas fuerzas pueden reaccionar al movimiento sin representar una medición física real.

Al conectarse a un robot real, los valores y umbrales observados pueden ser diferentes. Para más detalle, consultar [API.md](../API.md).
