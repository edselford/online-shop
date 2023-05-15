import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<{
  host: string | null;
}> = async (context) => ({
  props: { host: context.req.headers.host || null },
});

export default function ({ host }: { host: string | null }) {
  const session = useSession();
  const router = useRouter();

  if (session.status == "unauthenticated") {
    router.push(`/auth/signin?callbackUrl=http://${host}/admin/dashboard`);
    return;
  }

  if (session.data?.user.role == "USER") {
    router.push("/");
    return;
  }

  
  return (
    <div>
      <form >
      <h1>Tambah produk</h1>
      <div>
        <label>nama</label>
        <input type="text" />
      </div>
      <div>
        <label>deskripsi</label>
        <input type="text" />
      </div>
      <div>
        <label>harga</label>
        <input type="number" />
      </div>
      <div>
        <label>harga</label>
        <input type="number" />
      </div>
</form>
    </div>
  );
}
