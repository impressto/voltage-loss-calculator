# Wire Voltage Loss Calculator

A React application built with Vite and TypeScript that calculates voltage drops for wires of different gauges and materials.

## Features

- Calculate voltage drop for wires from 2 AWG to 26 AWG
- Support for different wire materials:
  - Copper
  - Tinned Copper
  - Aluminum
- Input parameters:
  - Wire gauge (AWG)
  - Wire material
  - Wire length (meters or feet)
  - Input voltage (V)
  - Current (A)
- Calculation results:
  - Wire resistance (Ω)
  - Voltage drop (V)
  - Output voltage (V)
  - Power loss (W)
  - Efficiency (%)

## Technical Details

### Wire Gauge

American Wire Gauge (AWG) is a standardized system for specifying wire diameter. The application supports wires from 2 AWG (thicker) to 26 AWG (thinner).

### Material Resistivity

Different materials have different resistivity values, which affect voltage drop:

- Copper: 1.68 × 10⁻⁸ Ω⋅m at 20°C
- Tinned Copper: 1.77 × 10⁻⁸ Ω⋅m at 20°C
- Aluminum: 2.82 × 10⁻⁸ Ω⋅m at 20°C

### Calculation Method

The calculator uses the following formulas:

1. Wire resistance: R = ρ × L / A
   - ρ = resistivity of the material (Ω⋅m)
   - L = wire length (m)
   - A = cross-sectional area (m²)

2. Voltage drop: V_drop = I × R
   - I = current (A)
   - R = resistance (Ω)

3. Output voltage: V_out = V_in - V_drop

4. Power loss: P_loss = I² × R

5. Efficiency: η = (V_out / V_in) × 100%

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
