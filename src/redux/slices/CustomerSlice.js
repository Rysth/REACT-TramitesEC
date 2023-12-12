// customerSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customersArray: [
    // Initial customer data goes here if any
    {
      id: 1,
      cedula: '0931237663',
      fullName: 'John Andrés Palacios Tutiven',
      cellphone: '0988949117',
      email: 'johnpalacios.t@gmail.com',
      active: true,
    },
    {
      id: 2,
      cedula: '0931237663',
      fullName: 'Another Customer',
      cellphone: '123456789',
      email: 'another.customer@example.com',
      active: false,
    },
    {
      id: 3,
      cedula: '0931237663',
      fullName: 'Jane Doe',
      cellphone: '987654321',
      email: 'jane.doe@example.com',
      active: true,
    },
    {
      id: 4,
      cedula: '0931237663',
      fullName: 'Bob Johnson',
      cellphone: '555555555',
      email: 'bob.johnson@example.com',
      active: false,
    },
    {
      id: 5,
      cedula: '0931237663',
      fullName: 'Alice Smith',
      cellphone: '123123123',
      email: 'alice.smith@example.com',
      active: true,
    },
    {
      id: 6,
      cedula: '0931237663',
      fullName: 'Charlie Brown',
      cellphone: '987987987',
      email: 'charlie.brown@example.com',
      active: false,
    },
    {
      id: 7,
      cedula: '0931237663',
      fullName: 'Eve Johnson',
      cellphone: '456456456',
      email: 'eve.johnson@example.com',
      active: true,
    },
    {
      id: 8,
      cedula: '0931237663',
      fullName: 'George White',
      cellphone: '789789789',
      email: 'george.white@example.com',
      active: false,
    },
    {
      id: 9,
      cedula: '0931237663',
      fullName: 'Olivia Brown',
      cellphone: '111222333',
      email: 'olivia.brown@example.com',
      active: true,
    },
    {
      id: 10,
      cedula: '0931237663',
      fullName: 'Michael Davis',
      cellphone: '444555666',
      email: 'michael.davis@example.com',
      active: false,
    },
    // Add more customers as needed
  ],
  customersFilter: [
    // Initial customer data goes here if any
    {
      id: 1,
      cedula: '0931237663',
      fullName: 'John Andrés Palacios Tutiven',
      cellphone: '0988949117',
      email: 'johnpalacios.t@gmail.com',
      active: true,
    },
    {
      id: 2,
      cedula: '0931237663',
      fullName: 'Another Customer',
      cellphone: '123456789',
      email: 'another.customer@example.com',
      active: false,
    },
    {
      id: 3,
      cedula: '0931237663',
      fullName: 'Jane Doe',
      cellphone: '987654321',
      email: 'jane.doe@example.com',
      active: true,
    },
    {
      id: 4,
      cedula: '0931237663',
      fullName: 'Bob Johnson',
      cellphone: '555555555',
      email: 'bob.johnson@example.com',
      active: false,
    },
    {
      id: 5,
      cedula: '0931237663',
      fullName: 'Alice Smith',
      cellphone: '123123123',
      email: 'alice.smith@example.com',
      active: true,
    },
    {
      id: 6,
      cedula: '0931237663',
      fullName: 'Charlie Brown',
      cellphone: '987987987',
      email: 'charlie.brown@example.com',
      active: false,
    },
    {
      id: 7,
      cedula: '0931237663',
      fullName: 'Eve Johnson',
      cellphone: '456456456',
      email: 'eve.johnson@example.com',
      active: true,
    },
    {
      id: 8,
      cedula: '0931237663',
      fullName: 'George White',
      cellphone: '789789789',
      email: 'george.white@example.com',
      active: false,
    },
    {
      id: 9,
      cedula: '0931237663',
      fullName: 'Olivia Brown',
      cellphone: '111222333',
      email: 'olivia.brown@example.com',
      active: true,
    },
    {
      id: 10,
      cedula: '0931237663',
      fullName: 'Michael Davis',
      cellphone: '444555666',
      email: 'michael.davis@example.com',
      active: false,
    },
    // Add more customers as needed
  ],
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    searchCustomer: (state, action) => {
      const searchData = action.payload
      state.customersFilter = state.customersArray.filter((customer) =>
        customer.cedula.toLowerCase().includes(searchData),
      )

      if (searchData === '') {
        state.customersFilter = state.customersArray
      }
    },
  },
})

export const customerActions = customerSlice.actions
export default customerSlice.reducer
