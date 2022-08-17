import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

export default class NavBar extends Component {
    render() {
        return (
            <div className="sidebar">
                <p className="sidebar_welcome">Welcome Back Admin</p>
                <Nav vertical>
                    <NavItem>
                        <NavLink href="/dashboard">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/category">Question Category</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="../">Database</NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink href="/view" target="_blank">
                            FAQ View List
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/logout">Logout</NavLink>
                    </NavItem>
                </Nav>
            </div>
        );
    }
}

if (document.getElementById("navbar")) {
    ReactDOM.render(<NavBar />, document.getElementById("navbar"));
}
