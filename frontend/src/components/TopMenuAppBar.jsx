import { IconButton, Button, Typography, Toolbar, Box, AppBar, Avatar } from '@mui/material';
import Menu from '@mui/material/Menu';
 
export default function TopMenuAppBar() {
return (
<Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                >
            <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                My Tasks
            </Typography>
            <Avatar alt="avatar of me" src="/static/images/prf-50.jpg" />
            <Button color="inherit">Logout</Button>
        </Toolbar>
    </AppBar>
</Box>
);
}