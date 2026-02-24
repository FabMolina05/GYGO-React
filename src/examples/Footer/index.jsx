import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer({
  company = { href: "#", name: "Get Your Green On" },
  links = [
    { href: "/contacto", name: "Contacto0" },
    { href: "https://www.facebook.com/", name: "Facebook" },
    { href: "https://www.instagram.com/", name: "Instagram" },
    { href: "https://www.linkedin.com/", name: "LinkedIn" },
    { href: "https://github.com/", name: "GitHub" },
  ],
}) {
  const { href, name } = company;
  const { size } = typography;

  const renderLinks = () =>
    links.map((link) => (
      <MDBox key={link.name} component="li" px={2} lineHeight={1}>
        <Link href={link.href} target="_blank" rel="noopener noreferrer">
          <MDTypography variant="button" fontWeight="regular" color="text">
            {link.name}
          </MDTypography>
        </Link>
      </MDBox>
    ));

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="center"
      alignItems="center"
      px={1.5}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()} {name}. Todos los derechos reservados.
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,
          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        
      </MDBox>
    </MDBox>
  );
}



export default Footer;
