import Navbar from "@/components/Admin/Navbar";
import { DELETE_USER, USER_QUERY } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Container, Table, Button } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  host: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({
  props: { host: context.req.headers.host || null },
});

export default function({ host }: Props) {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth/signin?callbackUrl=http://${host}/admin/customer`);
    }
  });

  const data = useQuery(USER_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted() {
      toast.success("Delete succesfull")
      data.refetch();
    }
  })
  
  if (session.status == "loading") {
    return "loading data..";
  }

  if (session.data.user.role == "USER") {
    router.push("/");
    return;
  }

  if (data.loading) {
    return "Loading"
  }
  
  return <Container>
    <Toaster/>
    <Navbar username={session.data.user.name} />
    <h2>Master Customer</h2>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.data.user.map((user: User) => <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td><Button onClick={() => deleteUser({
              variables: {
                id: user.id
              }
            })} variant="danger">Delete</Button></td>
          </tr>)}
        </tbody>
      </Table>
  </Container>
}