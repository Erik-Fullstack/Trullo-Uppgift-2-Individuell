# 📌 Examinationsuppgift – Trullo

## 💡 Teoretiska resonemang

### Val av databas
Jag valde att använda MySQL då arbetsplatsen jag ska ha min LIA på använder det mestadels, även om det inte är med prisma så såg jag det som ett bra tillfälle att sätta mig in lite grann i det igen då det var ett bra tag sen jag använde det. Likaså använder jag docker som server med en MySQL image då jag vill fördjupa mig mer i det.

### Använda tekniker och npm-paket
Jag har "standard" paketen när det gäller backend i node (express, dotenv, bcrypt, jsonwebtoken, zod) för env filer, hashning av lösenord och session-tokens.  
Jag använder även faker för seed-data och swagger-ui-express för att visa en "swagger/openAPI" med mina routes.

### Applikationens översikt
Appen är en API som hanterar "users" och "tasks", users är en tabell med raderna: "name", "email", "password" och en optional enum "role" som defaultar till "MEMBER".

Tasks är en tabell med raderna: "title" och "description" med 2 optional keys "assignedTo" som sätter en relation till en user eller defaultar till null och enum "status" som defaultar till TODO.

Seed.ts är ett seed som skapar 10 användare och 20 tasks samt 1 admin och 1 member med hårdkodade värden (name: "admin", email: "admin@mail.com", password: "admin" och name: "member", email: "member@mail.com", password: "member") för att kunna testa authentication/authorization med middlewares och jwt.

Routen "/login" finns även för att logga in med en användares email och lösenord för att skapa en token.

Just nu finns bara en route med auth för att underlätta att slippa skapa nya admins/members och logga in dem varje gång man vill testa med ny data. Routen är "/users/:id" med DELETE för att kunna testa AUTH över huvudtaget. I den routen så kan enbart personer med ADMIN rollen radera alla användare och MEMBERS kan enbart radera sig själva.

När tasks skapas så kan dom skapas med utan en user och assignedTo är då null men den kan sättas till en användares id i routen "tasks/assign/:taskId" som enbart är till för att assigna en user till en task eller genom att patcha/updatera en task i "tasks/:id".

Raderas en användare som har tasks assignade till sig så sätts assignedTo till null i tasken.

---

## ⚙️ Installation & Setup

### Förkrav
- Docker Desktop  
- Node.js / VSCode (eller annan editor)

### Första gången setup
1. Clona ner repot och öppna Docker Desktop.  
2. I repot, ladda ner paket som krävs:
   ```bash
   npm i
   ```
3. Skapa en `.env` och kopiera över de 4 variablarna från `.env_example`.  
   Variablarna går att ändra till valfria förutom `DATABASE_URL` som har vissa variablar satta i docker-compose filen. Vill du ändra dom så måste du även ändra där innan du går vidare med setup!  
4. Kör sedan:
   ```bash
   npm run setup
   ```
   Detta kommando kommer att ladda ned en MySQL image från Docker, generera en Prisma-klient med migrationen som finns i repot och sedan seeda databasen och starta servern.

### Seeda om databasen
```bash
npm run seed
```
(OBS: fungerar endast om docker containern är igång)

Det går även att köra en lokal DB men då krävs MAMP eller liknande med en MySQL-databas.

### Se databsen visuellt
https://trullo-frontend.netlify.app/
Denna deployade frontend fungerar med backenden för att testa routes mer visuellt.
(Denna frontend är modifierad från ett annat projekt så koden och stylingen är inte perfekt men alla routes är funktionella!)

Utan frontend så fungerar prisma studio för att se datan så länge databasen+api körs lokalt/docker och testa routes med thunderclient/postman.
```base
npx prisma studio
```

---

## 🔑 Autentisering & Roller
För att få tillgång till DELETE users behövs en login via `/login` routen först.  

- **Admin** kan radera alla användare.  
- **Member** kan enbart radera sig själv.  

### Testkonton
- **Admin**
  - Email: `admin@mail.com`
  - Password: `admin`
- **Member**
  - Email: `member@mail.com`
  - Password: `member`

---

## 📚 Dokumentation
Swagger/OpenAPI-dokumentation finns tillgänglig på:  
👉 `http://localhost:3000/docs` (eller den port du anger i `.env`)  
