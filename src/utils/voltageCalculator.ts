// Resistivity values in ohm-meter
const RESISTIVITY = {
  copper: 1.68e-8,       // Copper at 20°C
  tinnedCopper: 1.77e-8, // Tinned copper (approximately 5% higher than copper)
  aluminum: 2.82e-8      // Aluminum at 20°C
};

// AWG to diameter in meters
export const AWG_TO_DIAMETER: Record<number, number> = {
  2: 0.00651,  // 6.51 mm
  4: 0.00517,  // 5.17 mm
  6: 0.00412,  // 4.12 mm
  8: 0.00326,  // 3.26 mm
  10: 0.00259, // 2.59 mm
  12: 0.00205, // 2.05 mm
  14: 0.00162, // 1.62 mm
  16: 0.00129, // 1.29 mm
  18: 0.00102, // 1.02 mm
  20: 0.00081, // 0.81 mm
  22: 0.00064, // 0.64 mm
  24: 0.00051, // 0.51 mm
  26: 0.00041, // 0.41 mm
};

export type WireMaterial = 'copper' | 'tinnedCopper' | 'aluminum';
export type WireGauge = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26;

export interface VoltageCalculatorParams {
  gauge: WireGauge;
  material: WireMaterial;
  length: number;      // in meters
  inputVoltage: number;  // in volts
  current: number;     // in amperes
}

export interface VoltageCalculatorResult {
  resistanceOhms: number;
  voltageDrop: number;
  outputVoltage: number;
  powerLoss: number;   // in watts
  inputPower: number;  // in watts
  outputPower: number; // in watts
  efficiency: number;  // as percentage
}

export const calculateVoltage = (params: VoltageCalculatorParams): VoltageCalculatorResult => {
  const { gauge, material, length, inputVoltage, current } = params;
  
  // Get wire diameter in meters
  const diameter = AWG_TO_DIAMETER[gauge];
  
  // Calculate cross-sectional area in square meters
  const area = Math.PI * Math.pow(diameter / 2, 2);
  
  // Calculate resistance (R = ρ * L / A)
  // ρ = resistivity, L = length, A = cross-sectional area
  const resistance = (RESISTIVITY[material] * length) / area;
  
  // Calculate voltage drop (V = I * R)
  const voltageDrop = current * resistance;
  
  // Calculate output voltage (V_out = V_in - V_drop)
  const outputVoltage = inputVoltage - voltageDrop;
  
  // Calculate power loss (P = I² * R)
  const powerLoss = Math.pow(current, 2) * resistance;
  
  // Calculate input and output power
  const inputPower = current * inputVoltage;
  const outputPower = current * outputVoltage;
  
  // Calculate efficiency (η = P_out / P_in * 100%)
  const efficiency = (outputPower / inputPower) * 100;
  
  return {
    resistanceOhms: parseFloat(resistance.toFixed(4)),
    voltageDrop: parseFloat(voltageDrop.toFixed(2)),
    outputVoltage: parseFloat(outputVoltage.toFixed(2)),
    powerLoss: parseFloat(powerLoss.toFixed(2)),
    inputPower: parseFloat(inputPower.toFixed(2)),
    outputPower: parseFloat(outputPower.toFixed(2)),
    efficiency: parseFloat(efficiency.toFixed(2)),
  };
};
