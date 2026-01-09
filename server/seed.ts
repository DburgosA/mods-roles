import { connectDB } from "./mongodb";
import { RoleModel } from "./models";

const defaultRoles = [
  { title: "Moderador", description: "Encargado de moderar el chat y mantener el orden" },
  { title: "Administrador", description: "Gestiona la comunidad y los moderadores" },
  { title: "Soporte Técnico", description: "Ayuda con problemas técnicos" },
  { title: "Eventos", description: "Organiza y coordina eventos" },
  { title: "Bienvenidas", description: "Da la bienvenida a nuevos miembros" },
];

async function seed() {
  await connectDB();
  
  const existingRoles = await RoleModel.countDocuments();
  
  if (existingRoles > 0) {
    console.log(`Ya existen ${existingRoles} roles. No se agregaron nuevos.`);
    process.exit(0);
  }

  console.log("Creando roles por defecto...");
  
  for (const role of defaultRoles) {
    await RoleModel.create(role);
    console.log(`✅ Creado: ${role.title}`);
  }

  console.log("\n🎉 Seed completado!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});
