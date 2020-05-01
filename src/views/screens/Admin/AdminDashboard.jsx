import React from 'react'
import { Table } from 'reactstrap'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'
import swal from 'sweetalert'


class AdminDashboard extends React.Component {
    state = {
        producList: [],
        createForm: {
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: ""
        },
        editForm: {
            id: 0,
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: ""
        }

    }

    getProductList = () => {
        Axios.get(`${API_URL}/products`)
            .then(res => {
                this.setState({ producList: res.data})
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getProductList()
    }

    renderProductLists = () => {
        const { producList } = this.state
        return producList.map((val, idx) => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td>{val.productName}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.price)}</td>
                    <td>{val.category}</td>
                    <td><img src={val.image} style={{ height: "150px", width: "100px", objectFit: "contain" }} /></td>
                    <td>{val.desc}</td>
                    <td>
                        <ButtonUI type="contained" onClick={() => this.editBtnHandler(idx)}>Edit</ButtonUI>
                    </td>
                    <td>
                        <ButtonUI type="outlined">Delete</ButtonUI>
                    </td>
                </tr>
            )
        })
    }

    inputHandler = (e, field, form) => {
        const { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    createProductHandler = () => {
        Axios.post(`${API_URL}/products`, this.state.createForm)
        .then(res => {
            swal("Sukses", "Item berhasil ditambah", "success")
            this.setState({
                createForm: {
                  productName: "",
                  price: 0,
                  category: "Phone",
                  image: "",
                  desc: "",
                },
              });
            this.getProductList()
        })
        .catch(err => {
            swal('Gagal', "Item Gagal Ditambah", "error")
        })
    }

    editBtnHandler = (idx) => {
        this.setState({editForm: {
            ...this.state.producList[idx]
        }})
    }

    editProductHandler = () => {
        Axios.put(`${API_URL}/products/${this.state.editForm.id}`, this.state.editForm)
        .then(res => {
            swal("Sukses", "Item berhasil diedit", "success")
            this.getProductList()
        })
        .catch(err => {
            swal('Gagal', "Item Gagal diedit", "error")
        })
    } 





    render() {
        return (
            <div className="container py-4">
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderProductLists()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}>
                                <TextField onChange={(e) => this.inputHandler(e, 'productName', 'createForm')}
                                value={this.state.createForm.productName} placeholder="Name" /></td>
                            <td>
                                <TextField onChange={(e) => this.inputHandler(e, 'price', 'createForm')} 
                                value={this.state.createForm.price} placeholder="Price" /></td>
                            <td colSpan={2}>
                                <select className="form-control" value={this.state.createForm.category}
                                onChange={(e) => this.inputHandler(e, 'category', 'createForm')}>
                                    <option>Phone</option>
                                    <option>Laptop</option>
                                    <option>Tab</option>
                                    <option>Dekstop</option>
                                </select>
                            </td>
                            <td>
                                <TextField onChange={(e) => this.inputHandler(e, 'image', 'createForm')} value={this.state.createForm.image}
                                placeholder="Image" /></td>
                            <td colSpan={2}>
                                <TextField onChange={(e) => this.inputHandler(e, 'desc', 'createForm')} value={this.state.createForm.desc} placeholder="Description" /></td>
                        </tr>
                        <tr>
                            <td colSpan={7}></td>
                            <td colSpan={1}>
                                <ButtonUI type="contained" onClick={this.createProductHandler}>Create</ButtonUI>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <TextField onChange={(e) => this.inputHandler(e, 'productName', 'editForm')}
                                value={this.state.editForm.productName} placeholder="Name" /></td>
                            <td>
                                <TextField onChange={(e) => this.inputHandler(e, 'price', 'editForm')}
                                value={this.state.editForm.price} placeholder="Price" /></td>
                            <td colSpan={2}>
                                <select className="form-control" onChange={(e) => this.inputHandler(e, 'category', 'editForm')}
                                value={this.state.editForm.category}>
                                    <option>Phone</option>
                                    <option>Laptop</option>
                                    <option>Tab</option>
                                    <option>Dekstop</option>
                                </select>
                            </td>
                            <td>
                                <TextField onChange={(e) => this.inputHandler(e, 'image', 'editForm')} 
                                value={this.state.editForm.image} placeholder="Image" /></td>
                            <td colSpan={2}>
                                <TextField onChange={(e) => this.inputHandler(e, 'desc', 'editForm')} 
                                value={this.state.editForm.desc} placeholder="Description" /></td>
                        </tr>
                        <tr>
                            <td colSpan={7}></td>
                            <td colSpan={1}>
                                <ButtonUI type="contained" onClick={this.editProductHandler}>Save</ButtonUI>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        )
    }
}
export default AdminDashboard