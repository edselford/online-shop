import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export default function({username}: {username: string|undefined}) {
  const router = useRouter();

  const goTo:MouseEventHandler = (event) => {
    event.preventDefault();
    router.push(event.currentTarget.getAttribute("href") || "#");
  }

  return <Navbar bg="light" variant="light">
        <Container>
            <Nav>
              <NavDropdown
                title="Data Master"
              >
                <NavDropdown.Item href="produk" onClick={goTo}>
                 Master Produk 
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                 Master Customer 
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="dashboard" onClick={goTo}>Dashboard</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={username}>
                <NavDropdown.Item>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
        </Container>
      </Navbar>
}