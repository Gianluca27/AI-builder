import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("📁 Directorio actual:", __dirname);

dotenv.config();

console.log("\n🔍 Variables de entorno:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("OPENAI_API_KEY existe:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY longitud:", process.env.OPENAI_API_KEY?.length);
console.log(
  "OPENAI_API_KEY primeros 20 chars:",
  process.env.OPENAI_API_KEY?.substring(0, 20)
);

if (!process.env.OPENAI_API_KEY) {
  console.error("\n❌ OPENAI_API_KEY NO ESTÁ CARGADA");
  console.log("\n📋 Checklist:");
  console.log("1. ¿Existe el archivo backend/.env?");
  console.log("2. ¿La línea dice OPENAI_API_KEY=sk-... (sin comillas)?");
  console.log("3. ¿La key empieza con 'sk-proj-' o 'sk-'?");
} else {
  console.log("\n✅ OPENAI_API_KEY CARGADA CORRECTAMENTE");
}
