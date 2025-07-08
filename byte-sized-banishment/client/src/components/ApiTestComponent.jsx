import React, { useState } from 'react';
import axios from 'axios';

const ApiTestComponent = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      // Test the base API URL
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
      setTestResult(`✅ API is working! Response: ${response.data}`);
    } catch (error) {
      if (error.response) {
        setTestResult(`⚠️ API responded with error: ${error.response.status} - ${error.response.data || error.message}`);
      } else if (error.request) {
        setTestResult(`❌ No response from API. Network error or API is down.`);
      } else {
        setTestResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      // Test auth endpoint with invalid data to see if it responds
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTestResult(`✅ Auth endpoint is working! (Got expected error: ${error.response.data.message})`);
      } else if (error.response) {
        setTestResult(`⚠️ Auth endpoint responded: ${error.response.status} - ${error.response.data?.message || error.message}`);
      } else {
        setTestResult(`❌ Auth endpoint unreachable: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg m-4">
      <h2 className="text-xl font-bold text-white mb-4">API Connection Test</h2>
      <div className="space-y-4">
        <div>
          <button 
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
          >
            {loading ? 'Testing...' : 'Test Base API'}
          </button>
          <button 
            onClick={testAuthEndpoint}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {loading ? 'Testing...' : 'Test Auth Endpoint'}
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-900 rounded text-white">
          <strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}<br/>
          <strong>Result:</strong> {testResult || 'Click a button to test'}
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;
