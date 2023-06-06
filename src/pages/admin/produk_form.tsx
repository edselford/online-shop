import Navbar from "@/components/Admin/Navbar";
import { CREATE_CAR, EDIT_CAR, FIND_CAR } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import { Car } from "@prisma/client";

interface Props {
  host: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({
  props: { host: context.req.headers.host || null },
});

export default function CreateCar({ host }: Props) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth/signin?callbackUrl=http://${host}/admin/produk_form`);
    },
  });
  const router = useRouter();

  const data = useQuery(FIND_CAR, {
    skip: !router.query.id,
    variables: {
      id: router.query.id,
    },
    onCompleted(data) {
      const car = data.carById as Car;
      setCarForm({
        name: car.name,
        brand: car.brand,
        desc: car.description,
        price: car.price,
        stock: car.stock,
      });
    },
  });

  const [editCar] = useMutation(EDIT_CAR, {
    onCompleted() {
      router.push("produk");
    },
  });

  const [createCar] = useMutation(CREATE_CAR, {
    onCompleted: function () {
      toast.success("added to database");
      router.push("produk");
    },
  });

  const [carForm, setCarForm] = useState({
    name: "",
    brand: "",
    desc: "",
    price: 0,
    stock: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (session.status == "loading") {
    return "loading data..";
  }

  if (session.data?.user.role == "USER") {
    router.push("/");
    return;
  }

  const formHandler = (event: FormEvent) => {
    event.preventDefault();

    if (data.called) {

      let image = (data.data.carById as Car).image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("uploadedFile", selectedFile);
        axios.post("/api/upload", formData);
        image = selectedFile.name.replace(" ", "")
      }
      
      editCar({
        variables: {
          id: router.query.id,
          name: carForm.name,
          brand: carForm.brand,
          desc: carForm.desc,
          price: carForm.price,
          stock: carForm.stock,
          image
        },
      });
      return;
    }

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
        image: selectedFile.name.replace(" ", ""),
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
    <Container>
      <Navbar username={session.data.user.name} />
      <div className="mt-5">
        <h2>{data.called ? "Edit" : "Tambah"} Produk</h2>
        <hr />
        <Form onSubmit={formHandler}>
          <div className="!flex !flex-row !w-full">
            <Form.Group className="mb-3 mr-3 !w-full">
              <Form.Label>Name</Form.Label>
              <Form.Control
                id="name"
                type="text"
                required
                value={carForm.name}
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3 !w-full">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                id="brand"
                type="text"
                required
                value={carForm.brand}
                onChange={changeHandler}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Desc</Form.Label>
            <Form.Control
              id="desc"
              as="textarea"
              required
              value={carForm.desc}
              onChange={changeHandler}
            />
          </Form.Group>
          <div className="!flex !flex-row !w-full">
            <Form.Group className="mb-3 mr-3 !w-full">
              <Form.Label>Price</Form.Label>
              <Form.Control
                id="price"
                type="number"
                required
                value={carForm.price}
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3 !w-full">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                id="stock"
                type="number"
                required
                value={carForm.stock}
                onChange={changeHandler}
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>
              Image
              {data.data &&
                <img src={`/images/${(data.data.carById as Car).image}`} className="w-[200px] object-cover rounded-lg"/>
              }
            </Form.Label>
            <Form.Control
              id="image"
              type="file"
              required={!data.called}
              onChange={imageHandler}
            />
          </Form.Group>
          <Button className="mr-2" type="submit" variant="success">
            {data.called ? "Edit" : "Add"}
          </Button>
          <Button onClick={() => router.push("produk")} variant="danger">
            Cancel
          </Button>
        </Form>
      </div>
    </Container>
  );
}
