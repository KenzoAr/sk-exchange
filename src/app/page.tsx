"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ExchangeRateApp() {
const [clp, setClp] = useState<number | "">(1000);

  // Inicializamos el valor como una cadena vacía
  const [usdRate, setUsdRate] = useState(null);
  const [blueRate, setBlueRate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const [usdResponse, blueResponse] = await Promise.all([
          fetch("https://api.exchangerate-api.com/v4/latest/CLP"),
          fetch("https://api.bluelytics.com.ar/v2/latest"),
        ]);

        if (!usdResponse.ok || !blueResponse.ok) {
          throw new Error("Error en la obtención de datos");
        }

        const usdData = await usdResponse.json();
        const blueData = await blueResponse.json();

        setUsdRate(usdData.rates.USD || 0);
        setBlueRate(blueData.blue.value_sell || 0);
        setLastUpdate(new Date().toLocaleString());
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setError(true);
      }
    }

    fetchRates();
  }, []);

const toUSD = usdRate && clp ? (clp * usdRate).toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A";
const toARS = blueRate && usdRate && clp ? (parseFloat(toUSD.replace(/\./g, "").replace(",", ".")) * blueRate).toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A";
  

  return (
    <div 
      className="p-4 flex flex-col items-center min-h-screen bg-gray-100"
      style={{ backgroundImage: "url('https://pbs.twimg.com/media/GR-ORteaAAEShke?format=jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Carter+One&display=swap');
      `}</style>
      <motion.h1 
        className="text-xl font-bold mb-4"
        style={{ fontFamily: 'Carter One, sans-serif', color: 'white' }}
        animate={{ scale: 1.1 }}
      >
        Calculadora Stray Kids
      </motion.h1>
      <Card className="w-full max-w-md p-4 bg-white">
        <CardContent className="flex flex-col gap-4">

<Input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={clp === "" ? "" : clp.toLocaleString("es-CL")}
  onChange={(e) => {
    const rawValue = e.target.value.replace(/\./g, ""); // Elimina los puntos
    setClp(rawValue === "" ? "" : Number(rawValue));
  }}
  placeholder="Ingrese monto en CLP"
  className="bg-white"
/>




          {error ? (
            <div className="text-red-500 text-center">Error obteniendo datos</div>
          ) : (
            <>
              <div className="text-lg font-semibold">USD: ${toUSD}</div>
              <div className="text-lg font-semibold">ARS (Oficial): ${toARS}</div>
              <div className="text-sm text-gray-500 mt-2">
  		Dólar Oficial: ${blueRate || "N/A"}  
  		<span className="block">Actualizado: {lastUpdate}</span>
	     </div>

            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
