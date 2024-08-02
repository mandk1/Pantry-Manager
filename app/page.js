"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import {firestore} from "@/firebase";
import { Typography, Box, Modal, Stack, TextField, Button} from "@mui/material";
import { collection, deleteDoc, doc, getDocs, getDoc, query, itemNames, setDoc} from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }



  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)


    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


  return (
  <Box 
    width="100vw" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center"
    gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemNames}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            ></TextField>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      
      <Box
        display="flex"
        justifyContent="space-between"
        width="70%"
        mb={2}
      >
        <Stack width="100%" direction="row" spacing={2}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      <Button
        variant="contained" onClick={()=>{
          handleOpen()
        }}
        sx={{
          backgroundColor: "#2b3bff", color: "#fff"
        }}
      >Add New Item</Button>
      </Stack>
      </Box>

      <Box border="1px solid #333"> 
        <Box
          width="800px" 
          height="100px" 
          bgcolor="#2b3bff"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" color="#fff">
            Inventory Items
          </Typography>
        </Box>
      
      <Stack width="800px" height="300px" spacing={2} overflow="auto" bgcolor="#e6e6e6" >
        {
          filteredInventory.map(({name, quantity})=>(
            <Box 
              key={name} 
              width="100%" 
              minHeight="150px" 
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#f0f0f0"
              padding={5}
            > 
              <Typography 
                variant="h3" 
                color="#333"
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant="h3" 
                color="#333"
                textAlign="center"
              >
                {quantity}
              </Typography>
              
              <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                onClick={()=>{addItem(name)}}
                sx={{
                  backgroundColor: "#2b3bff", color: "#fff"
                }}  
              >
                    Add
                </Button>

                <Button 
                variant="contained" 
                onClick={()=>{removeItem(name)}}
                sx={{
                  backgroundColor: "#1c1c1c", color: "#fff"
                }}>
                    Remove
                </Button>
              </Stack>
            </Box>

          ))
        }
      </Stack>
      </Box>
  </Box>
  )
}
