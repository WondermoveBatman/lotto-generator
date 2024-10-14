// pages/api/lotto.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      "https://www.dhlottery.co.kr/common.do?method=main"
    );
    const $ = load(response.data);

    const numbers = $(".win_result strong")
      .map((_, el) => parseInt($(el).text().trim()))
      .get();

    const bonusNumber = parseInt($(".bonus strong").text().trim());

    res.status(200).json({ numbers, bonusNumber });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lotto numbers" });
  }
}
