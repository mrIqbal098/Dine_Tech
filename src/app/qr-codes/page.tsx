"use client";

import { useEffect, useState } from "react";
import { getAllRestaurants } from "@/lib/firestore";

export default function QRPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [base, setBase] = useState("");

  useEffect(() => {
    setBase(window.location.origin);

    (async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
    })();
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-3 gap-4">
      {restaurants.map((r) => (
        <div key={r.id} className="border p-4 rounded">
          <h3 className="font-semibold mb-2">{r.name}</h3>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${base}/restaurant/${r.slug}`}
            alt="QR Code"
            className="mx-auto"
          />
        </div>
      ))}
    </div>
  );
}
