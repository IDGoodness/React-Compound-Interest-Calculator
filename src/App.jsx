import { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [state, setState] = useState({
    money: '',
    interest: '',
    time: '',
    timeUnit: 'Years',
    result: {
      amount: '',
      interest: ''
    },
    detailedResults: []
  });

  const { money, interest, time, timeUnit, result } = state;

  const handleReset = () => {
    setState({
      money: '',
      interest: '',
      time: '',
      timeUnit: 'Years',
      result: { amount: '', interest: '' }
    });
  }

  const getTimeInYears = () => {
    switch (timeUnit) {
      case 'Days':
        return time / 365;
      case 'Months':
        return time / 12;    
      default:
        return time;
    }
  }

  const handleInput = () => {
    const m = parseFloat(money);
    const i = parseFloat(interest) / 100;
    const t = getTimeInYears();
    // const n = 1; // Compounding once per year.
  
    let detailedResults = [];
    let currentAmount = m;
  
    for (let year = 1; year <= Math.ceil(t); year++) {
      const interestEarned = currentAmount * i;
      currentAmount += interestEarned;
      
      detailedResults.push({
        year,
        startBalance: currentAmount - interestEarned,
        interestEarned,
        endBalance: currentAmount
      });
    }
  
    const finalAmount = m * Math.pow((1 + i), t);
    const compoundInterest = finalAmount - m;
  
    setState(prev => ({
      ...prev,
      result: {
        amount: finalAmount.toFixed(2),
        interest: compoundInterest.toFixed(2),
      },
      detailedResults
    }));
  }

  function DetailedResultsTable({ results }) {
    return (
      <div className="table-responsive mt-4">
        <table className="table table-striped table-hover">
          <thead className="table-success">
            <tr>
              <th>Year</th>
              <th>Starting Balance</th>
              <th>Interest Earned</th>
              <th>Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>${row.startBalance.toFixed(2)}</td>
                <td>${row.interestEarned.toFixed(2)}</td>
                <td>${row.endBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg" style={{maxWidth: '500px', width: '100%'}}>
        <div className="card-header bg-success text-white text-center py-3">
          <h2 className="mb-0">Compound Interest Calculator</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="money" className="form-label">Initial Investment ($)</label>
            <input type="number" className="form-control" id="money" value={money} onChange={(e) => setState(prev => ({...prev, money: e.target.value}))} placeholder="Enter amount" />
          </div>
          <div className="mb-3">
            <label htmlFor="interest" className="form-label">Annual Interest Rate (%)</label>
            <input type="number" className="form-control" id="interest" value={interest} onChange={(e) => setState(prev => ({...prev, interest: e.target.value}))} placeholder="Enter interest rate" />
          </div>
          <div className="row mb-3">
            <div className="col-8">
              <label htmlFor="time" className="form-label">Time Period</label>
              <input type="number" className="form-control" id="time" value={time} onChange={(e) => setState(prev => ({...prev, time: e.target.value}))} placeholder="Enter time" />
            </div>
            <div className="col-4">
              <label htmlFor="timeUnit" className="form-label">Unit</label>
              <select className="form-select" id="timeUnit" value={timeUnit} onChange={(e) => setState(prev => ({...prev, timeUnit: e.target.value}))}>
                <option value="Days">Days</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>
          <div className="row gx-2 mt-4">
          <div className="col-6 col-lg-12">
            <button className="btn btn-outline-success btn-lg w-100" onClick={handleInput}>Calculate</button>
          </div>
          <div className="col-6 col-lg-12 mt-lg-2">
            <button className="btn btn-outline-secondary btn-lg w-100" onClick={handleReset}>Reset</button>
          </div>
          </div>
        </div>
        {(result.amount || result.interest) && (
          <>
          <div className="card-footer bg-success text-white animate__animated animate__fadeIn">
            <h4 className="text-center mb-3">Results</h4>
            <p className="mb-2 fs-5">Total Amount: <strong>${parseFloat(result.amount).toLocaleString()}</strong></p>
            <p className="mb-0 fs-5">Compound Interest: <strong>${parseFloat(result.interest).toLocaleString()}</strong></p>
          </div>
          <div className="card-body">
            <h5 className="text-center mb-3">Detailed Yearly Breakdown</h5>
            <DetailedResultsTable results={state.detailedResults} />
          </div>
        </>
        )}
      </div>
    </div>
  );
}

export default App;