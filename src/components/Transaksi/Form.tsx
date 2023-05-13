import {
  Segment,
  Form,
  InputOnChangeData,
  DropdownProps,
} from "semantic-ui-react";
import {
  ADD_TRANSAKSI,
  DUPLICATE_TRANSAKSI,
  TransaksiQuery,
} from "@/lib/queries";
import { QueryResult, useMutation } from "@apollo/client";

import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { toast } from "react-hot-toast";
export default function TransaksiForm(props: { dataTransaksi: QueryResult, username: string }) {
  const { data, refetch, loading } = props.dataTransaksi;

  const [transaksiForm, setTransaksiForm] = useState<{
    barang: string;
    harga: string;
    jumlah: number;
  }>({
    barang: "",
    harga: "0",
    jumlah: 0,
  });
  const [barangError, setBarangError] = useState(false);
  const [jumlahError, setJumlahError] = useState(false);

  const [createMutation] = useMutation(ADD_TRANSAKSI, {
    variables: {
      username: props.username,
      jumlah: transaksiForm.jumlah,
      idBarang: transaksiForm.barang,
    },
    onCompleted: () => {
      refetch();
    },
  });
  const [duplicateMutation] = useMutation(DUPLICATE_TRANSAKSI, {
    variables: {
      jumlah: transaksiForm.jumlah,
      idBarang: transaksiForm.barang,
    },
    onCompleted: () => {
      refetch();
    },
  });

  function dropHandler(_e: SyntheticEvent, { value }: DropdownProps) {
    setTransaksiForm({
      ...transaksiForm,
      harga: data.barang.filter((brg: any) => brg.id == value)[0].harga,
      barang: value as string,
    });
  }

  function inputHandler(_e: ChangeEvent, { name, value }: InputOnChangeData) {
    switch (name) {
      case "harga": {
        setTransaksiForm({
          ...transaksiForm,
          harga: value,
        });
        break;
      }
      case "jumlah": {
        setTransaksiForm({
          ...transaksiForm,
          jumlah: value === "" ? 0 : parseInt(value),
        });
        break;
      }
    }
  }

  function submitHandler(_event: FormEvent) {
    if (transaksiForm.barang === "") setBarangError(true);
    else if (transaksiForm.jumlah === 0) setJumlahError(true);
    else {
      setBarangError(false);
      setJumlahError(false);

      const dupli = data.transaksi.filter(
        (data: TransaksiQuery) => data.barang.id === transaksiForm.barang
      );
      if (dupli.length !== 0) {
        duplicateMutation();
      } else {
        createMutation();
      }

      toast.success("Barang telah ditambahkan")
      setTransaksiForm({ barang: "", harga: "0", jumlah: 0 });
    }
  }
  return (
    <Segment className="sm:w-[250px] h-min">
      {!loading && (
        <Form onSubmit={submitHandler}>
          <Form.Select
            error={
              barangError
                ? {
                    content: "Pilihlah Barang!",
                    pointing: "below",
                  }
                : false
            }
            required
            fluid
            label="Barang"
            placeholder="Barang"
            value={transaksiForm.barang}
            onChange={dropHandler}
            options={data.barang.map((opsi: { id: string; nama: string }) => {
              return {
                key: opsi.id,
                text: opsi.nama,
                value: opsi.id,
              };
            })}
          />
          <Form.Input
            type="number"
            name="harga"
            fluid
            readOnly
            label="Harga"
            value={transaksiForm.harga}
          />
          <Form.Input
            error={ jumlahError
                ? {
                    content: "Tambahkan jumlah barang",
                    pointing: "below",
                  }
                : false
}
            type="number"
            name="jumlah"
            fluid
            label="Jumlah"
            value={transaksiForm.jumlah.toFixed()}
            onChange={inputHandler}
          />
          <Form.Button type="submit" >Tambah</Form.Button>
        </Form>
      )}
    </Segment>
  );
}
