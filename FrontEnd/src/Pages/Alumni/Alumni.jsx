import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AlumniSearch() {
    const { data: session } = useSession();
    const [companyId, setCompanyId] = useState("");
    const [alumni, setAlumni] = useState([]);

    const fetchAlumni = async () => {
        const res = await fetch(`/api/alumni?companyId=${companyId}`);
        const data = await res.json();
        setAlumni(data.elements || []);
    };

    return (
        <div className="container">
            <h1>Find Alumni by Company</h1>

            {!session ? (
                <button onClick={() => signIn("linkedin")}>
                    Sign in with LinkedIn
                </button>
            ) : (
                <>
                    <button onClick={() => signOut()}>Sign Out</button>
                    <input
                        type="text"
                        placeholder="Enter Company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                    />
                    <button onClick={fetchAlumni}>Search Alumni</button>

                    <ul>
                        {alumni.map((person) => (
                            <li key={person.publicIdentifier}>
                                {person.firstName} {person.lastName} -{" "}
                                {person.headline}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
