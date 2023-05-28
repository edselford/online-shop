import Navbar from "@/components/Admin/Navbar";
import { CAR_QUERY } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { Car } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Table, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

  return (
    <Container>
      <Navbar username={session.data?.user.name} />
      <h2>Master Produk</h2>
      <hr />
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nama</th>
            <th>Brand</th>
            <th>Image</th>
            <th>Harga</th>
            <th>Stok</th>
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
                  <img className="object-cover h-[100px] w-[200px]" src={`/images/${car.image}`} />
                </td>
                <td>{car.price}</td>
                <td>{car.stock}</td>
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
    </Container>
  );
}
