import React from "react";

function Navbar(){
    return (
        <div className="bg-amber-300 font-extrabold text-3xl flex list-none p-4 ">
            <li className="p-2 m-2 font-sans hover:underline">Home</li>
            <li className="p-2 m-2 font-sans hover:underline">Products</li>
            <li className="p-2 m-2 font-sans hover:underline">About</li>
            <li className="p-2 m-2 font-sans hover:underline">Complain</li>
        </div>
    )

}


export default Navbar;