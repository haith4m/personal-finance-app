import { useEffect, useState, memo } from "react";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
<<<<<<< HEAD
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../context/ThemeContext";

=======
import { Link as RouterLink, useLocation } from "react-router-dom";
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
import { useAuth } from "../hooks/useAuth";
import supabase from "../utils/supabase";

function ResponsiveAppBar({ mode, onToggleTheme }) {
  const { session, loading } = useAuth();
<<<<<<< HEAD
  const theme = useTheme();
  const colorMode = useColorMode();

=======
  const location = useLocation();
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    setAnchorElNav(null);
  }, [location.pathname]);

  if (loading) return null;

  const pages = !session
    ? [
        { name: "Home", path: "/" },
        { name: "Sign In", path: "/auth/sign-in" },
        { name: "Sign Up", path: "/auth/sign-up" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Transactions", path: "/transactions" },
        { name: "Budgets", path: "/budgets" },
        { name: "Reports", path: "/reports" },
        { name: "Goals", path: "/goals" },
      ];

  const brandStyles = {
    color: "text.primary",
    textDecoration: "none",
    fontFamily: '"Cormorant Garamond", serif',
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
  };

  const kickerStyles = {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: 11,
    color: "text.secondary",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    mt: 0.5,
  };

  return (
<<<<<<< HEAD
    <AppBar position="static" color="default" elevation={1}>
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
=======
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 82, gap: 2 }}>

          {/* MOBILE: flat bar with brand left, icons right */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                component={RouterLink}
                to={session ? "/dashboard" : "/"}
                sx={{ ...brandStyles, fontSize: 28 }}
              >
                Personal Finance App
              </Box>
              <Box sx={kickerStyles}>Personal finance, in print</Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={onToggleTheme}
                aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
                sx={{ color: "text.primary", borderRadius: "999px" }}
              >
                {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
              </IconButton>
              <IconButton onClick={handleOpenNavMenu} sx={{ color: "text.primary", borderRadius: "999px" }}>
                <MenuIcon />
              </IconButton>
            </Box>

>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
            <Menu
              anchorEl={anchorElNav?.isConnected ? anchorElNav : null}
              open={Boolean(anchorElNav?.isConnected)}
              onClose={handleCloseNavMenu}
              keepMounted
            >
              {pages.map((page) => (
                <MenuItem key={page.name} component={RouterLink} to={page.path} onClick={handleCloseNavMenu}>
                  {page.name}
                </MenuItem>
              ))}
              {session && (
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* DESKTOP: one unified rounded pill containing brand + nav */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              px: 2.5,
              py: 1,
              borderRadius: "999px",
              border: "1px solid",
              borderColor: "divider",
              background:
                mode === "light"
                  ? "linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(239, 225, 203, 0.92))"
                  : "linear-gradient(180deg, rgba(42, 33, 28, 0.96), rgba(29, 23, 19, 0.96))",
              backdropFilter: scrolled ? "blur(12px)" : "none",
              boxShadow: scrolled
                ? mode === "light"
                  ? "10px 10px 0 rgba(33, 27, 23, 0.22)"
                  : "10px 10px 0 rgba(0, 0, 0, 0.42)"
                : mode === "light"
                  ? "8px 8px 0 rgba(33, 27, 23, 0.14)"
                  : "8px 8px 0 rgba(0, 0, 0, 0.28)",
              transition: "box-shadow 0.25s ease, backdrop-filter 0.25s ease",
            }}
          >
            {/* Brand */}
            <Box sx={{ display: "flex", flexDirection: "column", pl: 1 }}>
              <Box
                component={RouterLink}
                to={session ? "/dashboard" : "/"}
                sx={{ ...brandStyles, fontSize: 30 }}
              >
                Personal Finance App
              </Box>
              <Box sx={kickerStyles}>Personal finance, in print</Box>
            </Box>

            {/* Nav links + theme toggle + logout */}
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <Button
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    variant={isActive ? "contained" : "text"}
                    color={isActive ? "secondary" : "inherit"}
                    sx={{
                      minWidth: "fit-content",
                      px: 2.4,
                      py: 1.15,
                      borderRadius: "999px",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: isActive ? "secondary.main" : "transparent",
                      color: isActive ? "secondary.contrastText" : "text.secondary",
                      backgroundColor: isActive ? undefined : "transparent",
                      boxShadow: isActive
                        ? mode === "light"
                          ? "4px 4px 0 rgba(33, 27, 23, 0.18)"
                          : "4px 4px 0 rgba(0, 0, 0, 0.34)"
                        : "none",
                      "&:hover": {
                        borderColor: isActive ? "secondary.main" : "divider",
                        color: "text.primary",
                        backgroundColor:
                          mode === "light" ? "rgba(24, 21, 18, 0.05)" : "rgba(243, 232, 213, 0.06)",
                      },
                    }}
                  >
                    {page.name}
                  </Button>
                );
              })}

              <Box
                sx={{
                  width: 1,
                  alignSelf: "stretch",
                  borderRadius: "999px",
                  backgroundColor: "divider",
                  mx: 0.5,
                }}
              />

              <IconButton
                onClick={onToggleTheme}
                aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
                sx={{
                  color: "text.primary",
                  borderRadius: "999px",
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow:
                    mode === "light" ? "4px 4px 0 rgba(33, 27, 23, 0.12)" : "4px 4px 0 rgba(0, 0, 0, 0.25)",
                  "&:hover": {
                    backgroundColor: "background.paper",
                  },
                }}
              >
                {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
              </IconButton>

              {session && (
                <Button
                  onClick={handleLogout}
                  variant="text"
                  sx={{
                    px: 2.1,
                    py: 1.05,
                    borderRadius: "999px",
                    color: "text.secondary",
                    fontFamily: '"IBM Plex Mono", monospace',
                    letterSpacing: "0.08em",
                    "&:hover": {
                      color: "error.main",
                      backgroundColor: mode === "light" ? "rgba(160, 65, 47, 0.06)" : "rgba(204, 109, 89, 0.08)",
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Box>
<<<<<<< HEAD
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
=======

>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default memo(ResponsiveAppBar);
