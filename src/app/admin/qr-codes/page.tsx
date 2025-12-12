"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRestaurants } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Download, ExternalLink } from "lucide-react";

export default function QRCodesPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await getAllRestaurants();
      setRestaurants(all);
      setLoading(false);
    })();
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

  const qr = (slug: string) => `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`${baseUrl}/restaurant/${slug}`)}`;

  const download = (slug: string, name: string) => {
    const link = document.createElement("a");
    link.href = qr(slug);
    link.download = `${name.replace(/\s+/g, "-")}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(r => (
            <Card key={r.id}>
              <CardHeader><CardTitle className="flex items-center gap-2"><QrCode />{r.name}</CardTitle><CardDescription>{r.description}</CardDescription></CardHeader>
              <CardContent>
                <div className="mb-4">
                  <img src={qr(r.slug)} className="w-64 h-64" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => download(r.slug, r.name)} className="flex-1"><Download /> Download</Button>
                  <Link href={`/restaurant/${r.slug}`} target="_blank" className="flex-1"><Button variant="outline"><ExternalLink /> Preview</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
