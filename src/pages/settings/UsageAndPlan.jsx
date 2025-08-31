import React from 'react';

const UsageAndPlan = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Usage and Plan</h2>
    <div className="bg-white rounded-xl shadow p-8">
      <div className="mb-4">
        <span className="font-bold">Account:</span><br />
        Acme Corp (ID: acc-123)
      </div>
      <div className="mb-4">
        <span className="font-bold">Usage:</span><br />
        Active Workflows: 5<br />
        Executions: 1200<br />
        Executions Reset Date: 1/8/2024, 5:30:00 AM
      </div>
      <div>
        <span className="font-bold">Plan:</span><br />
        Name: Pro<br />
        Price: $49.99/month<br />
        Features:
        <ul className="list-disc ml-6">
          <li>Unlimited workflows</li>
          <li>Priority support</li>
          <li>Advanced analytics</li>
        </ul>
        Limits: 100 workflows, 10000 executions<br />
        Billing Cycle: monthly<br />
        Next Billing Date: 1/8/2024, 5:30:00 AM
      </div>
    </div>
  </div>
);

export default UsageAndPlan; 