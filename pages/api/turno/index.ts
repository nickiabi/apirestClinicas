import type { NextApiRequest, NextApiResponse } from "next";
import { repoTurnos, ResultReserve } from "@/lib/RepoTurnos";

interface TurnApiRequest extends NextApiRequest {
  body: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    fecha: string;
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
        await createTurn(req, res);
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

const createTurn = async (
  req: TurnApiRequest,
  res: NextApiResponse<ResultReserve>
) => {
  const booking = await repoTurnos.reserve({
    ...req.body,
    fecha: new Date(req.body.fecha),
  });

  res
    .status(booking.wasReserved ? 201 : 400)
    .setHeader("Location", `${process.env.APIURL}/turno/${booking.turnID}`)
    .json(booking);
};
