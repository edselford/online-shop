import { CAR_QUERY, CREATE_CAR } from "@/lib/queries";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import { Car } from "@prisma/client";
import axios from "axios";
import {
  TextInput,
  FileInput,
  Button,
  Table,
  Card,
  Label,
} from "flowbite-react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, ChangeEvent, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export const getServerSideProps: GetServerSideProps<{
  host: string | null;
}> = async (context) => ({
  props: { host: context.req.headers.host || null },
});
export default function ({ host }: { host: string }) {
  const session = useSession();
  const router = useRouter();

  if (session.status == "loading") {
    return (
      <div className="dark:bg-github-dark-bg1 grid place-items-center min-h-screen dark:text-white pt-5">
        <h1>Loading</h1>
      </div>
    );
  }

  if (session.status == "unauthenticated") {
    router.push(`/auth/signin?callbackUrl=http://${host}/admin/car`);
    return;
  }

  if (session.data?.user.role == "USER") {
    router.push("/");
    return;
  }

  const cars = useQuery(CAR_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  return (
    <div className="dark:bg-github-dark-bg1 min-h-screen dark:text-white pt-5">
      <Toaster/>
      <div className="flex md:flex-row flex-col">
      <AddCar callback={() => cars.refetch()}/>
      <CarList cars={cars} />
</div>
    </div>
  );
}

function CarList({ cars }: { cars: QueryResult }) {
  console.log(cars);
  if (cars.loading) return <h1>Loading</h1>;
  return (
    <Card className="m-2">
      <Table className="w-full">
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Brand</Table.HeadCell>
          <Table.HeadCell>Desc</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Stock</Table.HeadCell>
          <Table.HeadCell>Image</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {cars.data.car.length !== 0 ? (
            cars.data.car.map((car: Car) => (
              <Table.Row key={car.id}>
<Table.Cell>
                  <img src={`/images/${car.image}`} width="100px" />
                </Table.Cell>
                <Table.Cell>{car.name}</Table.Cell>
                <Table.Cell>{car.brand}</Table.Cell>
                <Table.Cell>{car.description}</Table.Cell>
                <Table.Cell>{car.price}</Table.Cell>
                <Table.Cell>{car.stock}</Table.Cell>
                
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                Empty
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
}

function AddCar({callback}: {callback:Function}) {
  const [createCar] = useMutation(CREATE_CAR, {
    onCompleted: function() {
      toast.success("added to database")
      callback();
    }
  });
  const [carForm, setCarForm] = useState({
    name: "",
    brand: "",
    desc: "",
    price: 0,
    stock: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File>();

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
        image: selectedFile.name,
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
    <Card className="m-2">
      <h1>Add Car</h1>
      <form onSubmit={formHandler}>
        <div className="mt-2">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput
            id="name"
            type="text"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="mt-2">
          <div className="mb-2 block">
            <Label htmlFor="brand" value="Brand" />
          </div>
          <TextInput
            id="brand"
            type="text"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="mt-2">
          <div className="mb-2 block">
            <Label htmlFor="desc" value="Description" />
          </div>
          <TextInput
            id="desc"
            type="text"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="mt-2">
          <div className="mb-2 block">
            <Label htmlFor="price" value="Price" />
          </div>
          <TextInput
            id="price"
            type="number"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="mt-2">
          <div className="mb-2 block">
            <Label htmlFor="stock" value="Stock" />
          </div>
          <TextInput
            id="stock"
            type="number"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image" value="Image" />
          </div>
          <FileInput id="image" onChange={imageHandler} required />
        </div>
        <Button type="submit" className="mt-2 w-full">
          Add
        </Button>
      </form>
    </Card>
  );
}
