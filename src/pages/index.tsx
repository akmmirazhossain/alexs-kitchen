import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";

// Define interface for menu item
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  details: string;
  image: string;
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [cookies, setCookie] = useCookies(["menuItems"]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState<MenuItem>({
    id: Date.now(),
    name: "",
    category: "",
    price: 0,
    details: "",
    image: "",
  });

  // Load data from cookies or API
  useEffect(() => {
    const cookieMenuItems = cookies.menuItems;
    if (cookieMenuItems) {
      // Sort items in descending order
      const sortedItems = [...cookieMenuItems].sort((a, b) => b.id - a.id);
      setMenuItems(sortedItems);
    } else {
      restoreDataFromAPI();
    }
  }, [cookies]);

  // Function to restore data from the API
  const restoreDataFromAPI = async () => {
    try {
      const response = await axios.get<MenuItem[]>(
        "https://data.mazedanetworks.net/apis/menu.json"
      );
      // Sort items in descending order
      const sortedItems = [...response.data].sort((a, b) => b.id - a.id);
      setMenuItems(sortedItems);
      setCookie("menuItems", sortedItems, { path: "/", maxAge: 86400 }); // 1 day expiration
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: MenuItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenuItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMenuItem(null);
  };

  const handleEdit = () => {
    console.log("Edit clicked for:", selectedMenuItem);
    handleClose();
  };

  const handleDelete = () => {
    const updatedItems = menuItems.filter((item) => item !== selectedMenuItem);
    // Sort items in descending order
    const sortedItems = [...updatedItems].sort((a, b) => b.id - a.id);
    setMenuItems(sortedItems);
    setCookie("menuItems", sortedItems, { path: "/", maxAge: 86400 });
    console.log("Delete clicked for:", selectedMenuItem);
    handleClose();
  };

  const handleOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const updatedItems = [...menuItems, { ...newItem, id: Date.now() }];
    // Sort items in descending order
    const sortedItems = [...updatedItems].sort((a, b) => b.id - a.id);
    setMenuItems(sortedItems);
    setCookie("menuItems", sortedItems, { path: "/", maxAge: 86400 });
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Item
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={restoreDataFromAPI}
        >
          Restore Data from API
        </Button>
      </Box>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="details"
            label="Details"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} className="relative">
            <Box boxShadow={4} borderRadius={8} overflow="hidden">
              <Card>
                <CardContent className="grid grid-cols-2">
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", marginTop: "10px" }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Category: {item.category}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Price: {item.price} TK
                    </Typography>
                    <Typography variant="body2" component="p">
                      {item.details}
                    </Typography>
                  </div>

                  <div className="absolute top-10 right-2 w-6">
                    <IconButton onClick={(e) => handleMenuClick(e, item)}>
                      <FontAwesomeIcon size="sm" icon={faEllipsisVertical} />
                    </IconButton>
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuPage;
