// customerSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customersArray: [
    // Initial customer data goes here if any
    {
      id: 1,
      cedula: '0931237663',
      nombres: 'John Andrés Palacios Tutiven',
      apellidos: 'George White',
      celular: '0988949117',
      email: 'johnpalacios.t@gmail.com',
      active: true,
    },
    {
      id: 2,
      cedula: '0931237663',
      nombres: 'Another Customer',
      apellidos: 'George White',
      celular: '123456789',
      email: 'another.customer@example.com',
      active: false,
    },
    {
      id: 3,
      cedula: '0931237663',
      nombres: 'Jane Doe',
      apellidos: 'George White',
      celular: '987654321',
      email: 'jane.doe@example.com',
      active: true,
    },
    {
      id: 4,
      cedula: '0931237663',
      nombres: 'Bob Johnson',
      apellidos: 'George White',
      celular: '555555555',
      email: 'bob.johnson@example.com',
      active: false,
    },
    {
      id: 5,
      cedula: '0931237663',
      nombres: 'Alice Smith',
      apellidos: 'George White',
      celular: '123123123',
      email: 'alice.smith@example.com',
      active: true,
    },
    {
      id: 6,
      cedula: '0931237663',
      nombres: 'Charlie Brown',
      apellidos: 'George White',
      celular: '987987987',
      email: 'charlie.brown@example.com',
      active: false,
    },
    {
      id: 7,
      cedula: '0931237663',
      nombres: 'Eve Johnson',
      apellidos: 'George White',
      celular: '456456456',
      email: 'eve.johnson@example.com',
      active: true,
    },
    {
      id: 8,
      cedula: '0931237663',
      nombres: 'George White',
      apellidos: 'George White',
      celular: '789789789',
      email: 'george.white@example.com',
      active: false,
    },
    {
      id: 9,
      cedula: '0931237663',
      nombres: 'Olivia Brown',
      apellidos: 'George White',
      celular: '111222333',
      email: 'olivia.brown@example.com',
      active: true,
    },
    {
      id: 10,
      cedula: '0931237663',
      nombres: 'Michael Davis',
      apellidos: 'George White',
      celular: '444555666',
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
      nombres: 'John Andrés Palacios Tutiven',
      apellidos: 'George White',
      celular: '0988949117',
      email: 'johnpalacios.t@gmail.com',
      active: true,
    },
    {
      id: 2,
      cedula: '0931237663',
      nombres: 'Another Customer',
      apellidos: 'George White',
      celular: '123456789',
      email: 'another.customer@example.com',
      active: false,
    },
    {
      id: 3,
      cedula: '0931237663',
      nombres: 'Jane Doe',
      apellidos: 'George White',
      celular: '987654321',
      email: 'jane.doe@example.com',
      active: true,
    },
    {
      id: 4,
      cedula: '0931237663',
      nombres: 'Bob Johnson',
      apellidos: 'George White',
      celular: '555555555',
      email: 'bob.johnson@example.com',
      active: false,
    },
    {
      id: 5,
      cedula: '0931237663',
      nombres: 'Alice Smith',
      apellidos: 'George White',
      celular: '123123123',
      email: 'alice.smith@example.com',
      active: true,
    },
    {
      id: 6,
      cedula: '0931237663',
      nombres: 'Charlie Brown',
      apellidos: 'George White',
      celular: '987987987',
      email: 'charlie.brown@example.com',
      active: false,
    },
    {
      id: 7,
      cedula: '0931237663',
      nombres: 'Eve Johnson',
      apellidos: 'George White',
      celular: '456456456',
      email: 'eve.johnson@example.com',
      active: true,
    },
    {
      id: 8,
      cedula: '0931237663',
      nombres: 'George White',
      apellidos: 'George White',
      celular: '789789789',
      email: 'george.white@example.com',
      active: false,
    },
    {
      id: 9,
      cedula: '0931237663',
      nombres: 'Olivia Brown',
      apellidos: 'George White',
      celular: '111222333',
      email: 'olivia.brown@example.com',
      active: true,
    },
    {
      id: 10,
      cedula: '0931237663',
      nombres: 'Michael Davis',
      apellidos: 'George White',
      celular: '444555666',
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
      state.customersFilter = state.customersArray.filter(
        (customer) =>
          customer.cedula.toLowerCase().includes(searchData) ||
          customer.nombres.toLowerCase().includes(searchData) ||
          customer.apellidos.toLowerCase().includes(searchData) ||
          customer.email.toLowerCase().includes(searchData),
      )

      if (searchData === '') {
        state.customersFilter = state.customersArray
      }
    },
  },
})

export const customerActions = customerSlice.actions
export default customerSlice.reducer
