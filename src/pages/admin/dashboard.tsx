import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, ChangeEvent, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Admin/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import prisma from "@/lib/prisma";
import { Container, Row, Col } from "react-bootstrap";

interface Props {
  host: string | null;
  car_count: number;
  check_count: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      host: context.req.headers.host || null,
      car_count: await prisma.car.count(),
      check_count: await prisma.checkout.count(),
    },
  };
};

export default function ({ host, car_count, check_count }: Props) {
  const session = useSession();
  const router = useRouter();

  if (session.status == "loading") {
    return "loading data..";
  }

  if (session.status == "unauthenticated") {
    router.push(`/auth/signin?callbackUrl=http://${host}/admin/dashboard`);
    return;
  }

  if (session.data?.user.role == "USER") {
    router.push("/");
    return;
  }

  return (
    <>
      <Navbar username={session.data?.user.name} />
      <Container>
        <Row>
          <Col md={4} className="bg-[#dfdfdf] pb-[60px] px-[20px] pt-[10px] m-3">
            <h4>CUSTOMER</h4>
            <h4 className="text-[56pt]">{check_count}</h4>
          </Col>
          <Col md={4} className="bg-[#dfdfdf] pb-[60px] px-[20px] pt-[10px] m-3">
            <h4>PRODUK</h4>
            <h4 className="text-[56pt]">{car_count}</h4>
          </Col>
        </Row>
      </Container>
    </>
  );
}
