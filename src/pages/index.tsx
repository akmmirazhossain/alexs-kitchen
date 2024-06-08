import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Explicitly typing menuItems as an array of MenuItem

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get<MenuItem[]>('https://data.mazedanetworks.net/apis/menu.json'); // Specify the response type as MenuItem[]
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={3}>
        {menuItems.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
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
                {/* <img src={item.image} alt={item.name} style={{ width: '100%', marginTop: '10px' }} /> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuPage;
