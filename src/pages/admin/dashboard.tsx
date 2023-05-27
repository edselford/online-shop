import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, ChangeEvent, useState } from "react";
import { Navbar } from "flowbite-react";
import axios from "axios"

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

  const [selectedFile, setSelectedFile] = useState<File>()


const imageHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const file = target.files[0];
      setSelectedFile(file);
    }
  }

  return (
    <>
    <Navbar>
      <Navbar.Brand>
        Dashboard
      </Navbar.Brand>
    </Navbar>
    <h1>Testing</h1>
    <input type="file" onChange={imageHandler} />
    <button onClick={() => {
      if (!selectedFile) return
      const fr = new FormData();
      fr.append("uploadedFile", selectedFile)
      axios.post("/api/upload", fr)
      console.log(selectedFile.name)
    }}>submit</button>
    </>
  );
}
