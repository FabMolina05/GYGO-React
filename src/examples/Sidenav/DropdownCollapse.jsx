import { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

function DropdownCollapse({ route, collapseName }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Si alguna subruta está activa, abre el dropdown
    const isActiveSubroute = route.collapse.some((sub) => sub.key === collapseName);
    setOpen(isActiveSubroute);
  }, [collapseName, route.collapse]);

  return (
    <>
      <SidenavCollapse
        name={route.name}
        icon={route.icon}
        onClick={() => setOpen(!open)}
        active={
          route.key === collapseName 
        }
        noCollapse
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&:hover": {
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
          },
        }}
        rightIcon={
          <Box
            component="span"
            sx={{
              transition: "transform 0.3s",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              ml: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <KeyboardArrowRightIcon sx={{ color: "#ffffff" }} />
          </Box>
        }
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {route.collapse.map((subRoute) => (
            <NavLink
              key={subRoute.key}
              to={subRoute.route}
              style={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                sx={{ pl: 3 }} 
                name={subRoute.name}
                icon={subRoute.icon}
                active={subRoute.key === collapseName}
              />
            </NavLink>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default DropdownCollapse;
