import React from 'react';
import './PowerFlowDiagram.css';
import type { VoltageCalculatorResult } from '../utils/voltageCalculator';

interface PowerFlowDiagramProps {
  result: VoltageCalculatorResult;
  inputVoltage: number;
  current: number;
}

const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({ result, inputVoltage, current }) => {
  // Calculate percentages for visualization
  const lossPercentage = (result.powerLoss / result.inputPower) * 100;
  const outputPercentage = 100 - lossPercentage;
  
  return (
    <div className="power-flow-diagram">
      <h4>Power Flow Visualization</h4>
      
      <div className="power-flow-container">
        <div className="input-section">
          <div className="input-label">Input Power</div>
          <div className="input-value">{result.inputPower} W</div>
          <div className="input-details">
            {inputVoltage} V × {current} A
          </div>
        </div>
        
        <div className="flow-arrow">→</div>
        
        <div className="wire-section">
          <div className="wire-resistance">
            Wire Resistance: {result.resistanceOhms} Ω
          </div>
          <div className="loss-indicator" style={{ height: `${lossPercentage}%` }}>
            <div className="loss-label">Loss: {result.powerLoss} W ({lossPercentage.toFixed(1)}%)</div>
          </div>
          <div className="throughput-indicator" style={{ height: `${outputPercentage}%` }}>
            <div className="throughput-label">
              Throughput: {result.outputPower} W ({outputPercentage.toFixed(1)}%)
            </div>
          </div>
        </div>
        
        <div className="flow-arrow">→</div>
        
        <div className="output-section">
          <div className="output-label">Output Power</div>
          <div className="output-value">{result.outputPower} W</div>
          <div className="output-details">
            {result.outputVoltage} V × {current} A
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerFlowDiagram;
