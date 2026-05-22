import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
export default function Layout() {
    return (
        <>
            <Navbar />
            {/* {routing here} */}
            <div className="container mx-auto">
                <Outlet></Outlet>
            </div>
            {/* <Footer /> */}
        </>

    )
}