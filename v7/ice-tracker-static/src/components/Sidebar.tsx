import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar } from '../features/ui/uiSlice';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Map View', icon: <MapIcon />, path: '/map' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Reports', icon: <AssignmentIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? 240 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 240 : 60,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen && (
            <Typography variant="h6" noWrap>
              ICE Tracker
            </Typography>
          )}
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                selected={location.pathname === item.path}
                sx={{ 
                  minHeight: 48,
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sidebarOpen && (
            <Typography variant="caption" color="text.secondary">
              Tracking ICE activities across the United States
            </Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;