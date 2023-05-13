import TransaksiBody from "@/components/Transaksi/Body";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Header, Icon, Table } from "semantic-ui-react";
import { HOME_QUERY, SAVE_TO_JUAL, TransaksiQuery } from "@/lib/queries";
import TransaksiForm from "@/components/Transaksi/Form";
import { signOut } from "next-auth/react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

export default function ({ session }: { session: any }) {
  const data_transaksi = useQuery(HOME_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [saveToJual] = useMutation(SAVE_TO_JUAL, {
    onCompleted() {
      data_transaksi.refetch();
      toast.success("Transaksi berhasil di simpan");
    },
  });

  const saveHandler = () => {
    if (data_transaksi.loading) return;

    if (data_transaksi.data.transaksi.length === 0) {
      toast.error("Data Transaksi Kosong");
      return;
    }

    saveToJual({
      variables: {
        total: data_transaksi.data.transaksi.reduce(
          (a: number, b: TransaksiQuery) => a + b.jumlah * b.barang.harga,
          0
        ),
        tanggal: dayjs().toString(),
        transaksiIds: data_transaksi.data.transaksi.map((tmp: TransaksiQuery) => tmp.id),
      },
    });
  };

  return (
    <>
      <TransaksiForm
        dataTransaksi={data_transaksi}
        username={
          session.status === "authenticated" ? (session.data?.user?.name as string) : "user"
        }
      />
      <Table unstackable className="sm:!w-full !h-min sm:!ml-5 !mt-0">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              <Header>
                <Header.Content>
                  Transaksi
                  <Header.Subheader>
                    {session.status === "authenticated" ? (
                      <span className="!text-gray-400">
                        Logged as {session.data?.user?.name}{" "}
                        <Icon onClick={() => signOut()} name="log out" />
                      </span>
                    ) : (
                      ""
                    )}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="2" textAlign="right">
              {dayjs().format("dddd, DD MMMM YYYY")}
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Nama Barang</Table.HeaderCell>
            <Table.HeaderCell>Harga</Table.HeaderCell>
            <Table.HeaderCell>Jumlah</Table.HeaderCell>
            <Table.HeaderCell>Sub-Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TransaksiBody dataTransaksi={data_transaksi} />
        </Table.Body>
        {data_transaksi.data && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                <Button onClick={saveHandler}>Simpan</Button>
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Total</Table.HeaderCell>
              <Table.HeaderCell>
                {data_transaksi.data.transaksi
                  .reduce((a: number, b: TransaksiQuery) => a + b.jumlah * b.barang.harga, 0)
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
}
