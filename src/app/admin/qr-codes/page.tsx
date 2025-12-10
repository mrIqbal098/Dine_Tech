"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function QRCodesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    import("@/lib/api").then(({ apiFetch }) =>
      apiFetch("/api/restaurants")
        .then((res) => res.json())
        .then((data) => {
          setRestaurants(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
          setLoading(false);
        })
    );
  }, []);

  const generateQRCodeUrl = (slug: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const menuUrl = `${baseUrl}/restaurant/${slug}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(menuUrl)}`;
  };

  const downloadQRCode = (slug: string, name: string) => {
    const qrUrl = generateQRCodeUrl(slug);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${name.replace(/\s+/g, '-')}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                QR Code Generator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Generate QR codes for your restaurant menus
              </p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    How to use QR Codes:
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Download QR codes for each restaurant</li>
                    <li>Print and place them on tables, menus, or entrance</li>
                    <li>Customers scan to instantly view your digital menu</li>
                    <li>No app installation required - works in any browser</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-orange-600" />
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription>{restaurant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* QR Code Image */}
                  <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={generateQRCodeUrl(restaurant.slug)}
                      alt={`QR Code for ${restaurant.name}`}
                      className="w-64 h-64"
                    />
                  </div>

                  {/* URL Display */}
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Menu URL:
                    </p>
                    <p className="text-sm font-mono text-slate-900 dark:text-white break-all">
                      /restaurant/{restaurant.slug}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadQRCode(restaurant.slug, restaurant.name)}
                      className="flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Link
                      href={`/restaurant/${restaurant.slug}`}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Preview
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No restaurants found. Add a restaurant first.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
