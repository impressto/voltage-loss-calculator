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
  // Track slider value separately to handle decimal precision
  const [sliderValue, setSliderValue] = useState<number>(100); // 0-1000 range for better precision
  
  useEffect(() => {
    calculateResult();
  }, [params]);
  
  // Initialize slider value based on current
  useEffect(() => {
    setSliderValue(currentToSliderValue(params.current));
  }, []);
  
  // Convert slider value (0-1000) to actual current (0.1-100A)
  const sliderToCurrentValue = (sliderVal: number): number => {
    // 0-400 maps to 0.1-5A with decimal precision
    // 400-1000 maps to 5-100A with integer precision
    if (sliderVal <= 400) {
      // Map 0-400 to 0.1-5A
      const current = 0.1 + (sliderVal / 400) * 4.9;
      return parseFloat(current.toFixed(1)); // 1 decimal place
    } else {
      // Map 401-1000 to 5-100A
      const current = 5 + ((sliderVal - 400) / 600) * 95;
      return Math.round(current); // Integer
    }
  };

  // Convert current value (0.1-100A) to slider value (0-1000)
  const currentToSliderValue = (current: number): number => {
    if (current <= 5) {
      // Map 0.1-5A to 0-400
      return Math.round(((current - 0.1) / 4.9) * 400);
    } else {
      // Map 5-100A to 400-1000
      return Math.round(400 + ((current - 5) / 95) * 600);
    }
  };
  
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
    
    if (name === 'currentSlider') {
      // Handle current slider separately for precision
      const sliderVal = parseInt(value);
      setSliderValue(sliderVal);
      
      // Convert slider value to actual current
      const currentVal = sliderToCurrentValue(sliderVal);
      setParams(prev => ({
        ...prev,
        current: currentVal
      }));
    } else {
      setParams(prev => ({
        ...prev,
        [name]: name === 'gauge' ? parseInt(value) as WireGauge : 
                name === 'material' ? value as WireMaterial : 
                name === 'current' ? parseFloat(value) :
                parseFloat(value)
      }));
    }
  };
  
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value as 'meters' | 'feet');
  };
  
  return (
    <div className="voltage-calculator">      
      <div className="calculator-form">
        <div className="form-group">
          <label>Wire Gauge (AWG):</label>
          <div className="input-container">
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
        </div>
        
        <div className="form-group">
          <label>Wire Material:</label>
          <div className="input-container">
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
          <div className="input-container">
            <input 
              type="number" 
              name="inputVoltage" 
              min="0.1" 
              step="0.1" 
              value={params.inputVoltage} 
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <label>Current: {params.current} Amps</label>
          <input 
            type="range" 
            name="currentSlider" 
            min="0" 
            max="1000" 
            step="1" 
            value={sliderValue} 
            onChange={handleInputChange}
            className="current-slider"
          />
          <div className="slider-labels">
            <span>0.1A</span>
            <span>5A</span>
            <span>100A</span>
          </div>
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
