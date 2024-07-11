import { getServerSideConfig } from "@/app/config/server";
import { ModelProvider } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse, NextApiRequest } from "next";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

async function handle(
  req: NextRequest,
  res: NextApiResponse,
  { params }: { params: { path: string[] } },
) {
  console.log("[Azure Route] params ", params);

  if (req.method === "OPTIONS") {
    return res.status(200).json({ body: "OK" });
  }

  const subpath = params.path.join("/");

  const authResult = auth(req, ModelProvider.GPT);
  if (authResult.error) {
    return res.status(401).json(authResult);
  }

  try {
    return await requestOpenai(req, (await req.text()) as any);
  } catch (e) {
    console.error("[Azure] ", e);
    return res.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

// export const runtime = "edge";
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];
