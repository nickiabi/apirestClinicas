import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmins } from "@/lib/RepoAdmins";
import { ResultSave } from "@/lib/types/TypesResult";
import Head from "next/head";

interface AdminApiRequest extends NextApiRequest {
  body: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;

  try {
    switch (method) {
      case "OPTIONS":
        res.setHeader("Allow", "HEAD, GET, POST, PUT, DELETE");
        res.status(200).end();
        break;
      case "HEAD":
        res.status(200).end();
        break;
      case "POST":
        await createAdmin(req, res);
        break;
      default:
        res.status(405).json({});
        break;
    }
  } catch (error) {
    console.log(typeof error);
    res.status(500).json({});
  }
}

const createAdmin = async (
  req: AdminApiRequest,
  res: NextApiResponse<ResultSave>
) => {
  const admin = await repoAdmins.save(req.body);
  res
    .status(201)
    .setHeader("Location", `${process.env.APIURL}/administrador/${admin.id}`)
    .json(admin);
};
