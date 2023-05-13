import { DELETE_TRANSAKSI, TransaksiQuery } from "@/lib/queries";
import { QueryResult, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { Table, Loader, Icon } from "semantic-ui-react";

export default function TransaksiBody(props: { dataTransaksi: QueryResult }) {
  const { loading, data, error, refetch } = props.dataTransaksi;

  const [delTransaksi] = useMutation(DELETE_TRANSAKSI, {
    onCompleted() {
      refetch()
      toast.success("Berhasil menghapus transaksi")
    }
  });

  if (loading)
    return (
      <Table.Row>
        <Table.Cell colSpan="5">
          <Loader size="mini" active inline="centered">
            Loading
          </Loader>
        </Table.Cell>
      </Table.Row>
    );
  if (error)
    return (
      <Table.Row>
        <Table.Cell colSpan="5">{error.message}</Table.Cell>
      </Table.Row>
    );
  if (data.transaksi.length === 0)
    return (
      <Table.Row>
        <Table.Cell colSpan="5">Data Transaksi Kosong</Table.Cell>
      </Table.Row>
    );
  return data.transaksi.map((transaksi: TransaksiQuery) => (
    <Table.Row key={transaksi.id}>
      <Table.Cell>{transaksi.barang.nama}</Table.Cell>
      <Table.Cell>
        {transaksi.barang.harga.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}
      </Table.Cell>
      <Table.Cell >{transaksi.jumlah}</Table.Cell>
      <Table.Cell collapsing>
        <div className="flex flex-row justify-between">
        {(transaksi.barang.harga * transaksi.jumlah).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}

        <Icon name="trash" onClick={() => delTransaksi({
            variables: {
              transaksiId: transaksi.id
            }
          })} className="!ml-5 hover:cursor-pointer"/>
        </div>
      </Table.Cell>
    </Table.Row>
  ));
}
