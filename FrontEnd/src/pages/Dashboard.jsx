import React from 'react';
import { UserButton } from "@clerk/clerk-react";

const Dashboard = () => {
  return <div>



    <UserButton afterSwitchSessionUrl="/Login" />
  </div>;
};

export default Dashboard;
