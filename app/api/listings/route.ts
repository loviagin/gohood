import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function GET(req: NextRequest) {
  await dbConnect();
  const listings = await Listing.find({});
  return NextResponse.json(listings);
}