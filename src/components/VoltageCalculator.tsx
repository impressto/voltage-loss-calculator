import React, { useState, useEffect } from 'react';
import { 
  calculateVoltage, 
  AWG_TO_DIAMETER
} from '../utils/voltageCalculator';
import type { 
  VoltageCalculatorParams, 
  VoltageCalculatorResult, 
  WireGauge, 
  WireMaterial
} from '../utils/voltageCalculator';
import PowerFlowDiagram from './PowerFlowDiagram';
import './VoltageCalculator.css';

const GAUGE_OPTIONS = Object.keys(AWG_TO_DIAMETER).map(Number).sort((a, b) => a - b);

const VoltageCalculator: React.FC = () => {
  const [params, setParams] = useState<VoltageCalculatorParams>({
    gauge: 12 as WireGauge,
    material: 'copper' as WireMaterial,
    length: 1,
    inputVoltage: 12,
    current: 1
  });
  
  const [result, setResult] = useState<VoltageCalculatorResult | null>(null);
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  
  useEffect(() => {
    calculateResult();
  }, [params]);
  
  const calculateResult = () => {
    // Convert length to meters if in feet
    const lengthInMeters = unit === 'feet' ? params.length * 0.3048 : params.length;
    
    const calculationParams = {
      ...params,
      length: lengthInMeters
    };
    
    const result = calculateVoltage(calculationParams);
    setResult(result);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setParams(prev => ({
      ...prev,
      [name]: name === 'gauge' ? parseInt(value) as WireGauge : 
              name === 'material' ? value as WireMaterial : 
              parseFloat(value)
    }));
  };
  
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value as 'meters' | 'feet');
  };
  
  return (
    <div className="voltage-calculator">      
      <div className="calculator-form">
        <div className="form-group">
          <label>Wire Gauge (AWG):</label>
          <select 
            name="gauge" 
            value={params.gauge} 
            onChange={handleInputChange}
          >
            {GAUGE_OPTIONS.map(gauge => (
              <option key={gauge} value={gauge}>
                {gauge} AWG ({(AWG_TO_DIAMETER[gauge] * 1000).toFixed(2)} mm)
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Wire Material:</label>
          <select 
            name="material" 
            value={params.material} 
            onChange={handleInputChange}
          >
            <option value="copper">Copper</option>
            <option value="tinnedCopper">Tinned Copper</option>
            <option value="aluminum">Aluminum</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Wire Length:</label>
          <div className="input-with-unit">
            <input 
              type="number" 
              name="length" 
              min="0.1" 
              step="0.1" 
              value={params.length} 
              onChange={handleInputChange}
            />
            <select value={unit} onChange={handleUnitChange}>
              <option value="meters">meters</option>
              <option value="feet">feet</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Input Voltage (V):</label>
          <input 
            type="number" 
            name="inputVoltage" 
            min="0.1" 
            step="0.1" 
            value={params.inputVoltage} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Current (Amps):</label>
          <input 
            type="number" 
            name="current" 
            min="0.1" 
            step="0.1" 
            value={params.current} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      {result && (
        <>
          <div className="results">
            <h3>Results:</h3>
            <table>
              <tbody>
                <tr>
                  <td>Wire Resistance:</td>
                  <td>{result.resistanceOhms} Ω</td>
                </tr>
                <tr>
                  <td>Input Voltage:</td>
                  <td>{params.inputVoltage} V</td>
                </tr>
                <tr>
                  <td>Output Voltage:</td>
                  <td>{result.outputVoltage} V</td>
                </tr>
                <tr>
                  <td>Voltage Drop:</td>
                  <td>{result.voltageDrop} V</td>
                </tr>
                <tr>
                  <td>Input Power:</td>
                  <td>{result.inputPower} W</td>
                </tr>
                <tr>
                  <td>Output Power:</td>
                  <td>{result.outputPower} W</td>
                </tr>
                <tr>
                  <td>Power Loss:</td>
                  <td>{result.powerLoss} W</td>
                </tr>
                <tr>
                  <td>Efficiency:</td>
                  <td>{result.efficiency}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <PowerFlowDiagram 
            result={result} 
            inputVoltage={params.inputVoltage} 
            current={params.current} 
          />
        </>
      )}
    </div>
  );
};

export default VoltageCalculator;
