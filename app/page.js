'use client';
import { useState, useEffect } from 'react';
import { Box, Modal, Typography, Stack, Button, TextField } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const firestore = typeof window !== 'undefined' ? require('@/firebase').firestore : null;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to update the inventory
  const updateInventory = async () => {
    if (!firestore) return;
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    if (!firestore) return;
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
      await updateInventory();
    }
  };

  const addItem = async (item) => {
    if (!firestore) return;
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // useEffect to call updateInventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      bgcolor={"#eee1ee"}
      flexDirection="column"
      justifyContent='start'
      alignItems='center'
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position='absolute'
          top='50%'
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          fontFamily={"Georgia"}
          display="flex"
          flexDirection='column'
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button variant='outlined' onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border="1px solid #903c91" margin={'40px auto 0'} >
        <Box
          width="800px"
          height="70px"
          margin={"10px 10px"}
          bgcolor="#9e429e"
          display="flex"
          alignItems="center"
          justifyContent={'center'}
        >
          <Typography variant='h3' color='#ffffff' fontFamily={"Georgia"}>
            Pantry Items
          </Typography>
        </Box>
      </Box>
      <Box width="50%" margin="10px auto">
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search items...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Button variant='contained' onClick={handleOpen}>
        Add new Item
      </Button>
      <Stack
        width='600px'
        height='300px'
        spacing={2}
        overflow={"auto"}
        
        marginTop={"10px"}
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width={"100%"}
            maxHeight="80px"
            display={"flex"}
            alignItems={'center'}
            justifyContent={"space-between"}
            bgcolor={'#ddc0dd'}
            fontFamily={"Georgia"}
            padding={5}
          >
            <Typography
              variant='h5'
              color={'#333'}
              textAlign={'center'}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography
              variant='h5'
              color={'#333'}
              textAlign={'center'}
            >
              {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
