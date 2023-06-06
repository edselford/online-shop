import Navbar from "@/components/Admin/Navbar";
import { CAR_QUERY, DELETE_CAR } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Car } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Table, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  host: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({
  props: { host: context.req.headers.host || null },
});

export default function ({ host }: Props) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth/signin?callbackUrl=http://${host}/admin/produk`);
    }
  });
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

  if (session.data.user.role == "USER") {
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
                  <Button onClick={() => router.push({
                    pathname: "produk_form",
                    query: {
                      id: car.id
                    }
                  })} variant="warning" className="mr-2">
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
      <Button onClick={() => router.push("produk_form")} variant="success">Tambah Produk</Button>
    </Container>
  );
}

