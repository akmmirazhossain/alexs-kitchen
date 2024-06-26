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

// DEFINE INTERFACE FOR MENU ITEM
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

  // LOAD DATA FROM COOKIES/API
  useEffect(() => {
    const cookieMenuItems = cookies.menuItems;
    if (cookieMenuItems) {
      setMenuItems(cookieMenuItems);
    } else {
      restoreDataFromAPI();
    }
  }, [cookies]);

  // FUNCTION TO RESTORE DATA FROM THE API
  const restoreDataFromAPI = async () => {
    try {
      const response = await axios.get<MenuItem[]>(
        "https://data.mazedanetworks.net/apis/menu.json"
      );

      // CONVERT RESPONSE DATA TO JSON FORMAT AND STORE IN THE COOKIE
      const jsonData = JSON.stringify(response.data);
      setMenuItems(response.data);

      setCookie("menuItems", jsonData, { path: "/", maxAge: 86400 });
    } catch (error) {
      console.error("Error fetching API:", error);
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
    if (selectedMenuItem) {
      setNewItem(selectedMenuItem);
      setOpen(true);
    }
    handleClose();
  };

  const handleSaveEdit = () => {
    const index = menuItems.findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
      // UPDATE THE MENUITEMS ARRAY WITH THE EDITED ITEM
      const updatedItems = [...menuItems];
      updatedItems[index] = newItem;
      setMenuItems(updatedItems);
      setCookie("menuItems", updatedItems, { path: "/", maxAge: 86400 });
      setOpen(false);
    }
  };

  const handleDelete = () => {
    const updatedItems = menuItems.filter((item) => item !== selectedMenuItem);
    setMenuItems(updatedItems);
    setCookie("menuItems", updatedItems, { path: "/", maxAge: 86400 });
    handleClose();
  };

  const handleDialogClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const updatedItems = [...menuItems, { ...newItem, id: Date.now() }];
    setMenuItems(updatedItems);
    setCookie("menuItems", updatedItems, { path: "/", maxAge: 86400 });
    setOpen(false);
  };

  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  const handleAddItemClick = () => {
    setIsAddingNewItem(true);
    setOpen(true);
  };

  const handleSaveNewItem = () => {
    const updatedItems = [...menuItems, { ...newItem, id: Date.now() }];
    setMenuItems(updatedItems);
    setCookie("menuItems", updatedItems, { path: "/", maxAge: 86400 });
    setOpen(false);
    setIsAddingNewItem(false);
  };

  const handleAddItemCancel = () => {
    setOpen(false);
    setIsAddingNewItem(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url('food_bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <div className="text-3xl lg:text-5xl py-6 lg:py-10 border-b-2">
          Alex&apos;s Kitchen
        </div>
        <div className="flex justify-between pt-4">
          <div className="text-2xl lg:text-3xl">Our Menu</div>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItemClick}
            >
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
        </div>

        <Dialog open={open && isAddingNewItem} onClose={handleAddItemCancel}>
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
            <Button onClick={handleAddItemCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveNewItem} color="primary">
              Add Item
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open && !isAddingNewItem} onClose={handleDialogClose}>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={newItem.name}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="category"
              label="Category"
              fullWidth
              value={newItem.category}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={newItem.price}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="details"
              label="Details"
              fullWidth
              value={newItem.details}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="image"
              label="Image URL"
              fullWidth
              value={newItem.image}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3}>
          {menuItems
            .slice()
            .reverse()
            .map((item) => (
              <Grid
                item
                key={item.id}
                xs={12}
                sm={6}
                md={4}
                className="relative"
              >
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
                          {item.category}
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
                          <FontAwesomeIcon
                            size="sm"
                            icon={faEllipsisVertical}
                          />
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
    </div>
  );
};

export default MenuPage;
