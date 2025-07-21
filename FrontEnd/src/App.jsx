import React from "react";
import Navbar from "./navBar";
import { Button } from "./components/ui/button";

function App(){
  return(
    <div> 
      <Navbar/>
          <Button variant="destructive">Red Button</Button>
      <Button variant="secondary">Gray Button</Button>
      <Button variant="outline">Outline Button</Button>
    </div>
  )
}

export default App;