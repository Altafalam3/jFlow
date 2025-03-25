import axios from "axios";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { companyId } = req.query;
    const accessToken = session.accessToken;

    try {
        const response = await axios.get(
            `https://api.linkedin.com/v2/search?q=people&currentCompany=${companyId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alumni data" });
    }
}
