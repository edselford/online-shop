import Navbar from "@/components/Admin/Navbar";
import { CAR_QUERY, CREATE_CAR, DELETE_CAR } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Car } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Table, Container, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import toast, { Toaster } from "react-hot-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

interface Props {
  host: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({
  props: { host: context.req.headers.host || null },
});

export default function ({ host }: Props) {
  const session = useSession();
  const router = useRouter();

  const cars = useQuery(CAR_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  
  const [deleteCar] = useMutation(DELETE_CAR, {
    onCompleted() {
      toast.success("Delete car succesfully");
      cars.refetch();
    }
  })

  if (session.status == "loading") {
    return "loading data..";
  }
  if (session.status == "unauthenticated") {
    router.push(`/auth/signin?callbackUrl=http://${host}/admin/produk`);
    return;
  }
  if (session.data?.user.role == "USER") {
    router.push("/");
    return;
  }

  if (cars.loading) return <h1>Loading</h1>;

  function deletePrompt(id: string) {
    toast((t) => (
      <span>
        Apakah anda yakin ingin menghapus?
        <br />
        <Button className="mr-2" variant="danger" onClick={() => {
          deleteCar({
            variables: {id}
          });

          toast.dismiss(t.id);
        }}>Ya</Button>
        <Button variant="warning" onClick={() => toast.dismiss(t.id)}>Tidak</Button>
      </span>
    ))
  }

  return (
    <Container className="pb-5">
      <Toaster/>
      <Navbar username={session.data?.user.name} />
      <h2>Master Produk</h2>
      <hr />
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nama</th>
            <th>Brand</th>
            <th>Image</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.data.car.length !== 0 ? (
            cars.data.car.map((car: Car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.name}</td>
                <td>{car.brand}</td>
                <td>
                  <img
                    className="object-cover h-[100px] w-[200px]"
                    src={`/images/${car.image}`}
                  />
                </td>
                <td>{car.price}</td>
                <td>{car.stock}</td>
                <td>
                  <Button variant="warning" className="mr-2">
                    Edit
                  </Button>
                  <Button onClick={() => deletePrompt(car.id)} variant="danger">Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                Empty
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <CreateCar callback={cars.refetch} type="add"/>
    </Container>
  );
}

function CreateCar({ callback, type, id }: { callback: Function, type: "add"|"edit", id?: string }) {
  const [createCar] = useMutation(CREATE_CAR, {
    onCompleted: function () {
      toast.success("added to database");
      callback();
      setCarForm({
        name: "",
        brand: "",
        desc: "",
        price: 0,
        stock: 0,
      })
  
      setSelectedFile(null)
    },
  });

  

  const [carForm, setCarForm] = useState({
    name: "",
    brand: "",
    desc: "",
    price: 0,
    stock: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File|null>(null);

  const formHandler = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("uploadedFile", selectedFile);
    axios.post("/api/upload", formData);
    createCar({
      variables: {
        name: carForm.name,
        brand: carForm.brand,
        desc: carForm.desc,
        price: carForm.price,
        stock: carForm.stock,
        image: selectedFile.name.replace(" ",""),
      },
    });

    
  };

  const changeHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const key = target.id;
    const value = target.value;

    switch (key) {
      case "name":
        setCarForm({ ...carForm, name: value });
        break;
      case "brand":
        setCarForm({ ...carForm, brand: value });
        break;
      case "desc":
        setCarForm({ ...carForm, desc: value });
        break;
      case "price":
        setCarForm({ ...carForm, price: parseInt(value) });
        break;
      case "stock":
        setCarForm({ ...carForm, stock: parseInt(value) });
        break;
    }
  };

  const imageHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const file = target.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <div className="mt-5">
      <h2>Tambah Produk</h2>
      <hr />
      <Form onSubmit={formHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            id="name"
            type="text"
            required
            value={carForm.name}
            onChange={changeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            id="brand"
            type="text"
            required
            value={carForm.brand}
            onChange={changeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Desc</Form.Label>
          <Form.Control
            id="desc"
            type="text"
            required
            value={carForm.desc}
            onChange={changeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            id="price"
            type="number"
            required
            value={carForm.price}
            onChange={changeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            id="stock"
            type="number"
            required
            value={carForm.stock}
            onChange={changeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            id="image"
            type="file"
            required
            onChange={imageHandler}
          />
        </Form.Group>
        <Button className="mr-2" type="submit" variant="success">
          Add
        </Button>
        <Button type="reset" variant="danger">
          Cancel
        </Button>
      </Form>
    </div>
  );
}
